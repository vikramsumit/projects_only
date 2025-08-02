// Individual certificate card component.
import React from 'react';
import Image from 'next/image';
import { Certificate } from '../types';
import { motion } from 'framer-motion';

interface CertificateCardProps {
  certificate: Certificate;
  onClick: (certificate: Certificate) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onClick }) => {
  return (
    <motion.div
      className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer flex flex-col h-full"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(certificate)}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={certificate.image}
          alt={certificate.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/800x600/EC4899/FFFFFF?text=Certificate';
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-secondary-light dark:text-secondary-dark mb-2">
          {certificate.title}
        </h3>
        <p className="text-text-light dark:text-gray-300 text-sm mb-1">{certificate.issuer}</p>
        <p className="text-gray-600 dark:text-gray-400 text-xs">{certificate.date}</p>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
