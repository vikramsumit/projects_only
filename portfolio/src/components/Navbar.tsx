import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: 'home' },
    { name: 'About', href: 'about' },
    { name: 'Projects', href: 'projects' },
    { name: 'Certificates', href: 'certificates' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: 'contact' },
  ];

  // const scrollItems = navItems.filter(item => item.href !== '/blog');

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ScrollLink
              to="home"
              smooth={true}
              duration={500}
              className="text-2xl font-bold text-primary-light dark:text-primary-dark cursor-pointer"
            >
              Portfolio
            </ScrollLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.href.startsWith('/') ? (
                    <Link
                      href={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <ScrollLink
                      to={item.href}
                      smooth={true}
                      duration={500}
                      offset={-70}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
                    >
                      {item.name}
                    </ScrollLink>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark focus:outline-none focus:text-primary-light dark:focus:text-primary-dark"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.href.startsWith('/') ? (
                <Link
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <ScrollLink
                  to={item.href}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </ScrollLink>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
