import { CalendarEvent } from '@/features/calendar/types/calendar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const calendarService = {
  async getEvents(): Promise<CalendarEvent[]> {
    const res = await fetch(`${API_URL}/calendar`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  }
};