// Certificates gallery component.
import React, { useState } from 'react';
import { Certificate } from '../types';
import CertificateCard from './CertificateCard';
import CertificateLightbox from './CertificateLightbox';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';

// Dummy Data for Certificates
const certificates: Certificate[] = [
  {
    id: 'cert1',
    title: 'Full-Stack Web Development',
    issuer: 'Udemy',
    date: 'March 2023',
    image: '/certificate-placeholder.jpg',
    description: 'Completed a comprehensive course covering MERN stack development.',
    credentialLink: 'https://udemy.com/certificate/abcdefg',
  },
  {
    id: 'cert2',
    title: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    date: 'January 2023',
    image: '/certificate-placeholder.jpg',
    description: 'Validated expertise in designing distributed systems on AWS.',
    credentialLink: 'https://aws.amazon.com/certification/validate/?id=hijklmno',
  },
  {
    id: 'cert3',
    title: 'React - The Complete Guide',
    issuer: 'Academind',
    date: 'November 2022',
    image: '/certificate-placeholder.jpg',
    description: 'Mastered React concepts including hooks, context API, and routing.',
    credentialLink: 'https://academind.com/certificate/pqrstuv',
  },
  {
    id: 'cert4',
    title: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    date: 'September 2022',
    image: '/certificate-placeholder.jpg',
    description: 'Developed strong problem-solving skills with JavaScript.',
    credentialLink: 'https://freecodecamp.org/certification/wxyzab',
  },
  {
    id: 'cert5',
    title: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI (Coursera)',
    date: 'June 2022',
    image: '/certificate-placeholder.jpg',
    description: 'Gained foundational knowledge in machine learning algorithms.',
    credentialLink: 'https://coursera.org/verify/cdefgh',
  },
];

const Certificates: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const openLightbox = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedCertificate(null);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatedSection id="certificates" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-secondary-light dark:text-secondary-dark">
        My Certificates
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {certificates.map((certificate) => (
          <motion.div key={certificate.id} variants={itemVariants}>
            <CertificateCard certificate={certificate} onClick={openLightbox} />
          </motion.div>
        ))}
      </motion.div>

      <CertificateLightbox isOpen={isLightboxOpen} onClose={closeLightbox} certificate={selectedCertificate} />
    </AnimatedSection>
  );
};

export default Certificates;