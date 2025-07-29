//
import { type Metadata } from 'next';

import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Write Your Journal - JournAI',
  description:
    'Start writing your journal entry with AI-powered insights and mood analysis. Express yourself in a safe, private space.',
  keywords: 'write journal, journal entry, AI writing assistant, mood tracking',
});

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
