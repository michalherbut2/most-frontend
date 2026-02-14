// features/calendar/api/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api-client';
import { CalendarEvent } from '../types/calendar';

// export interface CalendarEvent {
//   id: number;
//   title: string;
//   startDateTime: string;
//   // ...
// }

// Query keys
export const calendarKeys = {
  all: ['calendar'] as const,
  lists: () => [...calendarKeys.all, 'list'] as const,
  list: (filters?: object) => [...calendarKeys.lists(), filters] as const,
  details: () => [...calendarKeys.all, 'detail'] as const,
  detail: (id: number) => [...calendarKeys.details(), id] as const,
  today: () => [...calendarKeys.all, 'today'] as const,
  upcoming: (limit: number) => [...calendarKeys.all, 'upcoming', limit] as const,
};

// Queries
export function useCalendarEvents() {
  return useQuery({
    queryKey: calendarKeys.lists(),
    queryFn: () => apiClient.get<CalendarEvent[]>('/calendar'),
  });
}

export function useCalendarEvent(id: number) {
  return useQuery({
    queryKey: calendarKeys.detail(id),
    queryFn: () => apiClient.get<CalendarEvent>(`/calendar/${id}`),
    enabled: !!id,
  });
}

export function useTodayEvents() {
  return useQuery({
    queryKey: calendarKeys.today(),
    queryFn: () => apiClient.get<CalendarEvent[]>('/calendar/today'),
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations
export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<CalendarEvent, 'id'>) => 
      apiClient.post<CalendarEvent>('/calendar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CalendarEvent> }) =>
      apiClient.put<CalendarEvent>(`/calendar/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/calendar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() });
    },
  });
}