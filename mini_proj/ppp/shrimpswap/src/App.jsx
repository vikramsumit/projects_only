import React from "react";
import { motion } from "framer-motion";

function App() {
  const handleStartClick = () => {
    alert("ShrimpSwap coming soon! 🦐✨");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 text-white">
      <motion.h1
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🦐 ShrimpSwap
      </motion.h1>
      <motion.p
        className="text-lg max-w-md text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        The most hilarious, intent-centric DEX frontend built for Anoma. Swap like
        a shrimp, dream like a mage.
      </motion.p>
      <motion.button
        type="button"
        className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-lg hover:bg-yellow-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleStartClick}
      >
        Start Swapping 🦐
      </motion.button>
    </div>
  );
}

export default App;
