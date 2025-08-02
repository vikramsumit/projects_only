// Custom 404 page.
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Custom404: React.FC = () => {
  return (
    <>
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center bg-background-light dark:bg-background-dark px-4 py-16">
        <motion.h1
          className="text-9xl font-extrabold text-primary-light dark:text-primary-dark mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-3xl font-semibold text-text-light dark:text-text-dark mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page Not Found
        </motion.p>
        <motion.p
          className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-light hover:bg-primary-dark text-white font-semibold rounded-full shadow-lg transition-colors duration-300"
          >
            Go Back Home
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default Custom404;