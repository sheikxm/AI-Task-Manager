import React from 'react';
import TodoList from './components/TodoList';
import Heading from './components/Heading';

const App: React.FC = () => {
    return (
        <div className="h-100  flex items-center justify-center bg-teal-lightest font-sans">
            <div className="bg-white rounded shadow p-6 m-4 w-full ">
                <Heading/>
                <TodoList />
            </div>
        </div>
    );
};

export default App;
