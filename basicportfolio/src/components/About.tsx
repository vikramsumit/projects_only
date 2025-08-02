import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Sparkles, Lightbulb, Target, Users, Award } from 'lucide-react';
import AIContentGenerator from './AIContentGenerator';
import { AnimatePresence } from 'framer-motion';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI Integration",
      description: "Seamlessly integrate AI capabilities into web applications"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Pioneering new approaches to digital experiences"
    },
    {
      icon: Lightbulb,
      title: "Problem Solving",
      description: "Creative solutions for complex technical challenges"
    },
    {
      icon: Target,
      title: "Focus",
      description: "Goal-oriented development with measurable results"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Strong team player with excellent communication skills"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering high-quality, scalable solutions"
    }
  ];

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
            <span className="gradient-text">About Me</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A passionate developer with expertise in AI integration and modern web technologies
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Crafting the Future with AI
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                With over 5 years of experience in full-stack development, I specialize in creating 
                innovative web applications that leverage the power of artificial intelligence. My 
                passion lies in bridging the gap between cutting-edge AI technology and practical, 
                user-friendly applications.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                I believe in the transformative potential of AI to enhance user experiences and 
                solve real-world problems. From natural language processing to computer vision, 
                I've worked on projects that demonstrate the practical applications of AI in 
                modern web development.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                className="button-primary flex items-center space-x-2"
              >
                <Brain className="w-5 h-5" />
                <span>Generate AI Content</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="glass-effect rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10"></div>
              <div className="relative z-10">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Brain className="w-16 h-16 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">AI-Powered Developer</h4>
                  <p className="text-gray-400">Specializing in intelligent web solutions</p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-primary-400">5+</div>
                    <div className="text-sm text-gray-400">Years Experience</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-secondary-400">50+</div>
                    <div className="text-sm text-gray-400">Projects Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Content Generator */}
        <AnimatePresence>
          {showAIGenerator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-16"
            >
              <AIContentGenerator />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="glass-effect rounded-xl p-6 card-hover"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About; 