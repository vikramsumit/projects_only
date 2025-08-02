const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Raju Raj. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="https://github.com/raju-raj" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/raju-raj" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:raju@example.com">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
