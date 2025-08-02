    // Wrapper component for Framer Motion animations on scroll.
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedSectionProps {
  children: React.ReactNode;
  variants?: {
    hidden: { opacity: number; y?: number; x?: number; scale?: number };
    visible: { opacity: number; y?: number; x?: number; scale?: number };
  };
  transition?: {
    duration: number;
    ease: string;
    delay?: number;
  };
  className?: string;
  id?: string;
}

const defaultVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const defaultTransition = {
  duration: 0.6,
  ease: 'easeOut',
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  variants = defaultVariants,
  transition = defaultTransition,
  className,
  id,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only animate once when it comes into view
    threshold: 0.1,    // Percentage of the element visible to trigger
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;