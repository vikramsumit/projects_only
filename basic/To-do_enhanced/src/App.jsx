import React, { useEffect, useState } from 'react';
import './index.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

const SunIcon = () => (
  <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 19v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.22 4.22l1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.36 18.36l1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.22 19.78l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
      setTasks(Array.isArray(storedTasks) ? storedTasks : []);
      if (storedDarkMode !== null) setDarkMode(storedDarkMode);
    } catch (e) {
      console.warn('Failed to load localStorage', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const addTask = () => {
    if (input.trim() === '') return;
    const newTask = {
      text: input.trim(),
      completed: false,
      due: dueDate || null,
      id: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
    setInput('');
    setDueDate('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
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
    <div className={`min-h-screen w-full transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-indigo-50 via-white to-rose-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Navbar darkMode={darkMode} onToggle={() => setDarkMode(d => !d)} />

        <main className="mt-6">
          <div className="relative p-1 rounded-3xl overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 opacity-30 blur-3xl transform scale-105" aria-hidden />

            <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 ring-1 ring-white/40 dark:ring-black/20 transition-transform transform hover:-translate-y-1">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">📝 To‑Do</h1>
                  <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">A beautiful, focused place to get things done — glassy UI, subtle motion.</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4 bg-white/20 dark:bg-black/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-semibold text-lg">{tasks.length}</div>
                      <div className="text-xs">Total</div>
                    </div>
                    <div className="w-px h-8 bg-white/25" />
                    <div className="text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-semibold text-lg">{activeCount}</div>
                      <div className="text-xs">Active</div>
                    </div>
                    <div className="w-px h-8 bg-white/25" />
                    <div className="text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-semibold text-lg">{completedCount}</div>
                      <div className="text-xs">Done</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="md:col-span-2 w-full rounded-lg px-4 py-3 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 bg-white/70 dark:bg-gray-900/50"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                />

                <div className="flex gap-2">
                  <input
                    type="date"
                    className="rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/70 dark:bg-gray-900/50"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                  <button
                    onClick={addTask}
                    disabled={input.trim() === ''}
                    className="px-4 py-2 rounded-lg font-medium shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 bg-gradient-to-r from-indigo-500 to-rose-500 text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {Object.values(FILTERS).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-transform transform ${filter === f ? 'scale-105 bg-indigo-600 text-white' : 'bg-white/40 dark:bg-black/30 text-gray-700 dark:text-gray-200 hover:scale-105'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {filteredTasks.length === 0 ? (
                  <div className="py-12 text-center text-gray-600 dark:text-gray-300">
                    {tasks.length === 0 ? (
                      <>
                        <div className="text-xl font-medium">No tasks yet</div>
                        <div className="mt-2 text-sm">Add your first task above to get started ✨</div>
                      </>
                    ) : (
                      <div className="text-sm">No {filter.toLowerCase()} tasks.</div>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {filteredTasks.map(task => (
                      <li key={task.id} className="group flex items-center justify-between bg-white/60 dark:bg-gray-900/50 rounded-xl p-3 shadow-sm ring-1 ring-white/30 hover:shadow-lg transition shadow-slate-900/5 hover:scale-[1.01]">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="w-5 h-5 rounded-md accent-indigo-500" />
                            <div className="flex flex-col">
                              <span className={`text-sm md:text-base font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>{task.text}</span>
                              {task.due && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">Due {new Date(task.due).toLocaleDateString()}</span>
                              )}
                            </div>
                          </label>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={() => deleteTask(task.id)} className="px-2 py-1 rounded-md text-sm bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">✕</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
