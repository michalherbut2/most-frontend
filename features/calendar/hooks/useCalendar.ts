import { useState, useEffect } from 'react';
import { calendarService } from '@/features/calendar/services/calendarService';
import { CalendarEvent, DayGroup } from '@/features/calendar/types/calendar';

export function useCalendar() {
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await calendarService.getEvents();
      const grouped = groupEventsByDate(data); // Logika grupowania (przeniesiona tutaj)
      setDayGroups(grouped);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA GRUPOWANIA (Klucz do sukcesu) ---
  const groupEventsByDate = (events: CalendarEvent[]): DayGroup[] => {
    const groups: Record<string, CalendarEvent[]> = {};

    events.forEach(event => {
      // Klucz to sama data bez godziny (YYYY-MM-DD)
      const dateKey = event.start.substring(0, 10);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    // Zamieniamy obiekt na tablicę i sortujemy
    const sortedKeys = Object.keys(groups).sort();
    const todayStr = new Date().toISOString().substring(0, 10);

    return sortedKeys.map(dateKey => {
      const dateObj = new Date(dateKey);
      return {
        dateObj: dateObj,
        // Ładny format nagłówka: "Wtorek, 12 maja"
        dateLabel: dateObj.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }),
        events: groups[dateKey], // Lista wydarzeń tego dnia
        isToday: dateKey === todayStr
      };
    });
  };

  return { dayGroups, loading, error, refresh: loadData };
}