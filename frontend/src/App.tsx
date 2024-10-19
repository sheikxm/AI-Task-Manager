import React from 'react';
import TodoList from './components/TodoList';
import Heading from './components/Heading';
import TaskList from './components/TaskList';

const App: React.FC = () => {
    return (
        <div className="h-100 bg-blue-900 flex items-center justify-center bg-teal-lightest font-sans">
            <div className="rounded shadow p-6 m-4 w-full ">
                <Heading/>
                <TodoList />
                <TaskList/>
            </div>
        </div>
    );
};

export default App;
