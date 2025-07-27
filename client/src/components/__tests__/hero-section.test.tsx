import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { HeroSection } from '../landing/hero-section';

describe('HeroSection', () => {
  test('renders hero section with correct data-testid', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  test('renders hero content', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('hero-content')).toBeInTheDocument();
  });

  test('renders hero title with correct text', () => {
    render(<HeroSection />);
    const title = screen.getByTestId('hero-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Reflect Better.');
    expect(title).toHaveTextContent('Feel Deeper.');
    expect(title).toHaveTextContent('Let AI Understand You.');
  });

  test('renders hero description', () => {
    render(<HeroSection />);
    const description = screen.getByTestId('hero-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(
      'JournAI helps you journal daily, detect your mood, and track your emotional journey with AI insights.',
    );
  });

  test('renders call-to-action buttons', () => {
    render(<HeroSection />);

    const startButton = screen.getByTestId('start-journaling-button');
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveTextContent('📝 Start Journaling');

    const howItWorksButton = screen.getByTestId('how-it-works-button');
    expect(howItWorksButton).toBeInTheDocument();
    expect(howItWorksButton).toHaveTextContent('📚 How It Works');
  });

  test('renders AI-Powered Journaling badge', () => {
    render(<HeroSection />);
    expect(screen.getByText('AI-Powered Journaling')).toBeInTheDocument();
  });

  test('renders mock journal entry', () => {
    render(<HeroSection />);
    expect(screen.getByText("Today's Entry")).toBeInTheDocument();
    expect(
      screen.getByText(
        'Had a wonderful day exploring the city. Felt energized and creative...',
      ),
    ).toBeInTheDocument();
  });

  test('renders AI analysis section', () => {
    render(<HeroSection />);
    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
  });
});
