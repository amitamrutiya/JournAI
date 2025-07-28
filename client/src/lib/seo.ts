import { type Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
}

const SITE_CONFIG = {
  siteName: 'JournAI',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://journai.store',
};

export function generateMetadata({
  title,
  description,
  keywords,
}: SEOConfig): Metadata {
  const fullTitle = title.includes('JournAI') ? title : `${title} | JournAI`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      siteName: SITE_CONFIG.siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    metadataBase: new URL(SITE_CONFIG.siteUrl),
  };
}

export const defaultSEO: SEOConfig = {
  title: 'JournAI - Your AI-Powered Mood Journal',
  description:
    'Transform your journaling experience with AI-powered insights, mood tracking, and personalized reflection prompts. Start your mental wellness journey today.',
  keywords:
    'AI journaling, mood tracker, mental health, personal reflection, diary app, emotional wellness',
};
