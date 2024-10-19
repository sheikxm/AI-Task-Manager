import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

interface Task {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>('');
    const [editedDescription, setEditedDescription] = useState<string>('');
    const [aiResponse, setAiResponse] = useState<string>('');
    const [, setSelectedTaskId] = useState<string | null>(null);

    // Fetch tasks from the FastAPI backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);
    const completeWithAi = async (taskId: string) => {
        const task = tasks.find((t) => t._id === taskId);
        if (task) {
            try {
                const response = await axios.post('http://localhost:8000/tasks/completewithai/', {
                    title: task.title,
                    description: task.description,
                });
                setAiResponse(response.data.response);  // Set the AI response
                setSelectedTaskId(taskId);  // Set the selected task to show the response
            } catch (error) {
                console.error('Error completing task with AI:', error);
            }
        }
    };
    const downloadPdf = () => {
        if (!aiResponse) {
            return;
        }

        const doc = new jsPDF();
        doc.text("AI Response:", 10, 10);
        doc.text(aiResponse, 10, 20);
        doc.save('ai_response.pdf');
    };
    


    // Toggle task completion
    const markTaskAsDone = async (taskId: string) => {
        const task = tasks.find((t) => t._id === taskId);
        if (task) {
            try {
                const response = await axios.put(`http://localhost:8000/tasks/${taskId}`, {
                    ...task,
                    completed: !task.completed,
                });
                setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    };
    

    // Remove task
    const removeTask = async (taskId: string) => {
        try {
            await axios.delete(`http://localhost:8000/tasks/${taskId}`);
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Error removing task:', error);
        }
    };

    // Edit task
    const editTask = (taskId: string, title: string, description: string) => {
        setEditTaskId(taskId);
        setEditedTitle(title);
        setEditedDescription(description);
    };

    // Update task after editing
    const updateTask = async (taskId: string) => {
        try {
            const response = await axios.put(`http://localhost:8000/tasks/${taskId}`, {
                title: editedTitle,
                description: editedDescription,
                completed: tasks.find((t) => t._id === taskId)?.completed,
            });
            setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
            setEditTaskId(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    
    return (
        <div className="flex">
            {/* Left side with task list */}
            <div className="w-1/2">
                {tasks.map((task) => (
                    <div key={task._id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
                        {editTaskId === task._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="mb-2 text-gray-900 dark:text-white block w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                                />
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="mb-2 text-gray-900 dark:text-white block w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                                />
                                <button
                                    onClick={() => updateTask(task._id)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Update
                                </button>
                            </div>
                        ) : (
                            <>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {task.title}
                                </h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    {task.description}
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800"
                                        onClick={() => markTaskAsDone(task._id)}
                                    >
                                        {task.completed ? 'Not Done' : 'Done'}
                                    </button>
                                    <button
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                                        onClick={() => editTask(task._id, task.title, task.description)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800"
                                        onClick={() => removeTask(task._id)}
                                    >
                                        Remove
                                    </button>
                                    {/* Complete with AI button */}
                                    <button
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                                        onClick={() => completeWithAi(task._id)}
                                    >
                                        Complete with AI
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Right side with AI response */}
            <div className="w-1/2 ml-4">
                <div className="mb-6">
                    <textarea
                        className="w-full rounded-2xl placeholder:text-xs px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="AI Response will appear here..."
                        value={aiResponse || ''}
                        rows={8}
                        readOnly
                    />
                </div>
                {/* Download PDF Button */}
                <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700"
                    onClick={downloadPdf}
                >
                    Download as PDF
                </button>
            </div>
        </div>
    );    };

export default TodoList;
