import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted, show correct theme icon
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          Raju Raj
        </Link>
        <ul className="flex space-x-6 items-center">
          <li><Link href="/" className="hover:text-blue-500">Home</Link></li>
          <li><Link href="/about" className="hover:text-blue-500">About</Link></li>
          <li><Link href="/projects" className="hover:text-blue-500">Projects</Link></li>
          <li><Link href="/certificates" className="hover:text-blue-500">Certificates</Link></li>
          <li><Link href="/blog" className="hover:text-blue-500">Blog</Link></li>
          <li><Link href="/contact" className="hover:text-blue-500">Contact</Link></li>
          <li>
            {mounted && (
              <button
                aria-label="Toggle Dark Mode"
                className="p-2 rounded bg-gray-200 dark:bg-gray-600"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? (
                  <FaMoon className="text-xl text-gray-800" />
                ) : (
                  <FaSun className="text-xl text-yellow-300" />
                )}
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
