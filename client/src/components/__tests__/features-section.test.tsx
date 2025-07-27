import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { FeaturesSection } from '../landing/features-section';

describe('FeaturesSection', () => {
  test('renders features section with correct data-testid', () => {
    render(<FeaturesSection />);
    expect(screen.getByTestId('features-section')).toBeInTheDocument();
  });

  test('renders features title', () => {
    render(<FeaturesSection />);
    const title = screen.getByTestId('features-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(
      'Everything You Need for Better Self-Reflection',
    );
  });

  test('renders features grid', () => {
    render(<FeaturesSection />);
    expect(screen.getByTestId('features-grid')).toBeInTheDocument();
  });

  test('renders all feature cards', () => {
    render(<FeaturesSection />);

    // Check for specific feature cards
    expect(
      screen.getByTestId('feature-card-write-or-upload-journals'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('feature-card-ai-mood-detection'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('feature-card-smart-insights'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('feature-card-track-your-progress'),
    ).toBeInTheDocument();
  });

  test('renders feature titles and descriptions', () => {
    render(<FeaturesSection />);

    // Check feature titles
    expect(screen.getByText('Write or Upload Journals')).toBeInTheDocument();
    expect(screen.getByText('AI Mood Detection')).toBeInTheDocument();
    expect(screen.getByText('Smart Insights')).toBeInTheDocument();
    expect(screen.getByText('Track Your Progress')).toBeInTheDocument();

    // Check feature descriptions
    expect(
      screen.getByText(
        'Write freely or upload PDFs – your thoughts, your way.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Instantly know how your journal reflects your emotions.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Get personalized recommendations for better mental health.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'See your emotional journey unfold with beautiful charts.',
      ),
    ).toBeInTheDocument();
  });

  test('renders feature icons', () => {
    render(<FeaturesSection />);

    // Check for emojis in feature icons
    expect(screen.getByText('✍️')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('🧠')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  test('renders powerful features badge', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Powerful Features')).toBeInTheDocument();
  });

  test('renders privacy notice', () => {
    render(<FeaturesSection />);
    expect(
      screen.getByText('🔒 Your Privacy is Our Priority'),
    ).toBeInTheDocument();
  });
});
