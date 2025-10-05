import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-700 dark:text-gray-300">
        <p>
          Made with ❤️ using <span className="text-blue-600 dark:text-blue-400 font-medium">React & Tailwind</span>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} My Tasks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
