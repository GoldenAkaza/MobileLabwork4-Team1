import React, { useState } from "react";
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
} from "@ionic/react";
import {
  checkmarkCircle,
  chevronBackOutline,
  personCircle,
  trashOutline,
} from "ionicons/icons";
import "./Tasks.css";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish assignment", due: "2023-10-25", completed: false },
  ]);

  const [newTaskText, setNewTaskText] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleAddTask = () => {
    if (!newTaskText || !selectedDate) {
      alert("Please enter both a task name and a date!");
      return;
    }

    const formattedDate = selectedDate.split("T")[0];

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      due: formattedDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setNewTaskText("");
    setSelectedDate("");
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCancel = () => {
    setNewTaskText("");
    setSelectedDate("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-header">
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
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
              Welcome, User!
            </span>
          </div>

          <h3 className="mono-font section-title">Add A New Task</h3>

          <IonLabel className="mono-font">Task Name</IonLabel>
          <div className="custom-input-container">
            <IonInput
              placeholder="Enter your task here"
              className="mono-font custom-input"
              value={newTaskText}
              onIonChange={(e) => setNewTaskText(e.detail.value!)}
            ></IonInput>
          </div>

          <IonLabel className="mono-font">Due Date</IonLabel>
          <div className="calendar-container">
            <IonDatetime
              presentation="date"
              size="cover"
              className="mono-font"
              value={selectedDate}
              onIonChange={(e) =>
                setSelectedDate(
                  Array.isArray(e.detail.value)
                    ? e.detail.value[0]
                    : e.detail.value!,
                )
              }
            ></IonDatetime>
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

          <h3 className="mono-font section-title" style={{ marginTop: "20px" }}>
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
                  onIonChange={() => toggleComplete(task.id)}
                />
                <div className="task-content mono-font">
                  <div className="task-text">{task.text}</div>
                  <div className="task-due">Due: {task.due}</div>
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
                  onClick={() => toggleComplete(task.id)}
                >
                  <IonIcon
                    icon={checkmarkCircle}
                    color="primary"
                    className="check-icon"
                  />
                  <div className="mono-font">
                    <div className="task-text">{task.text}</div>
                    <div className="task-subtext">Done on {task.due}</div>
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
              <IonCol size="6" style={{ paddingRight: "8px" }}>
                <div className="inspiration-card mono-font">
                  <span className="badge">Quote</span>
                  <p className="insp-quote">
                    "Doubt kills more dreams than failure ever will."
                  </p>
                  <div className="insp-footer">Keep going!</div>
                </div>
              </IonCol>
              <IonCol size="6" style={{ paddingLeft: "8px" }}>
                <div className="inspiration-card mono-font">
                  <span className="badge">Quote</span>
                  <p className="insp-quote">
                    "The best view comes after the hardest climb."
                  </p>
                  <div className="insp-footer">You got this!</div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>

          <div style={{ height: "80px" }}></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
