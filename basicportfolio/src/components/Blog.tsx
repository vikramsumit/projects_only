import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, User, ArrowRight, Brain, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
}

const Blog: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of AI in Web Development: A Comprehensive Guide",
      excerpt: "Explore how artificial intelligence is revolutionizing web development and what developers need to know to stay ahead of the curve.",
      content: `# The Future of AI in Web Development: A Comprehensive Guide

Artificial intelligence is no longer just a buzzword—it's fundamentally reshaping how we approach web development. From intelligent user interfaces to automated testing and deployment, AI is becoming an integral part of the modern developer's toolkit.

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
      author: "John Doe",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "AI/ML",
      tags: ["AI", "Web Development", "Machine Learning", "Future Tech"],
      featured: true
    },
    {
      id: 2,
      title: "Building Scalable React Applications with TypeScript",
      excerpt: "Learn best practices for building large-scale React applications using TypeScript, including architecture patterns and performance optimization.",
      content: `# Building Scalable React Applications with TypeScript

TypeScript has become the standard for building large-scale React applications. Its static typing capabilities help catch errors early and provide better developer experience. In this comprehensive guide, we'll explore best practices for building scalable React applications with TypeScript.

## Project Structure and Architecture

A well-organized project structure is crucial for scalability. Here's a recommended structure for large React applications:

\`\`\`typescript
src/
├── components/
│   ├── common/
│   ├── features/
│   └── layouts/
├── hooks/
├── services/
├── types/
├── utils/
└── pages/
\`\`\`

## Type Safety Best Practices

### 1. Define Clear Interfaces
Always define interfaces for your component props and API responses:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
}
\`\`\`

### 2. Use Generic Types
Leverage generic types for reusable components:

\`\`\`typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}
\`\`\`

## Performance Optimization

### 1. Memoization
Use React.memo and useMemo for expensive computations:

\`\`\`typescript
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);
  
  return <div>{/* render processed data */}</div>;
});
\`\`\`

### 2. Code Splitting
Implement code splitting for better performance:

\`\`\`typescript
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

## State Management

For large applications, consider using state management libraries like Redux Toolkit or Zustand with proper TypeScript support.

## Testing

Implement comprehensive testing with TypeScript:

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

test('renders user information', () => {
  render(<UserCard user={mockUser} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
\`\`\`

## Conclusion

Building scalable React applications with TypeScript requires careful planning and adherence to best practices. By following these guidelines, you can create maintainable, performant, and type-safe applications that scale with your business needs.`,
      author: "John Doe",
      date: "2024-01-10",
      readTime: "12 min read",
      category: "Frontend",
      tags: ["React", "TypeScript", "Performance", "Architecture"],
      featured: false
    },
    {
      id: 3,
      title: "Implementing AI-Powered Chatbots with OpenAI API",
      excerpt: "A step-by-step guide to building intelligent chatbots using OpenAI's GPT models and integrating them into web applications.",
      content: `# Implementing AI-Powered Chatbots with OpenAI API

Chatbots have evolved significantly with the advent of large language models. OpenAI's GPT models provide unprecedented capabilities for creating intelligent, context-aware conversational agents. In this guide, we'll explore how to build AI-powered chatbots using the OpenAI API.

## Understanding the OpenAI API

The OpenAI API provides access to powerful language models that can understand context, generate human-like responses, and maintain conversation flow. Key features include:

- **Context Awareness**: Models can remember conversation history
- **Multi-turn Conversations**: Support for complex dialogue flows
- **Customizable Responses**: Control over response style and content
- **Integration Flexibility**: Easy integration with web applications

## Setting Up the Project

### 1. API Configuration
First, set up your OpenAI API key and configure the client:

\`\`\`typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
\`\`\`

### 2. Basic Chat Implementation
Create a simple chat function:

\`\`\`typescript
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function chatWithAI(messages: ChatMessage[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    throw error;
  }
}
\`\`\`

## Building the Chat Interface

### 1. React Component
Create a chat interface component:

\`\`\`typescript
import React, { useState } from 'react';

interface ChatProps {
  onSendMessage: (message: string) => Promise<void>;
}

const ChatInterface: React.FC<ChatProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      await onSendMessage(input);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 rounded-lg border"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};
\`\`\`

## Advanced Features

### 1. Context Management
Implement conversation history management:

\`\`\`typescript
class ChatSession {
  private messages: ChatMessage[] = [];
  private maxHistory = 10;

  addMessage(role: 'user' | 'assistant', content: string) {
    this.messages.push({ role, content });
    
    // Keep only recent messages to manage context length
    if (this.messages.length > this.maxHistory) {
      this.messages = this.messages.slice(-this.maxHistory);
    }
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }
}
\`\`\`

### 2. Response Streaming
Implement real-time response streaming:

\`\`\`typescript
async function streamChatResponse(messages: ChatMessage[], onChunk: (chunk: string) => void) {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      onChunk(content);
    }
  }
}
\`\`\`

## Best Practices

### 1. Error Handling
Implement robust error handling:

\`\`\`typescript
async function safeChatRequest(messages: ChatMessage[]) {
  try {
    return await chatWithAI(messages);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Handle API-specific errors
      console.error('API Error:', error.message);
      return 'Sorry, I encountered an error. Please try again.';
    } else {
      // Handle other errors
      console.error('Unexpected error:', error);
      return 'Sorry, something went wrong. Please try again later.';
    }
  }
}
\`\`\`

### 2. Rate Limiting
Implement rate limiting to avoid API quota issues:

\`\`\`typescript
class RateLimiter {
  private requests: number[] = [];
  private maxRequests = 10;
  private windowMs = 60000; // 1 minute

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }
}
\`\`\`

## Integration with Web Applications

### 1. WebSocket Integration
For real-time chat, consider using WebSockets:

\`\`\`typescript
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('chat message', async (message) => {
    try {
      const response = await chatWithAI([{ role: 'user', content: message }]);
      socket.emit('chat response', response);
    } catch (error) {
      socket.emit('chat error', 'Failed to get response');
    }
  });
});
\`\`\`

## Conclusion

Building AI-powered chatbots with OpenAI API opens up exciting possibilities for creating intelligent, engaging user experiences. By following these guidelines and best practices, you can create chatbots that are not only functional but also provide meaningful value to your users.

Remember to always consider ethical implications, implement proper error handling, and ensure your chatbot aligns with your application's goals and user expectations.`,
      author: "John Doe",
      date: "2024-01-05",
      readTime: "15 min read",
      category: "AI/ML",
      tags: ["OpenAI", "Chatbots", "API", "AI"],
      featured: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'AI/ML', label: 'AI/ML' },
    { id: 'Frontend', label: 'Frontend' },
    { id: 'Backend', label: 'Backend' },
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);

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
            <span className="gradient-text">Blog & Insights</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sharing knowledge and insights about AI, web development, and emerging technologies
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

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-16"
          >
            <div className="glass-effect rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm rounded-full">
                  Featured
                </span>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPost(featuredPost)}
                      className="button-primary flex items-center space-x-2"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Brain className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.filter(post => !post.featured || selectedCategory !== 'all').map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass-effect rounded-xl overflow-hidden card-hover"
            >
              {/* Post Header */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-2 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Post Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPost(post)}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Blog Post Modal */}
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedPost.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full">
                      {selectedPost.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedPost.readTime}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </motion.button>
              </div>

              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span>By {selectedPost.author}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
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

export default Blog; 