import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Header } from '../header';

// Mock Clerk components
vi.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-in">{children}</div>
  ),
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-out">{children}</div>
  ),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-up-button">{children}</div>
  ),
  UserButton: () => <div data-testid="user-button">User</div>,
}));

// Mock ThemeToggle component
vi.mock('../theme-toggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

describe('Header', () => {
  test('renders header with correct data-testid', () => {
    render(<Header />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('renders logo with correct text', () => {
    render(<Header />);
    const logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent('JournAI');
  });

  test('renders desktop auth menu', () => {
    render(<Header />);
    const desktopMenu = screen.getByTestId('desktop-auth-menu');
    expect(desktopMenu).toBeInTheDocument();
  });

  test('renders mobile menu toggle', () => {
    render(<Header />);
    const mobileToggle = screen.getByTestId('mobile-menu-toggle');
    expect(mobileToggle).toBeInTheDocument();
  });

  test('mobile menu button toggles mobile menu visibility', () => {
    render(<Header />);
    const menuButton = screen.getByTestId('mobile-menu-button');

    // Initially mobile menu should not be visible
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

    // Click to open menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // Click again to close menu
    fireEvent.click(menuButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  test('renders sign in and sign up buttons in desktop menu', () => {
    render(<Header />);
    expect(screen.getByTestId('desktop-sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-sign-up-button')).toBeInTheDocument();
  });

  test('renders theme toggle', () => {
    render(<Header />);
    expect(screen.getAllByTestId('theme-toggle')[0]).toBeInTheDocument();
  });

  test('mobile menu contains sign in and sign up buttons when opened', () => {
    render(<Header />);
    const menuButton = screen.getByTestId('mobile-menu-button');

    fireEvent.click(menuButton);

    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    expect(screen.getByTestId('mobile-sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-sign-up-button')).toBeInTheDocument();
  });
});
