// eslint-disable-next-line unicorn/prevent-abbreviations
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MOODS = {
  happy: { emoji: '😊', color: '#10B981' },
  sad: { emoji: '😢', color: '#3B82F6' },
  anxious: { emoji: '😰', color: '#F59E0B' },
  neutral: { emoji: '😐', color: '#6B7280' },
  excited: { emoji: '🤩', color: '#8B5CF6' },
  angry: { emoji: '😠', color: '#EF4444' },
  peaceful: { emoji: '🕊️', color: '#34D399' },
  grateful: { emoji: '🙏', color: '#059669' },
  frustrated: { emoji: '😤', color: '#EA580C' },
  worried: { emoji: '😟', color: '#F87171' },
  content: { emoji: '😌', color: '#0D9488' },
  tired: { emoji: '😴', color: '#9CA3AF' },
};
