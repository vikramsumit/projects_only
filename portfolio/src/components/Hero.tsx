// Home page hero section.
import React from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

const Hero: React.FC = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark opacity-70 z-0"></div>
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-lg"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {"Hi, I'm Your Name".split('').map((char, i) => (
            <motion.span key={i} variants={letterVariants}>
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className="text-2xl sm:text-3xl text-white mb-8 drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          A Passionate Full-Stack Developer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <ScrollLink
            to="projects"
            smooth={true}
            duration={500}
            offset={-70}
            className="inline-flex items-center px-8 py-4 bg-white text-primary-light dark:text-primary-dark text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            View My Work <ArrowDownIcon className="ml-3 h-5 w-5" />
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;