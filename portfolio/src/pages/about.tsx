// About page (can be standalone or linked from home sections).
// For a standalone page, you might fetch data here using getStaticProps.
import React from 'react';
import AboutComponent from '@/components/About';
import SEO from '@/components/SEO';

const AboutPage: React.FC = () => {
  return (
    <>
      <SEO title="About Me - Your Name" description="Learn more about Your Name, a full-stack developer, including skills, experience, and education." />
      <div className="pt-20 pb-16 bg-background-light dark:bg-background-dark"> {/* Added padding to account for fixed navbar */}
        <AboutComponent />
      </div>
    </>
  );
};

export default AboutPage;