// Custom hook for active navigation links based on scroll position.
import { useState, useEffect } from 'react';

interface UseScrollSpyProps {
  sectionRefs: { id: string; ref: React.RefObject<HTMLElement> }[];
  offset?: number;
}

export const useScrollSpy = ({ sectionRefs, offset = 100 }: UseScrollSpyProps) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      let currentSection = '';
      
      for (const { id, ref } of sectionRefs) {
        if (ref.current) {
          const elementTop = ref.current.offsetTop;
          const elementHeight = ref.current.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
            currentSection = id;
            break;
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs, offset, activeSection]);

  return activeSection;
};