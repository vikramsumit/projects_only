import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Project One',
    tech: ['React', 'Node.js', 'Tailwind'],
    description: 'A web app to do something awesome.',
    image: '/project1.png',
    github: 'https://github.com/raju-raj/project-one',
    demo: 'https://project-one-demo.com',
  },
  {
    title: 'Project Two',
    tech: ['Python', 'TensorFlow'],
    description: 'A machine learning project.',
    image: '/project2.png',
    github: 'https://github.com/raju-raj/project-two',
    demo: 'https://project-two-demo.com',
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <>
      <Head>
        <title>Projects - Raju Raj</title>
        <meta name="description" content="Projects and demos by Raju Raj." />
      </Head>
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                className="border rounded overflow-hidden shadow-lg cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedProject(project)}
              >
                <Image src={project.image} alt={project.title} width={600} height={400} />
                <div className="p-4">
                  <h3 className="text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded mr-2">
                        {tech}
                      </span>
                    ))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {selectedProject && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded max-w-md mx-auto"
            >
              <h3 className="text-3xl font-bold mb-4">{selectedProject.title}</h3>
              <p className="mb-4">{selectedProject.description}</p>
              <p className="mb-2">Technologies: {selectedProject.tech.join(', ')}</p>
              <div className="flex space-x-4">
                <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer" className="text-blue-500">Live Demo</a>
                <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="text-blue-500">GitHub</a>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
};

export default Projects;
