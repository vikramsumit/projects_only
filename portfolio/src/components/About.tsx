// About section with photo, bio, skills, and timeline.
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skill, Experience, Education } from '@/types';
import AnimatedSection from './AnimatedSection';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaDatabase } from 'react-icons/fa';
import { SiTailwindcss, SiTypescript, SiNextdotjs, SiMongodb, SiPostgresql, SiPython } from 'react-icons/si';

// Dummy Data for About Section
const skills: Skill[] = [
  { name: 'React', icon: 'FaReact', level: 90 },
  { name: 'Next.js', icon: 'SiNextdotjs', level: 85 },
  { name: 'TypeScript', icon: 'SiTypescript', level: 80 },
  { name: 'Tailwind CSS', icon: 'SiTailwindcss', level: 95 },
  { name: 'Node.js', icon: 'FaNodeJs', level: 80 },
  { name: 'Express.js', icon: 'FaNodeJs', level: 75 },
  { name: 'MongoDB', icon: 'SiMongodb', level: 70 },
  { name: 'PostgreSQL', icon: 'SiPostgresql', level: 65 },
  { name: 'Python', icon: 'SiPython', level: 70 },
  { name: 'HTML5', icon: 'FaHtml5', level: 98 },
  { name: 'CSS3', icon: 'FaCss3Alt', level: 95 },
  { name: 'JavaScript', icon: 'FaJsSquare', level: 90 },
];

const experiences: Experience[] = [
  {
    id: 'exp1',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Inc.',
    duration: 'Jan 2022 - Present',
    description: [
      'Led development of scalable web applications using Next.js and Node.js.',
      'Implemented robust APIs and integrated with various third-party services.',
      'Mentored junior developers and conducted code reviews.',
    ],
  },
  {
    id: 'exp2',
    title: 'Software Developer',
    company: 'Innovate Corp.',
    duration: 'Jul 2019 - Dec 2021',
    description: [
      'Developed and maintained front-end features using React and Redux.',
      'Contributed to backend services with Python and Django.',
      'Participated in agile development cycles and daily stand-ups.',
    ],
  },
];

const education: Education[] = [
  {
    id: 'edu1',
    degree: 'Master of Science in Computer Science',
    institution: 'University of Technology',
    duration: '2018 - 2020',
    details: ['Specialization in Distributed Systems', 'Thesis on Blockchain Technology'],
  },
  {
    id: 'edu2',
    degree: 'Bachelor of Technology in Information Technology',
    institution: 'National Institute of Engineering',
    duration: '2014 - 2018',
    details: ['Graduated with Honors', 'Active member of the Robotics Club'],
  },
];

const getSkillIcon = (iconName: string) => {
  switch (iconName) {
    case 'FaReact': return <FaReact className="h-6 w-6 text-blue-500" />;
    case 'FaNodeJs': return <FaNodeJs className="h-6 w-6 text-green-500" />;
    case 'FaHtml5': return <FaHtml5 className="h-6 w-6 text-orange-500" />;
    case 'FaCss3Alt': return <FaCss3Alt className="h-6 w-6 text-blue-600" />;
    case 'FaJsSquare': return <FaJsSquare className="h-6 w-6 text-yellow-500" />;
    case 'FaDatabase': return <FaDatabase className="h-6 w-6 text-gray-500" />;
    case 'SiTailwindcss': return <SiTailwindcss className="h-6 w-6 text-teal-500" />;
    case 'SiTypescript': return <SiTypescript className="h-6 w-6 text-blue-700" />;
    case 'SiNextdotjs': return <SiNextdotjs className="h-6 w-6 text-gray-900 dark:text-white" />;
    case 'SiMongodb': return <SiMongodb className="h-6 w-6 text-green-600" />;
    case 'SiPostgresql': return <SiPostgresql className="h-6 w-6 text-blue-800" />;
    case 'SiPython': return <SiPython className="h-6 w-6 text-blue-400" />;
    default: return null;
  }
};

const About: React.FC = () => {
  return (
    <AnimatedSection id="about" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-primary-light dark:text-primary-dark">
        About Me
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Photo and Bio */}
        <motion.div
          className="md:col-span-1 flex flex-col items-center text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/profile.jpg" // Placeholder image
            alt="Your Name"
            width={250}
            height={250}
            className="rounded-full border-4 border-primary-light dark:border-primary-dark shadow-lg mb-6 object-cover"
            priority // Load profile image eagerly
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/250x250/6366F1/FFFFFF?text=Profile';
            }}
          />
          <p className="text-lg text-text-light dark:text-text-dark leading-relaxed">
            Hello! I'm Your Name, a passionate full-stack developer with a knack for building
            beautiful and functional web applications. With X years of experience, I specialize in
            creating dynamic user interfaces and robust backend systems. My journey in tech began
            with a curiosity for how things work, evolving into a dedication to crafting efficient
            and scalable solutions. I'm always eager to learn new technologies and take on exciting
            challenges.
          </p>
        </motion.div>

        {/* Skills */}
        <div className="md:col-span-2">
          <h3 className="text-3xl font-semibold mb-8 text-text-light dark:text-text-dark text-center md:text-left">
            My Skills
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex items-center mb-2">
                  {getSkillIcon(skill.icon)}
                  <span className="ml-3 text-lg font-medium text-text-light dark:text-text-dark">
                    {skill.name}
                  </span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-primary-light dark:bg-primary-dark h-2.5 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience & Education Timeline */}
      <div className="mt-16">
        <h3 className="text-3xl font-semibold mb-12 text-text-light dark:text-text-dark text-center">
          Experience & Education
        </h3>
        <div className="relative wrap overflow-hidden p-10 h-full">
          <div className="border-2-2 absolute border-opacity-20 border-primary-light dark:border-primary-dark h-full border" style={{ left: '50%' }}></div>

          {/* Experiences */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
            >
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-primary-light dark:bg-primary-dark shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white">💼</h1>
              </div>
              <div className="order-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl w-5/12 px-6 py-4">
                <h4 className="mb-3 font-bold text-xl text-primary-light dark:text-primary-dark">
                  {exp.title}
                </h4>
                <p className="text-sm leading-snug text-gray-600 dark:text-gray-400 mb-2">
                  {exp.company} | {exp.duration}
                </p>
                <ul className="list-disc list-inside text-text-light dark:text-text-dark text-sm">
                  {exp.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}

          {/* Education */}
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              className={`mb-8 flex justify-between items-center w-full ${
                (experiences.length + index) % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'
              }`}
              initial={{ opacity: 0, x: (experiences.length + index) % 2 === 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * (experiences.length + index) }}
            >
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-secondary-light dark:bg-secondary-dark shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white">🎓</h1>
              </div>
              <div className="order-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl w-5/12 px-6 py-4">
                <h4 className="mb-3 font-bold text-xl text-secondary-light dark:text-secondary-dark">
                  {edu.degree}
                </h4>
                <p className="text-sm leading-snug text-gray-600 dark:text-gray-400 mb-2">
                  {edu.institution} | {edu.duration}
                </p>
                {edu.details && (
                  <ul className="list-disc list-inside text-text-light dark:text-text-dark text-sm">
                    {edu.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default About;