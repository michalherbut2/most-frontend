import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format points with thousand separators
 */
export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-US').format(points);
}

/**
 * Format date to readable string
 */
// shared/lib/utils.ts

export function formatDate(date: string | Date | undefined | null): string {
  // 1. Ochrona przed null/undefined/pustym stringiem
  if (!date) return '-';

  const d = new Date(date);

  // 2. Ochrona przed "Invalid Date" (np. gdy string to "admin")
  if (isNaN(d.getTime())) {
    console.warn('Invalid date passed to formatDate:', date);
    return '-'; 
  }

  // 3. Formatowanie (zmieniłem na polski, żeby pasowało do reszty)
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}