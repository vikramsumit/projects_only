import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Made with ❤️ using <span className="text-indigo-600 dark:text-indigo-400 font-medium">React & Tailwind</span>
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} FocusFlow — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
