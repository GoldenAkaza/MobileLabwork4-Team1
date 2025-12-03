// src/context/TaskContext.tsx - FIXED

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Reusing your Task type definition
export type Task = {
    id: string; 
    title: string;
    notes?: string;
    dueDate?: string; 
    completed: boolean;
    userId: string;
    createdAt: number; 
};

// 💡 FIX 1: Define the shape of the Context, including the required onEdit function
interface TaskContextType {
    tasks: Task[];
    tasksDone: number;
    toggleTaskCompletion: (task: Task, isCompleted: boolean) => void;
    deleteTask: (task: Task) => void;
    onEdit: (task: Task) => void; // <-- ADDED: The function used in Tasks.tsx
}

// Initial Tasks 
const initialTasks: Task[] = [
    { id: '1', title: 'Finish assignment', userId: 'u1', createdAt: Date.now(), completed: false },
    { id: '2', title: 'Read chapter 5', userId: 'u1', createdAt: Date.now(), completed: true },
    { id: '3', title: 'Prepare for exam', userId: 'u1', createdAt: Date.now(), completed: false },
];

// 💡 FIX 2: Create the Context object first (since useTasks relies on it)
export const TaskContext = createContext<TaskContextType>({
    tasks: initialTasks,
    tasksDone: 0,
    toggleTaskCompletion: () => {}, // Default empty functions
    deleteTask: () => {},
    onEdit: () => {}, // <-- ADDED: Default empty function for onEdit
});

// 💡 FIX 3 (Implicit): Corrected the order. Exporting useTasks at the end is standard.
export const useTasks = () => useContext(TaskContext); 


export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    
    // --- Task Manipulation Functions ---
    
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

    // 💡 ADDITION: Placeholder for the actual onEdit function (to satisfy the interface)
    const onEdit = (task: Task) => {
        console.log(`Placeholder: Navigate to edit screen for task ID: ${task.id}`);
        alert(`Editing task: ${task.title}`); 
    };

    // Calculate tasksDone based on current state
    const tasksDone = tasks.filter(task => task.completed).length;

    const contextValue: TaskContextType = {
        tasks,
        tasksDone,
        toggleTaskCompletion,
        deleteTask,
        onEdit, // <-- ADDED: Include the onEdit function in the context value
    };

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
};