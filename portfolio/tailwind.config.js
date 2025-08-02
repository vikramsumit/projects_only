// Tailwind CSS configuration file.
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class", // Enable dark mode based on 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          light: '#6366F1', // Indigo 500
          dark: '#818CF8',  // Indigo 400
        },
        secondary: {
          light: '#EC4899', // Pink 500
          dark: '#F472B6',  // Pink 400
        },
        background: {
          light: '#F8FAFC', // Slate 50
          dark: '#0F172A',  // Slate 900
        },
        text: {
          light: '#1E293B', // Slate 800
          dark: '#F1F5F9',  // Slate 100
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For styling markdown content
  ],
};