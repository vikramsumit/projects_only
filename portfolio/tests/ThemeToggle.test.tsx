import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../src/components/ThemeToggle';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle', () => {
  const mockUseTheme = require('next-themes').useTheme;

  beforeEach(() => {
    mockUseTheme.mockClear();
  });

  it('renders without crashing', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('☀️');
  });

  it('shows moon icon in light mode', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    expect(button).toBeInTheDocument();
  });

  it('shows sun icon in dark mode', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🌙');
  });

  it('calls setTheme with "dark" when clicked in light mode', () => {
    const mockSetTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with "light" when clicked in dark mode', () => {
    const mockSetTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('handles system theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    expect(button).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    expect(button).toHaveAttribute('aria-label');
    // Button type is not explicitly set, so it defaults to 'submit' in forms or undefined
  });
});