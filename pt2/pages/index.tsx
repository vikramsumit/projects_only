import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <>
      <Head>
        <title>Raju Raj - Data Scientist Portfolio</title>
        <meta name="description" content="Portfolio of Raju Raj, Data Scientist." />
      </Head>
      <section className="flex flex-col items-center justify-center text-center h-screen bg-white dark:bg-gray-800">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold">Raju Raj</h1>
          <p className="mt-4 text-2xl">Data Scientist</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            href="/contact"
            className="mt-8 inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
            
              Contact Me
            
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
