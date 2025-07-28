import { type Metadata } from 'next';

import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Journal Calendar - JournAI',
  description:
    'Navigate through your journaling journey with calendar view. See mood patterns and access past entries.',
  keywords: 'journal calendar, mood calendar, journal history, daily entries',
});

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
