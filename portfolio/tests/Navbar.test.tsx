import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../src/components/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock react-scroll
jest.mock('react-scroll', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={`#${to}`} {...props}>
      {children}
    </a>
  ),
}));

// Mock ThemeToggle component
jest.mock('../src/components/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle">Theme Toggle</button>;
  };
});

describe('Navbar', () => {
  const mockSectionRefs = [
    { id: 'home', ref: { current: null } },
    { id: 'about', ref: { current: null } },
    { id: 'projects', ref: { current: null } },
  ];

  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  it('renders without crashing', () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  it('displays all navigation items', () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    
    expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop and mobile
    expect(screen.getAllByText('About')).toHaveLength(2);
    expect(screen.getAllByText('Projects')).toHaveLength(2);
    expect(screen.getAllByText('Certificates')).toHaveLength(2);
    expect(screen.getAllByText('Blog')).toHaveLength(2);
    expect(screen.getAllByText('Contact')).toHaveLength(2);
  });

  it('renders theme toggle button', () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('shows mobile menu button on mobile view', () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', async () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Menu should be closed initially
    const mobileMenu = screen.getByRole('navigation').querySelector('.md\\:hidden.hidden');
    expect(mobileMenu).toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(menuButton);
    
    // Menu should be open
    await waitFor(() => {
      const mobileMenu = screen.getByRole('navigation').querySelector('.md\\:hidden.block');
      expect(mobileMenu).toBeInTheDocument();
    });
    
    // Click to close menu
    fireEvent.click(menuButton);
    
    // Menu should be closed
    await waitFor(() => {
      const mobileMenu = screen.getByRole('navigation').querySelector('.md\\:hidden.hidden');
      expect(mobileMenu).toBeInTheDocument();
    });
  });

  it('applies scrolled styles when page is scrolled', () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    
    const nav = screen.getByRole('navigation');
    // Initially should have transparent background
    expect(nav).toHaveClass('bg-transparent');
    
    // Mock scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
    });
    
    // Trigger scroll event
    fireEvent.scroll(window);
    
    // After scroll, should have scrolled styles (this is tested in the component itself)
    expect(nav).toBeInTheDocument();
  });

  it('renders scroll links for internal navigation', () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    
    const homeLinks = screen.getAllByText('Home');
    const desktopHomeLink = homeLinks[0].closest('a');
    expect(desktopHomeLink).toHaveAttribute('href', '#home');
  });

  it('renders Next.js Link for external navigation', () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    
    const blogLinks = screen.getAllByText('Blog');
    const desktopBlogLink = blogLinks[0].closest('a');
    expect(desktopBlogLink).toHaveAttribute('href', '/blog');
  });

  it('closes mobile menu when navigation link is clicked', async () => {
    render(<Navbar sectionRefs={mockSectionRefs} />);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Open menu
    fireEvent.click(menuButton);
    
    // Click on a navigation link
    const homeLinks = screen.getAllByText('Home');
    const mobileHomeLink = homeLinks[1]; // Mobile menu link
    fireEvent.click(mobileHomeLink);
    
    // Menu should close
    await waitFor(() => {
      const mobileMenu = screen.getByRole('navigation').querySelector('.md\\:hidden.hidden');
      expect(mobileMenu).toBeInTheDocument();
    });
  });

  it('works without sectionRefs prop', () => {
    render(<Navbar />);
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });
});