// Projects page (can be standalone or linked from home sections).
import React from 'react';
import ProjectsComponent from '@/components/Projects';
import SEO from '@/components/SEO';

const ProjectsPage: React.FC = () => {
  return (
    <>
      <SEO title="My Projects - Your Name" description="Explore a collection of web development projects by Your Name, showcasing expertise in various technologies." />
      <div className="pt-20 pb-16 bg-background-light dark:bg-background-dark"> {/* Added padding to account for fixed navbar */}
        <ProjectsComponent />
      </div>
    </>
  );
};

export default ProjectsPage;