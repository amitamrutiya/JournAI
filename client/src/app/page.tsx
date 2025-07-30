import { type Metadata } from 'next';

import { FeaturesSection } from '@/components/landing/features-section';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'JournAI - AI-Powered Journaling & Mood Tracking',
  description:
    'Transform your journaling experience with AI insights, mood tracking, and personalized reflection prompts. Start your mental wellness journey today.',
  keywords:
    'AI journaling, mood tracker, mental health app, digital diary, emotional wellness',
});

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="home-page">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
