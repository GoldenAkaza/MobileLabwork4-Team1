import React, { useState } from 'react';
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
  
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  
  IonButtons

} from '@ionic/react';
import { 
  personCircle, 
  checkmarkCircle, 
  chevronBackOutline
} from 'ionicons/icons';
import './Tasks.css';
import TaskItem from '../components/TaskItem'; 
import { useTasks } from './TaskContext';

const Tasks: React.FC = () => {
  const { tasks, toggleTaskCompletion, deleteTask, onEdit } = useTasks();

  

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar className= "custom-header">
          <IonButtons slot="start">
            <IonButton fill="clear">
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Study Planner</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content-background">
        <div className="welcome-content">
          
          <div className="welcome-section mono-font">
            <IonIcon icon={personCircle} size="large" color="primary" />
            <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Welcome, User!</span>
          </div>

          <h3 className="mono-font section-title">Add A New Task</h3>
          
          <IonLabel className="mono-font">Task Name</IonLabel>
          <div className="custom-input-container">
            <IonInput placeholder="Enter your task here" className="mono-font custom-input"></IonInput>
          </div>

          <IonLabel className="mono-font">Due Date</IonLabel>
          <div className="calendar-container">
            <IonDatetime presentation="date" size="cover" className="mono-font"></IonDatetime>
          </div>

          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol>
                <IonButton expand="block" fill="outline" className="btn-round">
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="block" className="btn-round2">
                  Add Task
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <h3 className="mono-font section-title" style={{ marginTop: '20px' }}>My Tasks</h3>
          <IonText color="medium" className="mono-font small-text">
            Tap to complete a task
          </IonText>

          <IonList lines="none" className="task-list">
            {tasks.map((task) => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onToggle={toggleTaskCompletion} 
                                onEdit={onEdit}
                                onDelete={deleteTask}
                            />
                        ))}
          </IonList>

          <div className="spacer"></div>
          <h3 className="mono-font section-title">Your Daily Quote</h3>
          <IonText color="medium" className="mono-font small-text">Read chapter 5</IonText>
          
          <div className="quote-card">
            <div className="quote-image-placeholder"></div>
            <div className="quote-content mono-font">
              <div className="quote-text">Believe in yourself!</div>
              <div className="quote-subtext">You are capable of amazing things.</div>
              <div className="quote-author">
                <div className="author-dot"></div>
                <span>Unknown</span>
              </div>
            </div>
          </div>

          <div className="spacer"></div>
            <h3 className="mono-font section-title">Your Completed Tasks</h3>
            
            <div className="completed-list">
                {/* 💡 ADDITION: Filter the tasks array to get only completed tasks */}
                {tasks.filter(t => t.completed).map((task) => (
                    // 💡 CHANGE: Use dynamic task data from the filtered list
                    <div key={task.id} className="completed-item">
                        <IonIcon icon={checkmarkCircle} color="primary" className="check-icon" />
                        <div className="mono-font">
                            <div className="task-text">{task.title}</div> {/* Use task.title */}
                            <div className="task-subtext">{task.notes || 'Task completed successfully!'}</div> {/* Use task.notes or a default message */}
                        </div>
                    </div>
                ))}
            </div>

          <div className="spacer"></div>
          <h3 className="mono-font section-title">Your Past Inspiration</h3>
          
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="6" style={{ paddingRight: '8px' }}>
                <div className="inspiration-card mono-font">
                  <span className="badge">Quote</span>
                  <p className="insp-quote">"Doubt kills more dreams than failure ever will."</p>
                  <div className="insp-footer">Finish an essay</div>
                </div>
              </IonCol>
              <IonCol size="6" style={{ paddingLeft: '8px' }}>
                <div className="inspiration-card mono-font">
                  <span className="badge">Quote</span>
                  <p className="insp-quote">"The best view comes after the hardest climb."</p>
                  <div className="insp-footer">Read course material</div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
          
          <div style={{ height: '80px' }}></div> 
        </div>
      </IonContent>

    </IonPage>
  );
};

export default Tasks;