import { type Metadata } from 'next';

import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'AI Insights & Analytics - JournAI',
  description:
    'Discover patterns in your mental wellness journey with AI-powered insights and mood analytics.',
  keywords:
    'AI insights, mood analytics, mental health tracking, emotional patterns',
});

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
