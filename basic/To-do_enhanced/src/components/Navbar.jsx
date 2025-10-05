import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 dark:bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center hover:scale-105 transform transition-transform duration-200 cursor-pointer">
            <span className="text-xl font-bold tracking-wide">📝 My Tasks</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-indigo-200 transition-colors duration-200">Home</a>
            <a href="#" className="hover:text-indigo-200 transition-colors duration-200">Your Tasks</a>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - visible on small screens */}
      <div className="md:hidden px-4 pb-3">
        <a href="#" className="block py-2 hover:text-indigo-200">Home</a>
        <a href="#" className="block py-2 hover:text-indigo-200">Your Tasks</a>
      </div>
    </nav>
  )
}

export default Navbar
