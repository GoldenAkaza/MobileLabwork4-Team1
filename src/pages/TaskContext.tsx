// TaskContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the Task type to ensure consistency across the application
export type Task = {
    id: string; 
    title: string;
    notes?: string;
    dueDate?: string; 
    completed: boolean;
    userId: string;
    createdAt: number; 
};

// Define the Context Interface
interface TaskContextType {
    tasks: Task[];
    tasksDone: number;
    addTask: (task: Task) => void;
    toggleTaskCompletion: (task: Task, isCompleted: boolean) => void;
    deleteTask: (task: Task) => void;
    onEdit: (task: Task) => void; 
}

// Initial Tasks (Using the global structure)
const initialTasks: Task[] = [
    { id: '1', title: 'Finish assignment', userId: 'u1', createdAt: Date.now(), completed: false, dueDate: '2023-10-25' },
    { id: '2', title: 'Read chapter 5', userId: 'u1', createdAt: Date.now(), completed: true, dueDate: '2023-10-26' },
    { id: '3', title: 'Prepare for exam', userId: 'u1', createdAt: Date.now(), completed: false, dueDate: '2023-10-27' },
];

export const TaskContext = createContext<TaskContextType>({
    tasks: initialTasks,
    tasksDone: 0,
    addTask: () => {},
    toggleTaskCompletion: () => {},
    deleteTask: () => {},
    onEdit: () => {},
});

// 1. The Provider component manages the state and logic
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const addTask = (newTask: Task) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const toggleTaskCompletion = (taskToToggle: Task, isCompleted: boolean) => {
        setTasks(prevTasks =>
            prevTasks.map(t =>
                t.id === taskToToggle.id ? { ...t, completed: isCompleted } : t
            )
        );
    };

    const deleteTask = (taskToDelete: Task) => {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskToDelete.id));
    };

    const onEdit = (task: Task) => {
        console.log(`Placeholder: Editing task ID: ${task.id}`);
        alert(`Editing task: ${task.title}`);
    };

    // 2. CRITICAL: CALCULATES THE COUNT FOR PROFILE.TSX
    const tasksDone = tasks.filter(task => task.completed).length;

    const contextValue: TaskContextType = {
        tasks,
        tasksDone,
        addTask,
        toggleTaskCompletion,
        deleteTask,
        onEdit, 
    };

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
};

// 3. Custom hook for easy consumption by components
export const useTasks = () => useContext(TaskContext);