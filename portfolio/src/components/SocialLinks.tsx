// Social media links component.
import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SocialLinks: React.FC = () => {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="flex justify-center space-x-6 mt-8"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
    >
      <motion.a
        href="https://github.com/yourusername" // Replace with your GitHub
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Profile"
        className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
        variants={iconVariants}
      >
        <FaGithub className="h-8 w-8" />
      </motion.a>
      <motion.a
        href="https://linkedin.com/in/yourusername" // Replace with your LinkedIn
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn Profile"
        className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
        variants={iconVariants}
      >
        <FaLinkedin className="h-8 w-8" />
      </motion.a>
      <motion.a
        href="https://twitter.com/yourusername" // Replace with your Twitter
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter Profile"
        className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
        variants={iconVariants}
      >
        <FaTwitter className="h-8 w-8" />
      </motion.a>
      <motion.a
        href="mailto:your.email@example.com" // Replace with your email
        aria-label="Email Me"
        className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
        variants={iconVariants}
      >
        <FaEnvelope className="h-8 w-8" />
      </motion.a>
    </motion.div>
  );
};

export default SocialLinks;