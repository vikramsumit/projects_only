import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [darkMode, setDarkMode] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (storedTasks) setTasks(storedTasks);
    if (storedDarkMode !== null) setDarkMode(storedDarkMode);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply dark mode class to html element for broader coverage
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTask = () => {
    if (input.trim() === '') return;
    const newTask = {
      text: input,
      completed: false,
      due: dueDate || null,
      id: Date.now(),
    };
    setTasks([...tasks, newTask]);
    setInput('');
    setDueDate('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === FILTERS.ALL) return true;
    if (filter === FILTERS.ACTIVE) return !task.completed;
    if (filter === FILTERS.COMPLETED) return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="min-h-screen flex flex-col">
        <Navbar darkMode={darkMode} />
        
        <main className="flex-grow py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="app-card">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold app-heading">📝 To-Do List</h1>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="mode-toggle-btn"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
              </div>

              {/* Stats */}
              <div className="stats-container mb-6">
                <div className="stat-item">
                  <span className="stat-number">{tasks.length}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{activeCount}</span>
                  <span className="stat-label">Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{completedCount}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>

              {/* Input Section */}
              <div className="input-section">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="task-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
                <input
                  type="date"
                  className="date-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <button
                  onClick={addTask}
                  className="add-btn"
                  disabled={input.trim() === ''}
                >
                  Add Task
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="filter-container">
                {Object.values(FILTERS).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`filter-btn ${filter === f ? 'filter-active' : ''}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Task List */}
              <div className="task-list-container">
                {filteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <p className="empty-text">
                      {tasks.length === 0 
                        ? 'No tasks yet. Add your first task above!' 
                        : `No ${filter.toLowerCase()} tasks.`}
                    </p>
                  </div>
                ) : (
                  <ul className="task-list">
                    {filteredTasks.map(task => (
                      <li key={task.id} className="task-item">
                        <div className="task-content">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="task-checkbox"
                          />
                          <div className="task-details">
                            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                              {task.text}
                            </span>
                            {task.due && (
                              <span className="due-date">
                                Due: {new Date(task.due).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="delete-btn"
                          aria-label="Delete task"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;