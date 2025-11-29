import React, { useState, useEffect } from "react";
import {
  IonBackButton,
  IonButtons,
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
  IonLoading,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If somehow opened without a user, bounce to login
  useEffect(() => {
    if (!user) {
      history.replace("/login");
    }
  }, [user, history]);

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!user || !user.email) {
      setError("No logged-in user.");
      return;
    }

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNew) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1) Re-authenticate with current password
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);

      // 2) Update password
      await updatePassword(user, newPassword);

      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNew("");
    } catch (e: unknown) {
      const msg =
        e instanceof FirebaseError
          ? e.message
          : "Failed to change password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>Change Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Current Password</IonLabel>
            <IonInput
              type="password"
              value={currentPassword}
              onIonChange={(e) => setCurrentPassword(e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">New Password</IonLabel>
            <IonInput
              type="password"
              value={newPassword}
              onIonChange={(e) => setNewPassword(e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Confirm New Password</IonLabel>
            <IonInput
              type="password"
              value={confirmNew}
              onIonChange={(e) => setConfirmNew(e.detail.value ?? "")}
            />
          </IonItem>
        </IonList>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
        {success && (
          <IonText color="success">
            <p>{success}</p>
          </IonText>
        )}

        <IonButton expand="block" onClick={handleChangePassword} className="ion-margin-top">
          Update Password
        </IonButton>

        <IonLoading isOpen={loading} message="Updating password..." />
      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;
