import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Copy, Check, Loader2 } from 'lucide-react';

interface GeneratedContent {
  type: string;
  content: string;
  timestamp: Date;
}

const AIContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    {
      type: 'about',
      label: 'About Me',
      description: 'Generate a professional about me section',
      prompt: 'Write a compelling about me section for a portfolio website of an AI-focused full-stack developer with 5 years of experience. Include expertise in React, Node.js, and AI integration.'
    },
    {
      type: 'project',
      label: 'Project Description',
      description: 'Create a detailed project description',
      prompt: 'Write a detailed project description for an AI-powered web application. Include technical details, challenges overcome, and the impact of the project.'
    },
    {
      type: 'blog',
      label: 'Blog Post',
      description: 'Generate a blog post about AI in web development',
      prompt: 'Write a blog post about the future of AI in web development, including practical applications and emerging trends.'
    },
    {
      type: 'skills',
      label: 'Skills Summary',
      description: 'Create a skills summary section',
      prompt: 'Write a professional skills summary for a full-stack developer specializing in AI integration, including technical skills and soft skills.'
    }
  ];

  const generateContent = async (contentType: string, customPrompt?: string) => {
    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Simulate API call - replace with actual OpenAI API integration
      const selectedType = contentTypes.find(type => type.type === contentType);
      const finalPrompt = customPrompt || selectedType?.prompt || '';

      // Mock API response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponses = {
        about: `I'm a passionate full-stack developer with over 5 years of experience crafting innovative digital solutions that bridge the gap between cutting-edge AI technology and practical user experiences. My expertise spans the entire development stack, from frontend frameworks like React and Vue.js to backend technologies including Node.js, Python, and cloud services.

What sets me apart is my deep integration of artificial intelligence into web applications. I've successfully implemented machine learning models, natural language processing capabilities, and computer vision features that enhance user engagement and solve real-world problems. My approach combines technical excellence with creative problem-solving, ensuring that every project not only meets functional requirements but also delivers exceptional user experiences.

I believe in the transformative power of AI to revolutionize how we interact with technology, and I'm committed to staying at the forefront of this rapidly evolving field. Whether it's building intelligent chatbots, implementing recommendation systems, or creating predictive analytics dashboards, I thrive on turning complex AI concepts into accessible, user-friendly applications.`,
        
        project: `**AI-Powered E-commerce Recommendation Engine**

This project represents a comprehensive solution that leverages machine learning to deliver personalized product recommendations in real-time. Built with React for the frontend and Python Flask for the backend, the system processes user behavior data through a sophisticated recommendation algorithm.

**Technical Implementation:**
- Developed a collaborative filtering system using Python's scikit-learn library
- Implemented real-time data processing with Apache Kafka
- Created a responsive React dashboard with D3.js visualizations
- Integrated with MongoDB for scalable data storage
- Deployed using Docker containers on AWS ECS

**Key Features:**
- Real-time recommendation updates based on user interactions
- A/B testing framework for algorithm optimization
- Comprehensive analytics dashboard for business insights
- RESTful API with GraphQL support for flexible data queries

**Impact:**
The system increased conversion rates by 35% and average order value by 28%, resulting in significant revenue growth for the client. The modular architecture allows for easy scaling and integration with existing e-commerce platforms.`,
        
        blog: `# The Future of AI in Web Development: A Developer's Perspective

As we navigate through 2024, artificial intelligence is no longer just a buzzword—it's fundamentally reshaping how we approach web development. From intelligent user interfaces to automated testing and deployment, AI is becoming an integral part of the modern developer's toolkit.

## The Rise of AI-Powered Development Tools

The landscape of web development tools has evolved dramatically with the integration of AI capabilities. Code completion tools like GitHub Copilot and Tabnine are just the beginning. We're now seeing AI-powered debugging assistants, automated testing frameworks, and even intelligent deployment systems that can predict and prevent potential issues before they reach production.

## Practical Applications in Modern Web Apps

### 1. Intelligent User Interfaces
AI is enabling the creation of more intuitive and personalized user experiences. From smart form validation that learns from user behavior to dynamic content recommendations, AI-powered UIs are setting new standards for user engagement.

### 2. Automated Testing and Quality Assurance
Machine learning algorithms can now analyze code patterns, predict potential bugs, and even generate comprehensive test suites. This not only reduces development time but also improves code quality and reliability.

### 3. Performance Optimization
AI-driven performance monitoring tools can automatically identify bottlenecks, optimize resource usage, and even predict when scaling might be necessary.

## The Developer's Role in the AI Era

As AI becomes more prevalent in web development, developers need to adapt their skill sets. Understanding machine learning concepts, working with AI APIs, and integrating intelligent features into applications are becoming essential skills.

The future belongs to developers who can effectively bridge the gap between traditional web development and AI capabilities. It's not about replacing developers with AI—it's about empowering developers with AI tools to create better, more intelligent applications.

## Looking Ahead

The integration of AI in web development is still in its early stages, but the potential is enormous. As we move forward, we'll see more sophisticated AI tools, better integration frameworks, and new paradigms for building intelligent web applications.

The key to success in this evolving landscape is continuous learning and experimentation. Developers who embrace AI as a powerful ally rather than a threat will be best positioned to create the next generation of web applications.`,
        
        skills: `## Technical Skills

**Frontend Development:**
- React.js, Vue.js, Angular with TypeScript
- Next.js and Nuxt.js for SSR/SSG applications
- Tailwind CSS, Styled Components, and modern CSS frameworks
- Progressive Web Apps (PWA) development
- Responsive design and accessibility standards

**Backend Development:**
- Node.js with Express.js and Fastify
- Python with Django and Flask frameworks
- GraphQL and RESTful API design
- Microservices architecture and containerization
- Database design (PostgreSQL, MongoDB, Redis)

**AI & Machine Learning:**
- TensorFlow and PyTorch for model development
- Natural Language Processing (NLP) with spaCy and NLTK
- Computer Vision with OpenCV and TensorFlow.js
- OpenAI API integration and prompt engineering
- Recommendation systems and predictive analytics

**DevOps & Cloud:**
- AWS, Google Cloud Platform, and Azure services
- Docker and Kubernetes for container orchestration
- CI/CD pipelines with GitHub Actions and Jenkins
- Infrastructure as Code with Terraform
- Monitoring and logging with ELK stack

## Soft Skills

**Problem Solving:** Analytical approach to complex technical challenges with creative solution development.

**Communication:** Excellent verbal and written communication skills for client interactions and team collaboration.

**Leadership:** Experience leading development teams and mentoring junior developers.

**Adaptability:** Quick learner with ability to adapt to new technologies and methodologies.

**Project Management:** Agile methodology expertise with strong organizational and time management skills.`
      };

      const response = mockResponses[contentType as keyof typeof mockResponses] || 'Content generated successfully!';
      
      setGeneratedContent({
        type: contentType,
        content: response,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent({
        type: contentType,
        content: 'Error generating content. Please try again.',
        timestamp: new Date()
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedContent) {
      try {
        await navigator.clipboard.writeText(generatedContent.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">AI Content Generator</h3>
        <p className="text-gray-400">Generate personalized content for your portfolio using AI</p>
      </div>

      {/* Content Type Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {contentTypes.map((type) => (
          <motion.button
            key={type.type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => generateContent(type.type)}
            disabled={isGenerating}
            className="glass-effect rounded-lg p-4 text-left hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="font-semibold text-white">{type.label}</span>
            </div>
            <p className="text-sm text-gray-400">{type.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Custom Prompt Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Custom Prompt
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a custom prompt for content generation..."
            className="flex-1 bg-dark-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => generateContent('custom', prompt)}
            disabled={isGenerating || !prompt.trim()}
            className="button-primary disabled:opacity-50"
          >
            Generate
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Generating content with AI...</p>
        </motion.div>
      )}

      {/* Generated Content */}
      {generatedContent && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-white capitalize">
                {generatedContent.type} Content
              </h4>
              <p className="text-sm text-gray-400">
                Generated on {generatedContent.timestamp.toLocaleString()}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Copy</span>
                </>
              )}
            </motion.button>
          </div>
          
          <div className="bg-dark-800 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
              {generatedContent.content}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIContentGenerator; 