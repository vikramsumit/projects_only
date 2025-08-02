// Certificates page (can be standalone or linked from home sections).
import React from 'react';
import CertificatesComponent from '@/components/Certificates';
import SEO from '@/components/SEO';

const CertificatesPage: React.FC = () => {
  return (
    <>
      <SEO title="My Certificates - Your Name" description="View professional certifications and achievements of Your Name in web development and related fields." />
      <div className="pt-20 pb-16 bg-background-light dark:bg-background-dark"> {/* Added padding to account for fixed navbar */}
        <CertificatesComponent />
      </div>
    </>
  );
};

export default CertificatesPage;