import React from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Welcome.css';

const Welcome: React.FC = () => {
  const history = useHistory();

  const handleStart = () => {
    history.push('/Home');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="welcome-container">
        <div className="welcome-content">
          <h1>To-Do</h1>
          <h3>Welcome to To-Do!</h3>
          <p>
            This simple app helps you organize your daily tasks easily.
            Add new tasks, mark them as done, and stay productive! For each
            completed task you’ll receive an inspirational quote.
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
