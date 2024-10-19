import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');

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

    // Create a new task
    const addTask = async () => {
        try {
            const response = await axios.post('http://localhost:8000/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                completed: false,
            });
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
            setNewTaskDescription('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Mark task as completed
    const markTaskAsDone = async (taskId: string) => {
        const task = tasks.find((t) => t._id === taskId);
        if (task) {
            try {
                const response = await axios.put(`http://localhost:8000/tasks/${taskId}`, {
                    ...task,
                    completed: !task.completed,
                });
                setTasks(
                    tasks.map((t) =>
                        t._id === taskId ? response.data : t
                    )
                );
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

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-grey-darkest">Todo List</h1>
                <div className="flex mt-4">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                        placeholder="Add Todo"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                        placeholder="Description"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                    <button
                        className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal"
                        onClick={addTask}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div>
                {tasks.map((task) => (
                    <div key={task._id} className="flex mb-4 items-center">
                        <p
                            className={`w-full ${
                                task.completed ? 'line-through text-green' : 'text-grey-darkest'
                            }`}
                        >
                            {task.title} - {task.description}
                        </p>
                        <button
                            className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green"
                            onClick={() => markTaskAsDone(task._id)}
                        >
                            {task.completed ? 'Not Done' : 'Done'}
                        </button>
                        <button
                            className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red"
                            onClick={() => removeTask(task._id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
