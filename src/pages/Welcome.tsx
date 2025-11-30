import React from 'react';
import { IonPage, IonContent, IonButton,IonHeader, IonToolbar, IonButtons, IonTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Welcome.css';

const Welcome: React.FC = () => {
  const history = useHistory();

  const handleStart = () => {
    history.push('/Home');
  };

  return (
    <IonPage>

        <IonHeader>
            <IonToolbar className= "custom-header">
                <IonButtons slot="start">
                    <IonButton fill="clear">
                    </IonButton>
                  </IonButtons>
                <IonTitle>My Study Planner</IonTitle>
            </IonToolbar>
        </IonHeader>


      <IonContent className="welcome-container">
        <div className="welcome-content">
          <h3>My study planner</h3>
          <p>
            This simple app helps you organize your daily tasks easily.
            Add new tasks, mark them as done, and stay productive! For each
            completed task you'll receive an inspirational quote.
          </p>

          <IonButton className="start-button" onClick={handleStart}>
            Start
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
