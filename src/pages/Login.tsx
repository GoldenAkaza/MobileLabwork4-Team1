import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Link, useHistory } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

    const login = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.replace("/home");

    } catch (e: unknown) {
     setError(e instanceof FirebaseError ? e.message : String(e));
    }
  };


  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      history.replace("/home");
    } catch (e: unknown) {
      setError(e instanceof FirebaseError ? e.message : String(e));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Study Planner — Login</IonTitle>
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
        <IonButton expand="block" onClick={login}>Log in</IonButton>
        <IonButton expand="block" fill="outline" onClick={loginWithGoogle}>Continue with Google</IonButton>
        <p style={{ marginTop: 12 }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </IonContent>
    </IonPage>
  );
}
