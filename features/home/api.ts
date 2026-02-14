// features/home/api/queries.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api-client';

// Types
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime?: string;
  location?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  title: string;
  excerpt: string;
  fullContent: string;
  link: string;
  imageUrl?: string;
  source: string;
  publishedDate: string;
  scrapedAt: string;
  author?: string;
  category?: string;
  likes?: number;
  comments?: number;
}

// Query keys
export const homeKeys = {
  all: ['home'] as const,
  todayEvents: () => [...homeKeys.all, 'today-events'] as const,
  upcomingEvents: (limit: number) => [...homeKeys.all, 'upcoming-events', limit] as const,
  latestPosts: () => [...homeKeys.all, 'latest-posts'] as const,
};

/**
 * Hook to fetch today's events
 */
export function useTodayEvents() {
  return useQuery({
    queryKey: homeKeys.todayEvents(),
    queryFn: async () => {
      const data = await apiClient.get<CalendarEvent[]>('/calendar/today');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch upcoming events
 */
export function useUpcomingEvents(limit: number = 5) {
  return useQuery({
    queryKey: homeKeys.upcomingEvents(limit),
    queryFn: async () => {
      const data = await apiClient.get<CalendarEvent[]>('/calendar/upcoming', {
        params: { limit },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch latest posts
 */
export function useLatestPosts() {
  return useQuery({
    queryKey: homeKeys.latestPosts(),
    queryFn: async () => {
      const data = await apiClient.get<Post[]>('/posts/latest');
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes (matches backend cache)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}