import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

const certificates = [
  { title: 'Certificate in Data Science', image: '/29.jpg', date: 'Jan 2021' },
  { title: 'Certificate in AI', image: '/29.jpg', date: 'Jun 2022' },
];

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState<any>(null);

  return (
    <>
      <Head>
        <title>Certificates - Raju Raj</title>
        <meta name="description" content="Certificates earned by Raju Raj." />
      </Head>
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {certificates.map((cert, idx) => (
              <motion.div
                key={idx}
                className="cursor-pointer border rounded overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCert(cert)}
              >
                <Image src={cert.image} alt={cert.title} width={400} height={300} />
                <div className="p-4">
                  <h3 className="font-semibold">{cert.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cert.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {selectedCert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg mx-auto"
            >
              <h3 className="text-2xl font-bold mb-4">{selectedCert.title}</h3>
              <Image src={selectedCert.image} alt={selectedCert.title} width={600} height={400} />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{selectedCert.date}</p>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setSelectedCert(null)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
};

export default Certificates;
