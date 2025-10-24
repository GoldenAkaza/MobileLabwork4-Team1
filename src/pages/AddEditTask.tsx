import {
  IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader,
  IonInput, IonItem, IonLabel, IonList, IonPage, IonTextarea, IonTitle, IonToolbar
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../auth/AuthContext";
import { useHistory, useLocation } from "react-router-dom";

export default function AddEditTask() {
  const { user } = useAuth();
  const history = useHistory();
  const location = useLocation<{ id?: string } | undefined>();
  const taskId = location.state?.id;

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!taskId) return;
    (async () => {
      const snapshot = await getDoc(doc(db, "tasks", taskId));
      const data = snapshot.data();
      if (data) {
        setTitle(data.title ?? "");
        setNotes(data.notes ?? "");
        setDueDate(data.dueDate ?? undefined);
      }
    })();
  }, [taskId]);

  const save = async () => {
    if (!user) return;
    if (taskId) {
      await setDoc(
        doc(db, "tasks", taskId),
        { title, notes, dueDate: dueDate || null },
        { merge: true }
      );
    } else {
      await addDoc(collection(db, "tasks"), {
        title,
        notes,
        dueDate: dueDate || null,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    }
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
          <IonTitle>{taskId ? "Edit Task" : "Add Task"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={save}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Notes</IonLabel>
            <IonTextarea value={notes} onIonChange={e => setNotes(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Due Date</IonLabel>
            <IonDatetime
              presentation="date"
              value={dueDate}
              onIonChange={e => setDueDate(e.detail.value as string)}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
