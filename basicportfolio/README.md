# AI-Powered Portfolio Website

A modern, futuristic portfolio website with AI content generation integration. Built with React, TypeScript, and cutting-edge web technologies.

## 🚀 Features

### Core Functionalities
- **Responsive Design**: Fully responsive UI that works perfectly on all devices
- **Interactive Elements**: Smooth animations and micro-interactions using Framer Motion
- **AI Content Generation**: Integrated AI-powered content creation for portfolio sections
- **Project Showcase**: Interactive project gallery with filtering and detailed views
- **Contact Form**: Modern contact form with AI-assisted message suggestions
- **Blog Section**: AI-generated blog posts with markdown support

### AI Integration
- **Content Generation**: Generate personalized content for About, Projects, Blog, and Skills sections
- **Message Suggestions**: AI-powered suggestions for contact form messages
- **Smart Responses**: Intelligent content recommendations based on user input
- **OpenAI API Ready**: Easy integration with OpenAI's GPT models

### Modern/Futuristic Design
- **Glass Morphism**: Modern glass-effect UI components
- **Gradient Animations**: Dynamic gradient backgrounds and text effects
- **Smooth Transitions**: Fluid page transitions and scroll animations
- **Dark Theme**: Elegant dark theme with accent colors
- **Custom Animations**: Unique loading screens and interactive elements

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Markdown**: React Markdown
- **AI Integration**: OpenAI API (configurable)
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-portfolio-website.git
   cd ai-portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3002`

## 🔧 Configuration

### AI Integration Setup

To enable real AI content generation, you'll need to:

1. **Get an OpenAI API Key**
   - Sign up at [OpenAI](https://openai.com)
   - Generate an API key in your dashboard
   - Add it to your `.env` file

2. **Update AI Service**
   Replace the mock AI responses in `src/components/AIContentGenerator.tsx` with actual API calls:

   ```typescript
   const generateContent = async (contentType: string, customPrompt?: string) => {
     const response = await fetch('/api/generate-content', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         prompt: customPrompt || selectedType?.prompt,
         type: contentType
       })
     });
     
     const data = await response.json();
     return data.content;
   };
   ```

### Customization

#### Personal Information
Update the following files with your information:
- `src/components/Hero.tsx` - Name and personal details
- `src/components/About.tsx` - About section content
- `src/components/Contact.tsx` - Contact information
- `src/components/Footer.tsx` - Social links and contact details

#### Projects
Modify the projects array in `src/components/Projects.tsx`:
```typescript
const projects: Project[] = [
  {
    id: 1,
    title: "Your Project Title",
    description: "Project description...",
    technologies: ["React", "Node.js", "AI"],
    category: "ai",
    liveUrl: "https://your-project.com",
    githubUrl: "https://github.com/yourusername/project",
    features: ["Feature 1", "Feature 2"]
  }
];
```

#### Skills
Update the skills array in `src/components/Skills.tsx`:
```typescript
const skills: Skill[] = [
  {
    name: 'Your Skill',
    level: 90,
    category: 'Frontend',
    icon: Code,
    color: 'from-blue-500 to-cyan-500'
  }
];
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#0ea5e9` to `#0284c7`)
- **Secondary**: Purple gradient (`#d946ef` to `#c026d3`)
- **Dark**: Dark theme with various gray shades
- **Accent**: Custom accent colors for different sections

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono for code elements
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- **Glass Effect**: `glass-effect` class for modern glass morphism
- **Gradient Text**: `gradient-text` class for animated text
- **Buttons**: `button-primary` and `button-secondary` classes
- **Cards**: `card-hover` class for interactive cards

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## 🔮 Future Enhancements

- [ ] Real-time AI chat integration
- [ ] Voice-controlled navigation
- [ ] 3D interactive elements
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Advanced AI content personalization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for AI capabilities
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Contact me at john.doe@example.com
- Connect on [LinkedIn](https://linkedin.com/in/johndoe)

---

**Made with ❤️ and �� in San Francisco** 