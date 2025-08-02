// // Contact form component.
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// const ContactForm: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });
//   const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus('submitting');
//     setErrorMessage(null);

//     try {
//       const response = await fetch('/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//           'form-name': 'contact', // This must match the 'name' attribute of your form in public/index.html or a hidden input
//           ...formData,
//         }).toString(),
//       });

//       if (response.ok) {
//         setStatus('success');
//         setFormData({ name: '', email: '', message: '' });
//       } else {
//         setStatus('error');
//         setErrorMessage('Failed to send message. Please try again later.');
//       }
//     } catch (error) {
//       console.error('Contact form submission error:', error);
//       setStatus('error');
//       setErrorMessage('An unexpected error occurred. Please try again.');
//     }

//   };

//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       className="max-w-xl mx-auto bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, delay: 0.2 }}
//     >
//       <div className="mb-6">
//         <label htmlFor="name" className="block text-text-light dark:text-text-dark text-sm font-bold mb-2">
//           Name
//         </label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-primary-light dark:focus:border-primary-dark"
//         />
//       </div>
//       <div className="mb-6">
//         <label htmlFor="email" className="block text-text-light dark:text-text-dark text-sm font-bold mb-2">
//           Email
//         </label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-primary-light dark:focus:border-primary-dark"
//         />
//       </div>
//       <div className="mb-6">
//         <label htmlFor="message" className="block text-text-light dark:text-text-dark text-sm font-bold mb-2">
//           Message
//         </label>
//         <textarea
//           id="message"
//           name="message"
//           rows={5}
//           value={formData.message}
//           onChange={handleChange}
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-primary-light dark:focus:border-primary-dark resize-y"
//         ></textarea>
//       </div>
//       <div className="flex items-center justify-between">
//         <button
//           type="submit"
//           className="bg-primary-light hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={status === 'submitting'}
//         >
//           {status === 'submitting' ? 'Sending...' : 'Send Message'}
//         </button>
//         {status === 'success' && (
//           <p className="text-green-600 dark:text-green-400 text-sm">Message sent successfully!</p>
//         )}
//         {status === 'error' && (
//           <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
//         )}
//       </div>
//     </motion.form>
//   );
// };

// export default ContactForm;

// Home page.
import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Certificates from '../components/Certificates';
import ContactForm from '../components/ContactForm'; // ✅ use this instead

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Certificates />
      <ContactForm /> {/* ✅ Embed the new component safely */}
    </>
  );
};

export default HomePage;
