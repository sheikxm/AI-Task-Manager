import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the Task type based on your backend model
interface Task {
  id: number;
  title: string;
  description: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>("/tasks");  // Adjust the API URL if necessary
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {task.title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {task.description}
          </p>
          
          {/* Buttons for Edit and Remove */}
          <div className="flex space-x-4">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800">
              Edit
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default TaskList;
