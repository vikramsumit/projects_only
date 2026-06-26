import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const addTask = () => {
    if (input.trim() === '') return;
    setTasks([...tasks, { text: input, completed: false }]);
    setInput('');
    saveTasksToLocalStorage([...tasks, { text: input, completed: false }]);
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const editTask = (index) => {
    const newText = prompt('Edit your task:', tasks[index].text);
    if (newText !== null && newText.trim() !== '') {
      const updatedTasks = [...tasks];
      updatedTasks[index].text = newText;
      setTasks(updatedTasks);
    }
    saveTasksToLocalStorage(tasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[79vh] bg-slate-100 flex  justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-900-800 mb-6 text-center tracking-tight ">
            📝 Manage Your Tasks
          </h2>

          {/* Input Area */}
          <div className="flex items-center gap-4 mb-8">
            <input
              type="text"
              placeholder="What do you need to do?"
              className="flex-grow px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 transition-all duration-200"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 text-white px-5 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-center text-slate-500 italic">
                Your task list is empty. Start by adding one!
              </p>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-4 py-3 shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(index)}
                      className="w-5 h-5 text-indigo-600 accent-indigo-600 transition"
                    />
                    <span
                      className={`text-slate-800 ${task.completed ? 'line-through opacity-50' : ''
                        } transition-all`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2"> 
                    <button
                      onClick={() => editTask(index)}
                      className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-4"
                      title="Edit task"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteTask(index)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Delete task"
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
