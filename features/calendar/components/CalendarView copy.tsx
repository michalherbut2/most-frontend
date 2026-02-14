'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { DayCard } from './DayCard';

// --- TYPY ---
interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  start: string; // ISO String
  allDay: boolean;
}

// Typ pomocniczy do grupowania
interface DayGroup {
  dateObj: Date;
  dateLabel: string; // np. "Wtorek, 12.05"
  events: CalendarEvent[];
  isToday: boolean;
}

export function CalendarView() {
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    fetch('http://localhost:8080/api/calendar')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data: CalendarEvent[]) => {
        const grouped = groupEventsByDate(data);
        setDayGroups(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []); 

  

  return (
    <main className="min-h-screen bg-[#f4f6f8] pb-20 font-sans">
      
      {/* HEADER HERO */}
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center py-20 text-[#2573a6]">
            <Loader2 className="animate-spin mr-2" /> Ładowanie kalendarza...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="text-center py-20 text-red-500 bg-white rounded-xl shadow-sm">
            Nie udało się pobrać wydarzeń. Spróbuj odświeżyć stronę.
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && dayGroups.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm text-gray-500">
            Brak nadchodzących wydarzeń. Odpoczywamy! ☕
          </div>
        )}

        {/* --- GRID UKŁADU (Tu jest magia RWD) --- */}
        {/* Mobile: 1 kolumna | Tablet: 2 kolumny | Desktop: 3 kolumny */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          {dayGroups.map((group, groupIndex) => (
            <DayCard key={groupIndex} group={group}></DayCard>
            
          ))}
        </div>

      </div>

    </main>
  );
}
