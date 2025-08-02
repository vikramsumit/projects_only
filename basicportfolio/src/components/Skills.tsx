import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Database, Cloud, Brain, Palette, Settings } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
}

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills: Skill[] = [
    // Frontend
    { name: 'React.js', level: 95, category: 'Frontend', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { name: 'TypeScript', level: 90, category: 'Frontend', icon: Code, color: 'from-blue-600 to-blue-700' },
    { name: 'Vue.js', level: 85, category: 'Frontend', icon: Code, color: 'from-green-500 to-emerald-500' },
    { name: 'Tailwind CSS', level: 92, category: 'Frontend', icon: Palette, color: 'from-cyan-500 to-blue-500' },
    { name: 'Next.js', level: 88, category: 'Frontend', icon: Code, color: 'from-gray-700 to-black' },
    
    // Backend
    { name: 'Node.js', level: 90, category: 'Backend', icon: Settings, color: 'from-green-600 to-green-700' },
    { name: 'Python', level: 85, category: 'Backend', icon: Settings, color: 'from-yellow-500 to-orange-500' },
    { name: 'Express.js', level: 88, category: 'Backend', icon: Settings, color: 'from-gray-600 to-gray-700' },
    { name: 'Django', level: 80, category: 'Backend', icon: Settings, color: 'from-green-700 to-green-800' },
    { name: 'GraphQL', level: 82, category: 'Backend', icon: Settings, color: 'from-pink-500 to-purple-500' },
    
    // Database
    { name: 'MongoDB', level: 85, category: 'Database', icon: Database, color: 'from-green-500 to-green-600' },
    { name: 'PostgreSQL', level: 80, category: 'Database', icon: Database, color: 'from-blue-500 to-blue-600' },
    { name: 'Redis', level: 75, category: 'Database', icon: Database, color: 'from-red-500 to-red-600' },
    { name: 'MySQL', level: 78, category: 'Database', icon: Database, color: 'from-blue-600 to-blue-700' },
    
    // AI/ML
    { name: 'TensorFlow', level: 85, category: 'AI/ML', icon: Brain, color: 'from-orange-500 to-red-500' },
    { name: 'PyTorch', level: 80, category: 'AI/ML', icon: Brain, color: 'from-red-500 to-red-600' },
    { name: 'OpenAI API', level: 90, category: 'AI/ML', icon: Brain, color: 'from-green-500 to-emerald-500' },
    { name: 'NLP', level: 75, category: 'AI/ML', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { name: 'Computer Vision', level: 70, category: 'AI/ML', icon: Brain, color: 'from-blue-500 to-indigo-500' },
    
    // DevOps
    { name: 'Docker', level: 85, category: 'DevOps', icon: Cloud, color: 'from-blue-500 to-blue-600' },
    { name: 'AWS', level: 80, category: 'DevOps', icon: Cloud, color: 'from-orange-500 to-yellow-500' },
    { name: 'Kubernetes', level: 70, category: 'DevOps', icon: Cloud, color: 'from-blue-600 to-blue-700' },
    { name: 'CI/CD', level: 85, category: 'DevOps', icon: Cloud, color: 'from-green-500 to-green-600' },
  ];

  const categories = [
    { id: 'all', label: 'All Skills', icon: Code },
    { id: 'Frontend', label: 'Frontend', icon: Palette },
    { id: 'Backend', label: 'Backend', icon: Settings },
    { id: 'Database', label: 'Database', icon: Database },
    { id: 'AI/ML', label: 'AI/ML', icon: Brain },
    { id: 'DevOps', label: 'DevOps', icon: Cloud },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

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
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive overview of my technical skills and expertise in modern web development and AI
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
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass-effect rounded-xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${skill.color} flex items-center justify-center`}>
                    <skill.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-400">{skill.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{skill.level}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ delay: 0.8 + index * 0.05, duration: 1, ease: "easeOut" }}
                  className={`h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                />
              </div>

              {/* Skill Level Indicator */}
              <div className="flex justify-between text-xs text-gray-400">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Frontend Mastery</h3>
            <p className="text-gray-400">
              Expert in modern frontend frameworks and responsive design principles
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Integration</h3>
            <p className="text-gray-400">
              Specialized in implementing AI and machine learning solutions
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full-Stack Development</h3>
            <p className="text-gray-400">
              Comprehensive expertise across the entire development stack
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills; 