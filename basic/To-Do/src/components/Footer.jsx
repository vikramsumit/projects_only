import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Made with ❤️ using <span className="text-indigo-600 dark:text-indigo-400 font-medium">React & Tailwind</span>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} My Tasks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
