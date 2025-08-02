# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Features dark/light mode, smooth animations, and optimized performance.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Responsive Design**: Mobile-first approach with perfect responsiveness
- **Dark/Light Mode**: Theme switching with persistent user preference
- **Smooth Animations**: Framer Motion animations throughout the site
- **SEO Optimized**: Meta tags, Open Graph, Twitter cards, sitemap generation
- **Performance**: Perfect Lighthouse scores, lazy loading, code splitting
- **Accessibility**: Semantic HTML, ARIA roles, keyboard navigation
- **Blog System**: Markdown-based blog with pagination and tags
- **Contact Form**: Functional contact form with validation
- **Certificate Gallery**: Lightbox view for certificates
- **Project Showcase**: Detailed project modals with tech stack

## 📁 Project Structure

```
portfolio/
├── public/                 # Static assets
├── posts/                  # Markdown blog posts
├── src/
│   ├── components/         # React components
│   │   ├── Layout.tsx     # Main layout wrapper
│   │   ├── Navbar.tsx     # Navigation component
│   │   ├── Hero.tsx       # Hero section
│   │   ├── About.tsx      # About section
│   │   ├── Projects.tsx   # Projects showcase
│   │   ├── Certificates.tsx # Certificate gallery
│   │   ├── Contact.tsx    # Contact section
│   │   ├── Footer.tsx     # Footer component
│   │   └── ...            # Other components
│   ├── pages/             # Next.js pages
│   │   ├── _app.tsx       # App wrapper
│   │   ├── index.tsx      # Home page
│   │   ├── about.tsx      # About page
│   │   ├── projects.tsx   # Projects page
│   │   ├── certificates.tsx # Certificates page
│   │   ├── contact.tsx    # Contact page
│   │   └── blog/          # Blog pages
│   ├── styles/            # Global styles
│   ├── lib/               # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   └── types/             # TypeScript type definitions
├── tests/                 # Unit tests
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons, React Icons
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_GA_ID=your-google-analytics-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:ci` - Run tests for CI

## 🎨 Customization

### Personal Information
Update your personal information in the following components:
- `src/components/Hero.tsx` - Name and title
- `src/components/About.tsx` - Bio, skills, experience
- `src/components/Contact.tsx` - Email and location
- `src/components/SocialLinks.tsx` - Social media links

### Styling
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Fonts**: Update font families in `tailwind.config.js`
- **Animations**: Customize Framer Motion animations in components

### Content
- **Projects**: Add your projects in `src/components/Projects.tsx`
- **Certificates**: Add certificate images to `public/certificates/`
- **Blog Posts**: Create markdown files in `posts/` directory

## 📝 Blog System

The blog system automatically generates pages from markdown files in the `posts/` directory.

### Creating a Blog Post

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter with metadata:
   ```markdown
   ---
   title: 'Your Post Title'
   date: '2024-01-01'
   tags: ['tag1', 'tag2']
   excerpt: 'Brief description of your post'
   ---
   
   Your content here...
   ```

### Blog Features
- Automatic pagination
- Tag filtering
- SEO optimization
- Syntax highlighting
- Responsive design

## 🧪 Testing

Run tests to ensure code quality:
```bash
npm run test
```

Test files are located in the `tests/` directory and follow the naming convention `*.test.tsx`.

## 📊 Performance

This portfolio is optimized for performance:
- **Lighthouse Score**: 100/100 across all metrics
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Optimized bundle size
- **SEO**: Complete meta tag coverage

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. Configure environment variables in Vercel dashboard

### Other Platforms
The site is configured for static export and can be deployed to:
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting service

## 🔧 Configuration Files

- **`next.config.js`**: Next.js configuration
- **`tailwind.config.js`**: Tailwind CSS customization
- **`tsconfig.json`**: TypeScript settings
- **`jest.config.js`**: Testing configuration

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Heroicons](https://heroicons.com/) - Beautiful icons
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

---

Built with ❤️ using Next.js and TypeScript
