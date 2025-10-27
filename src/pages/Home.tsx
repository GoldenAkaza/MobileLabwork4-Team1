import {
  IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList,
  IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar, IonToast
} from "@ionic/react";
import { add, logOutOutline } from "ionicons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  serverTimestamp,
  Timestamp,
  FirestoreDataConverter
} from "firebase/firestore";
import { useAuth } from "../auth/AuthContext";
import TaskItem, { Task } from "../components/TaskItem";
import { signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { getMotivationalQuote } from "../services/quotes";
import "./Home.css"


const taskConverter: FirestoreDataConverter<Task> = {
  toFirestore(task: Task) {
    return {
      title: task.title,
      notes: task.notes ?? null,
      dueDate: task.dueDate ?? null,
      completed: task.completed,
      userId: task.userId,
      createdAt: task.createdAt,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    const createdAtMs =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis()
        : typeof data.createdAt === "number"
        ? data.createdAt
        : Date.now();

    return {
      id: snapshot.id,
      title: data.title ?? "",
      notes: data.notes ?? undefined,
      dueDate: data.dueDate ?? undefined,
      completed: Boolean(data.completed),
      userId: data.userId ?? "",
      createdAt: createdAtMs,
    };
  },
};

export default function Home() {
  const { user, loading } = useAuth();
  const history = useHistory();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [busy, setBusy] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const tasksRef = useMemo(() => collection(db, "tasks").withConverter(taskConverter), []);
  const q = useMemo(() => {
    if (!user) return null;
    return query(
      tasksRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [tasksRef, user]);

  useEffect(() => {
    if (!q) {
      setBusy(false);
      setTasks([]);
      return;
    }

    // optional: show the spinner specifically while attaching the listener
    setBusy(true);

    const unsub = onSnapshot(
      q,
      (snap) => {
        setTasks(snap.docs.map((d) => d.data())); // typed by converter
        setBusy(false);
      },
      (err) => {
        console.error("[tasks onSnapshot] error:", err);

        // Firestore often gives a link to create the needed index.
        // If you see one in the console, click it and deploy the index.
        // Example message contains "You can create it here: https://console.firebase..."
        setToast({
          show: true,
          message:
            err?.message?.includes("insufficient permissions")
              ? "😕 Can't read tasks: check Firestore rules."
              : "⚠️ Error loading tasks. See console for details.",
        });
        setBusy(false);
      }
    );

    return () => unsub();
  }, [q]);

  const toggleComplete = async (task: Task, next: boolean) => {
    await updateDoc(doc(db, "tasks", task.id), { completed: next, completedAt: serverTimestamp() });
    if (next) {
      try {
        const { q, a } = await getMotivationalQuote();
        setToast({ show: true, message: `🎉 Nice work! “${q}” — ${a}` });
      } catch {
        setToast({ show: true, message: "🎉 Task completed! Keep it up!" });
      }
    }
  };

  const editTask = (task: Task) => {
    history.push("/task", { id: task.id });
  };

  const deleteTask = async (task: Task) => {
    await deleteDoc(doc(db, "tasks", task.id));
  };

  const addTask = () => history.push("/task");

  if (loading) return <IonLoading isOpen message="Loading..." />;

  return (
    <IonPage className="home-container">
      <IonHeader>
        <IonToolbar>
          <IonTitle><div className="home-content"><h1>My Study Planner</h1></div></IonTitle>
          <IonButtons slot="end">
            <IonButton className="start-button" onClick={() => signOut(auth)}>
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {busy ? <IonLoading isOpen message="Loading tasks..." /> :
          <IonList>
            {tasks.map(t => (
              <TaskItem key={t.id} task={t} onToggle={toggleComplete} onEdit={editTask} onDelete={deleteTask} />
            ))}
          </IonList>
        }

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={addTask}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={3500}
          onDidDismiss={() => setToast({ show: false, message: "" })}
        />
      </IonContent>
    </IonPage>
  );
}
