import {
  IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList,
  IonPage, IonTitle, IonToolbar, IonText
} from "@ionic/react";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useHistory, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function Register() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const register = async () => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      history.replace("/home");
    } catch (e: unknown) {
      setError(e instanceof FirebaseError ? e.message : String(e));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
          </IonItem>
        </IonList>
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        <IonButton expand="block" onClick={register}>Sign up</IonButton>
        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </IonContent>
    </IonPage>
  );
}
