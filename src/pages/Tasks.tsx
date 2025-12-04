import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  IonDatetime,
  IonButton,
  IonList,
  IonCheckbox,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonItem,
  IonButtons,
  IonToast
} from "@ionic/react";
import {
  checkmarkCircle,
  chevronBackOutline,
  personCircle,
  trashOutline,
} from "ionicons/icons";
import "./Tasks.css";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../auth/AuthContext";
import { useHistory } from "react-router-dom";
import { getMotivationalQuote } from "../services/quotes";

type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: number;
};

type PastQuote = {
  quote: string;
  author: string;
};

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [recentQuotes, setRecentQuotes] = useState<PastQuote[]>([]);


  // Tasks from Firestore for this user
  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const rows: Task[] = snap.docs.map((d) => {
        const data = d.data() as {
          title?: string;
          dueDate?: string | null;
          completed?: boolean;
          createdAt?: Timestamp | number;
        };

        const createdAtField = data.createdAt;
        const createdAtMs =
          createdAtField instanceof Timestamp
            ? createdAtField.toMillis()
            : typeof createdAtField === "number"
            ? createdAtField
            : Date.now();

        return {
          id: d.id,
          title: data.title ?? "",
          dueDate: data.dueDate ?? null,
          completed: Boolean(data.completed),
          createdAt: createdAtMs,
        };
      });

      setTasks(rows);
    });

    return () => unsub();
  }, [user]);

  // Gets the 2 previous quotes given for this user
  useEffect(() => {
    if (!user) return;

    const quotesRef = collection(db, "quotes");
    const q = query(
      quotesRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(2)
    );

    const unsub = onSnapshot(q, (snap) => {
      const rows: PastQuote[] = snap.docs.map((d) => {
        const data = d.data() as { quote?: string; author?: string };
        return {
          quote: data.quote ?? "",
          author: data.author ?? "Unknown",
        };
      });
      setRecentQuotes(rows);
    });

    return () => unsub();
  }, [user]);


  // Add task to Firestore
  const handleAddTask = async () => {
    if (!user) {
      alert("You must be logged in to add tasks.");
      return;
    }

    if (!newTaskText || !selectedDate) {
      alert("Please enter both a task name and a date!");
      return;
    }

    const formattedDate = selectedDate.split("T")[0];

    await addDoc(collection(db, "tasks"), {
      title: newTaskText,
      notes: "",
      dueDate: formattedDate,
      completed: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setNewTaskText("");
    setSelectedDate("");
  };

  const toggleComplete = async (task: Task) => {
    const next = !task.completed;

    await updateDoc(doc(db, "tasks", task.id), {
      completed: next,
      completedAt: serverTimestamp(),
    });

    // Firestore will refresh automatically, so there is no need to manually change state

    // If completing a task then it will show a quote
    if (next) {
      try {
        const { q, a } = await getMotivationalQuote();

        await addDoc(collection(db, "quotes"), {
        userId: user.uid,
        quote: q,
        author: a,
        createdAt: serverTimestamp(),
        });

        setToast({ show: true, message: `🎉 Nice work! “${q}” — ${a}` });
      } catch (err) {
        setToast({
          show: true,
          message: "🎉 Task completed! Keep it up!",
        });
      }
    }
  };

  // Delete from Firestore
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const handleCancel = () => {
    setNewTaskText("");
    setSelectedDate("");
  };

  return (
    <IonPage className="tasks-page">
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={() => history.goBack()}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Study Planner</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="tasks-container">
        <div className="tasks-content">
          <div className="tasks-section mono-font">
            <IonIcon icon={personCircle} size="large" color="primary" />
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
              Welcome, {user?.email ?? "User"}!
            </span>
          </div>

          <h3 className="mono-font section-title">Add A New Task</h3>

          <IonLabel className="mono-font">Task Name</IonLabel>
          <div className="custom-input-container">
            <IonInput
              placeholder="Enter your task here"
              className="mono-font custom-input"
              value={newTaskText}
              onIonChange={(e) => setNewTaskText(e.detail.value ?? "")}
            />
          </div>

          <IonLabel className="mono-font">Due Date</IonLabel>
          <div className="calendar-container dark-calendar">
            <IonDatetime
              presentation="date"
              size="cover"
              className="mono-font"
              value={selectedDate}
              onIonChange={(e) =>
                setSelectedDate(
                  Array.isArray(e.detail.value)
                    ? e.detail.value[0]
                    : (e.detail.value as string | null) ?? ""
                )
              }
            />
          </div>

          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  className="btn-round"
                  onClick={handleCancel}
                >
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  className="btn-round2"
                  onClick={handleAddTask}
                >
                  Add Task
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <h3
            className="mono-font section-title"
            style={{ marginTop: "20px" }}
          >
            My Tasks
          </h3>
          <IonText color="medium" className="mono-font small-text">
            Tap the checkbox to complete a task
          </IonText>

          <IonList lines="none" className="task-list">
            {tasks.map((task) => (
              <IonItem
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <IonCheckbox
                  slot="start"
                  checked={task.completed}
                  className="custom-checkbox"
                  onIonChange={() => toggleComplete(task)}
                />
                <div className="task-content mono-font">
                  <div className="task-text">{task.title}</div>
                  <div className="task-due">
                    Due: {task.dueDate ?? "No due date"}
                  </div>
                </div>

                <IonButton
                  slot="end"
                  fill="clear"
                  color="danger"
                  onClick={() => deleteTask(task.id)}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}

            {tasks.length === 0 && (
              <p style={{ textAlign: "center", color: "#888" }}>
                No tasks yet. Add one above!
              </p>
            )}
          </IonList>

          <div className="spacer"></div>

          <h3 className="mono-font section-title">Your Daily Quote</h3>
          <div className="quote-card">
            <div className="quote-image-placeholder"></div>
            <div className="quote-content mono-font">
              <div className="quote-text">Believe in yourself!</div>
              <div className="quote-subtext">
                You are capable of amazing things.
              </div>
              <div className="quote-author">
                <div className="author-dot"></div>
                <span>Unknown</span>
              </div>
            </div>
          </div>

          <div className="spacer"></div>

          <h3 className="mono-font section-title">Your Completed Tasks</h3>

          <div className="completed-list">
            {tasks
              .filter((t) => t.completed)
              .map((task) => (
                <div
                  className="completed-item"
                  key={task.id}
                  onClick={() => toggleComplete(task)}
                >
                  <IonIcon
                    icon={checkmarkCircle}
                    color="primary"
                    className="check-icon"
                  />
                  <div className="mono-font">
                    <div className="task-text">{task.title}</div>
                    <div className="task-subtext">
                      Done on {task.dueDate ?? "Unknown date"}
                    </div>
                  </div>
                </div>
              ))}
            {tasks.filter((t) => t.completed).length === 0 && (
              <p style={{ textAlign: "center", color: "#888" }}>
                No completed tasks yet.
              </p>
            )}
          </div>

          <div className="spacer"></div>

          <h3 className="mono-font section-title">Your Past Inspiration</h3>
          <IonGrid className="ion-no-padding">
            <IonRow>
              {recentQuotes.map((item, index) => (
                <IonCol
                  key={index}
                  size="6"
                  style={{
                    paddingRight: index === 0 ? "8px" : "0",
                    paddingLeft: index === 1 ? "8px" : "0",
                  }}
                >
                  <div className="inspiration-card mono-font">
                    <span className="badge">Quote</span>
                    <p className="insp-quote">"{item.quote}"</p>
                    <div className="insp-footer">
                      — {item.author || "Unknown"}
                    </div>
                  </div>
                </IonCol>
              ))}

              {recentQuotes.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    width: "100%",
                    color: "#888",
                    marginTop: "8px",
                  }}
                >
                  No past quotes yet. Complete a task to get started!
                </p>
              )}
            </IonRow>
          </IonGrid>

          <div style={{ height: "80px" }}></div>
        </div>
          <IonToast
            isOpen={toast.show}
            message={toast.message}
            duration={3500}
            onDidDismiss={() => setToast({ show: false, message: "" })}
          />
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
