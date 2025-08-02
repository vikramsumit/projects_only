// Projects grid component.
import React, { useState } from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModel';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';

// Dummy Data for Projects
const projects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment integration.',
    image: '/project-placeholder.jpg',
    technologies: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    liveUrl: 'https://example.com/ecommerce',
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    category: 'web',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A web-based task manager with drag-and-drop functionality, real-time updates, and user collaboration features.',
    image: '/project-placeholder.jpg',
    technologies: ['React', 'TypeScript', 'Firebase', 'Chakra UI'],
    liveUrl: 'https://example.com/task-manager',
    githubUrl: 'https://github.com/yourusername/task-manager-app',
    category: 'web',
  },
  {
    id: '3',
    title: 'Personal Blog',
    description: 'A responsive blog platform built with markdown support, tags, and pagination for easy content management.',
    image: '/project-placeholder.jpg',
    technologies: ['Next.js', 'Markdown', 'Tailwind CSS'],
    liveUrl: 'https://example.com/personal-blog',
    githubUrl: 'https://github.com/yourusername/personal-blog',
    category: 'web',
  },
  {
    id: '4',
    title: 'Weather Dashboard',
    description: 'An interactive weather application displaying current weather conditions and forecasts using a public API.',
    image: '/project-placeholder.jpg',
    technologies: ['Vue.js', 'Axios', 'OpenWeather API', 'CSS'],
    liveUrl: 'https://example.com/weather-dashboard',
    githubUrl: 'https://github.com/yourusername/weather-dashboard',
    category: 'web',
  },
  {
    id: '5',
    title: 'Recipe Finder',
    description: 'Search and discover recipes based on ingredients, dietary preferences, and cuisine types using a recipe API.',
    image: '/project-placeholder.jpg',
    technologies: ['React', 'Redux', 'Sass', 'Edamam API'],
    liveUrl: 'https://example.com/recipe-finder',
    githubUrl: 'https://github.com/yourusername/recipe-finder',
    category: 'web',
  },
  {
    id: '6',
    title: 'Portfolio Website',
    description: 'This very portfolio website, showcasing my skills and projects, built with modern web technologies.',
    image: '/project-placeholder.jpg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://yourdomain.com', // Replace with your domain
    githubUrl: 'https://github.com/yourusername/your-portfolio',
    category: 'web',
  },
];

const Projects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatedSection id="projects" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-primary-light dark:text-primary-dark">
        My Projects
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
        {projects.map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <ProjectCard project={project} onClick={openModal} />
          </motion.div>
        ))}
      </motion.div>

      <ProjectModal isOpen={isModalOpen} onClose={closeModal} project={selectedProject} />
    </AnimatedSection>
  );
};

export default Projects;