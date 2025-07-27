'use client';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      data-testid="header"
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          data-testid="logo"
          className="flex cursor-pointer items-center space-x-2"
          href={'/'}
        >
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-sm font-bold">J</span>
          </div>
          <h1 className="text-foreground text-xl font-bold">JournAI</h1>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/write"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            ✍️ Write
          </Link>
          <Link
            href="/calendar"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            📅 Calendar
          </Link>
          <Link
            href="/insights"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            📊 Insights
          </Link>
        </nav>

        {/* Desktop Auth + Theme Toggle */}
        <div
          data-testid="desktop-auth-menu"
          className="hidden items-center space-x-3 md:flex"
        >
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <Button
                data-testid="desktop-sign-in-button"
                variant="outline"
                size="sm"
                className="text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                data-testid="desktop-sign-up-button"
                size="sm"
                className="text-primary-foreground hover:bg-primary/90 bg-primary px-4 py-2"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button + Theme Toggle */}
        <div
          data-testid="mobile-menu-toggle"
          className="flex items-center space-x-2 md:hidden"
        >
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Button
            data-testid="mobile-menu-button"
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 p-0"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-menu"
          className="bg-background border-t md:hidden"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <SignedOut>
                <div className="flex gap-2 pt-2">
                  <SignInButton>
                    <Button
                      data-testid="mobile-sign-in-button"
                      variant="outline"
                      size="sm"
                      className="text-foreground hover:bg-accent hover:text-accent-foreground flex-1"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button
                      data-testid="mobile-sign-up-button"
                      size="sm"
                      className="text-primary-foreground hover:bg-primary/90 bg-primary flex-1"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
