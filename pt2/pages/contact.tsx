import { useState } from 'react';
import Head from 'next/head';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For Netlify Forms, no handling needed here if data-netlify="true".
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Contact - Raju Raj</title>
        <meta name="description" content="Contact Raju Raj." />
      </Head>
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>
          {submitted ? (
            <p className="text-center text-green-600">Thank you for your message!</p>
          ) : (
            <form onSubmit={handleSubmit} data-netlify="true">
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input type="text" name="name" required className="w-full border p-2 rounded"/>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input type="email" name="email" required className="w-full border p-2 rounded"/>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Message</label>
                <textarea name="message" rows={4} required className="w-full border p-2 rounded"></textarea>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded">
                Send
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default Contact;
