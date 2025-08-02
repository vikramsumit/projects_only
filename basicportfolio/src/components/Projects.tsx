import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Eye, Code, Brain, Globe, Smartphone } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
}

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile' },
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: "AI-Powered E-commerce Platform",
      description: "A comprehensive e-commerce solution with AI-driven product recommendations, intelligent search, and personalized user experiences.",
      image: "/api/placeholder/600/400",
      technologies: ["React", "Node.js", "Python", "TensorFlow", "MongoDB", "AWS"],
      category: "ai",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      features: [
        "Real-time product recommendations",
        "Intelligent search with NLP",
        "Personalized user dashboards",
        "AI-powered inventory management"
      ]
    },
    {
      id: 2,
      title: "Smart Task Management System",
      description: "An intelligent task management application that uses AI to prioritize tasks, predict deadlines, and optimize productivity.",
      image: "/api/placeholder/600/400",
      technologies: ["Vue.js", "Express.js", "PostgreSQL", "OpenAI API", "Docker"],
      category: "ai",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      features: [
        "AI-powered task prioritization",
        "Smart deadline predictions",
        "Natural language task input",
        "Productivity analytics"
      ]
    },
    {
      id: 3,
      title: "Real-time Chat Application",
      description: "A modern chat application with real-time messaging, file sharing, and AI-powered message translation.",
      image: "/api/placeholder/600/400",
      technologies: ["React", "Socket.io", "Node.js", "Redis", "Google Translate API"],
      category: "web",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      features: [
        "Real-time messaging",
        "File sharing and media support",
        "AI-powered translation",
        "End-to-end encryption"
      ]
    },
    {
      id: 4,
      title: "Fitness Tracking Mobile App",
      description: "A mobile fitness application with AI-powered workout recommendations and progress tracking.",
      image: "/api/placeholder/600/400",
      technologies: ["React Native", "Python", "TensorFlow", "Firebase", "HealthKit"],
      category: "mobile",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      features: [
        "AI workout recommendations",
        "Progress tracking and analytics",
        "Social features and challenges",
        "Integration with health devices"
      ]
    },
    {
      id: 5,
      title: "Data Visualization Dashboard",
      description: "An interactive dashboard for visualizing complex data sets with AI-powered insights and predictions.",
      image: "/api/placeholder/600/400",
      technologies: ["React", "D3.js", "Python", "scikit-learn", "PostgreSQL"],
      category: "ai",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      features: [
        "Interactive data visualizations",
        "AI-powered trend analysis",
        "Real-time data updates",
        "Customizable dashboards"
      ]
    },
    {
      id: 6,
      title: "Portfolio Website",
      description: "A modern portfolio website with AI content generation and interactive elements.",
      image: "/api/placeholder/600/400",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "OpenAI API"],
      category: "web",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      features: [
        "AI content generation",
        "Interactive animations",
        "Responsive design",
        "Modern UI/UX"
      ]
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return Brain;
      case 'web': return Globe;
      case 'mobile': return Smartphone;
      default: return Code;
    }
  };

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore my latest work showcasing AI integration and modern web development
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="glass-effect rounded-xl overflow-hidden card-hover cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  {React.createElement(getCategoryIcon(project.category), {
                    className: "w-16 h-16 text-primary-400"
                  })}
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.category === 'ai' ? 'bg-primary-500/20 text-primary-400' :
                    project.category === 'web' ? 'bg-secondary-500/20 text-secondary-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {project.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {project.liveUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Live</span>
                    </motion.a>
                  )}
                  {project.githubUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">Code</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Project Modal */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </motion.button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="h-64 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg mb-6 flex items-center justify-center">
                    {React.createElement(getCategoryIcon(selectedProject.category), {
                      className: "w-24 h-24 text-primary-400"
                    })}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                  <p className="text-gray-300 mb-6 leading-relaxed">{selectedProject.description}</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                  <ul className="space-y-2 mb-6">
                    {selectedProject.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex space-x-4">
                    {selectedProject.liveUrl && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-primary flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Live</span>
                      </motion.a>
                    )}
                    {selectedProject.githubUrl && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-secondary flex items-center space-x-2"
                      >
                        <Github className="w-4 h-4" />
                        <span>View Code</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects; 