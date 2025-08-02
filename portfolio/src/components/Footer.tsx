// Footer component with social links.
import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-16 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="https://github.com/yourusername" // Replace with your GitHub
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
          >
            <FaGithub className="h-7 w-7" />
          </a>
          <a
            href="https://linkedin.com/in/yourusername" // Replace with your LinkedIn
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
          >
            <FaLinkedin className="h-7 w-7" />
          </a>
          <a
            href="https://twitter.com/yourusername" // Replace with your Twitter
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
          >
            <FaTwitter className="h-7 w-7" />
          </a>
          <a
            href="mailto:your.email@example.com" // Replace with your email
            aria-label="Email Me"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
          >
            <FaEnvelope className="h-7 w-7" />
          </a>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Your Name. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;