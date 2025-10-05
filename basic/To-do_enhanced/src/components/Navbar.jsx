import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // install if needed: npm install @heroicons/react

function Navbar({ darkMode, onToggle }) {
  return (
    <nav className="bg-indigo-600 dark:bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-3 transform transition-transform duration-200 hover:scale-105 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-400 shadow-md flex items-center justify-center text-white text-sm font-bold -rotate-12">
              ✓
            </div>
            <span className="text-xl font-bold tracking-wide hidden sm:inline">FocusFlow</span>
          </div>

          {/* Navigation Links (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-indigo-200 transition">Home</a>
            <a href="#" className="hover:text-indigo-200 transition">Your Tasks</a>

            {/* Theme toggle button */}
            <button
              onClick={onToggle}
              aria-label="Toggle theme"
              className="ml-4 flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-white" />
              ) : (
                <MoonIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-4 pb-4 space-y-2">
        <a href="#" className="block py-1 hover:text-indigo-200">Home</a>
        <a href="#" className="block py-1 hover:text-indigo-200">Your Tasks</a>

        {/* Mobile Theme Toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle theme"
          className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5 text-white" />
          ) : (
            <MoonIcon className="w-5 h-5 text-white" />
          )}
          <span className="text-white text-sm">{darkMode ? 'Light' : 'Dark'} Mode</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
