// Blog post types
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  readingTime?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime?: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'other';
}

// Certificate types
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description?: string;
  url?: string;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

export interface SectionRef {
  id: string;
  ref: React.RefObject<HTMLElement>;
}

// Social media types
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Animation types
export interface AnimationProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  viewport?: any;
}

// SEO types
export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

// Pagination types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Skill types
export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
  icon?: string;
}

// Experience types
export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string[];
  technologies: string[];
}

// Education types
export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  gpa?: string;
}

// Component props types
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  sectionRefs?: SectionRef[];
}

export interface NavbarProps {
  sectionRefs?: SectionRef[];
}

export interface HeroProps {
  name?: string;
  title?: string;
  subtitle?: string;
}

export interface AboutProps {
  bio?: string;
  skills?: Skill[];
  experience?: Experience[];
  education?: Education[];
}

export interface ProjectsProps {
  projects?: Project[];
  featured?: boolean;
}

export interface CertificatesProps {
  certificates?: Certificate[];
}

export interface ContactProps {
  email?: string;
  location?: string;
}

export interface FooterProps {
  socialLinks?: SocialLink[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form submission types
export interface FormSubmissionResponse {
  success: boolean;
  message: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;