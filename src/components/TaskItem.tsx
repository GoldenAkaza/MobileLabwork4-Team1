import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonNote,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { pencil, trash } from "ionicons/icons";
import dayjs from "dayjs";
import React from "react";

export type Task = {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string; // ISO
  completed: boolean;
  userId: string;
  createdAt: number; // ms epoch
};


type Props = {
  task: Task;
  onToggle: (t: Task, next: boolean) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
};

const TaskItem: React.FC<Props> = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <IonItem lines="full">
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={(e) => onToggle(task, !!e.detail.checked)}
      />
      <IonLabel className={task.completed ? "line-through opacity-70" : ""}>
        <h2>{task.title}</h2>
        {task.notes && <p>{task.notes}</p>}
        {task.dueDate && (
          <IonNote>
            Due {dayjs(task.dueDate).format("MMM D, YYYY")}
          </IonNote>
        )}
      </IonLabel>
      <IonButton fill="clear" onClick={() => onEdit(task)} aria-label="Edit">
        <IonIcon icon={pencil} />
      </IonButton>
      <IonButton fill="clear" color="danger" onClick={() => onDelete(task)} aria-label="Delete">
        <IonIcon icon={trash} />
      </IonButton>
    </IonItem>
  );
};

export default TaskItem;
