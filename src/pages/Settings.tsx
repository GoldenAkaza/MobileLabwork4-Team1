import React, { useEffect, useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
  IonAlert,
} from "@ionic/react";

import {
  mailOutline,
  lockClosedOutline,
  logOutOutline,
  notificationsOutline,
  calendarOutline,
  sunnyOutline,
  musicalNotesOutline,
  volumeHighOutline,
  trashOutline,
} from "ionicons/icons";

import { Preferences } from "@capacitor/preferences";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../auth/AuthContext";

type SettingsState = {
  push: boolean;
  dailyReminders: boolean;
  soundEffects: boolean;
  completionSound: boolean;
  darkMode: boolean,
};

const DEFAULTS: SettingsState = {
  push: true,
  dailyReminders: true,
  soundEffects: true,
  completionSound: true,
  darkMode: false,
};



export default function Settings() {
  const { user } = useAuth();
    const [s, setS] = useState<SettingsState>(DEFAULTS);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);
    const [busy, setBusy] = useState(false);
    const prefKey = user
    ? `studyplanner.settings.${user.uid}`: "studyplanner.settings.guest";


    // Load saved settings ONCE
    useEffect(() => {
      
        if (!user) return; // wait until we know who is logged in
        (async () => {
            const { value } = await Preferences.get({ key: prefKey });

            if (value) {
            // Use saved values exactly as the user left them
            setS(JSON.parse(value) as SettingsState);
            } else {
            // First run — store defaults
            await Preferences.set({
                key: prefKey,
                value: JSON.stringify(DEFAULTS),
            });
            setS(DEFAULTS);
            }
            setSettingsLoaded(true);
        })();
    }, [user, prefKey]);



    // Save whenever settings change
    useEffect(() => {
        if (!settingsLoaded) return; // avoid overwriting before initial load
        Preferences.set({ key: prefKey, value: JSON.stringify(s) });
    }, [s, settingsLoaded, prefKey, user]);

    const toggleTheme = () => {
        setS((prev) => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const themeLabel = s.darkMode ? "Dark" : "Light";

    useEffect(() => {
      document.body.classList.toggle("dark", s.darkMode);
    }, [s.darkMode]);


    const onToggle =
    (key: keyof SettingsState) =>
    (ev: CustomEvent<{ checked: boolean }>) => {
        setS((prev) => ({ ...prev, [key]: ev.detail.checked }));
    };

    // Clear All Data
  const handleClearAllData = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const qTasks = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const snap = await getDocs(qTasks);
      // delete in parallel (for small personal datasets this is fine)
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "tasks", d.id))));
      alert("All your tasks were deleted.");
    } catch (e) {
      console.error(e);
      alert("Failed to clear data. See console for details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* Account */}
        <IonList inset>
          <IonItem lines="full">
            <IonIcon slot="start" icon={mailOutline} />
            <IonLabel>
              <h2>Account</h2>
              <p>Email</p>
            </IonLabel>
            <IonNote slot="end">{user?.email ?? "your.email@example.com"}</IonNote>
          </IonItem>

          <IonItem button routerLink="/change-password">
           <IonIcon slot="start" icon={lockClosedOutline} />
           <IonLabel>Change Password</IonLabel>
           <IonNote slot="end">…</IonNote>
          </IonItem>

          <IonItem button detail={false} onClick={() => signOut(auth)} lines="none">
            <IonIcon slot="start" icon={logOutOutline} color="danger" />
            <IonLabel color="danger">Log Out</IonLabel>
          </IonItem>
        </IonList>

        {/* Notifications */}
        <IonList inset>
          <IonItem lines="full">
            <IonLabel>
              <h2>Notifications</h2>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonIcon slot="start" icon={notificationsOutline} />
            <IonLabel>Push Notifications</IonLabel>
            <IonToggle
              checked={s.push}
              onIonChange={onToggle("push")}
            />
          </IonItem>

          <IonItem>
            <IonIcon slot="start" icon={calendarOutline} />
            <IonLabel>Daily Reminders</IonLabel>
            <IonToggle
              checked={s.dailyReminders}
              onIonChange={onToggle("dailyReminders")}
            />
          </IonItem>
        </IonList>

        {/* Appearance & Sound */}
        <IonList inset>
          <IonItem lines="full">
            <IonLabel>
              <h2>Appearance & Sound</h2>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonIcon slot="start" icon={sunnyOutline} />
            <IonLabel>Theme</IonLabel>
            <IonButton slot="end" size="small" onClick={toggleTheme}>
                {themeLabel}
            </IonButton>
          </IonItem>

          <IonItem>
            <IonIcon slot="start" icon={musicalNotesOutline} />
            <IonLabel>Sound Effects</IonLabel>
            <IonToggle
              checked={s.soundEffects}
              onIonChange={onToggle("soundEffects")}
            />
          </IonItem>

          <IonItem>
            <IonIcon slot="start" icon={volumeHighOutline} />
            <IonLabel>Task Completion Sound</IonLabel>
            <IonToggle
              checked={s.completionSound}
              onIonChange={onToggle("completionSound")}
            />
          </IonItem>
        </IonList>

        {/* Data */}
        <IonList inset>
          <IonItem lines="full">
            <IonLabel>
              <h2>Data</h2>
            </IonLabel>
          </IonItem>

          <IonItem
            button
            detail={false}
            onClick={() => setConfirmClear(true)}
          >
            <IonIcon slot="start" icon={trashOutline} color="danger" />
            <IonLabel color="danger">Clear All Data</IonLabel>
          </IonItem>
        </IonList>

        <IonAlert
          isOpen={confirmClear}
          header="Clear All Data?"
          message="This will permanently delete all your tasks. This cannot be undone."
          buttons={[
            { text: "Cancel", role: "cancel", handler: () => setConfirmClear(false) },
            {
              text: "Delete",
              role: "destructive",
              handler: () => {
                setConfirmClear(false);
                handleClearAllData();
              },
            },
          ]}
          onDidDismiss={() => setConfirmClear(false)}
        />

        {busy && (
          <div style={{ padding: 12, textAlign: "center", opacity: 0.7 }}>
            Working…
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
