// features/home/components/TodayWidget.tsx
'use client';

import { useTodayEvents } from '../api';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

export function TodayWidget() {
  const { data: events, isLoading, error } = useTodayEvents();
  
  if (isLoading) {
    return (
      <div className="bg-blue-50 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-blue-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-blue-200 rounded w-full"></div>
          <div className="h-4 bg-blue-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 text-sm">Nie udało się załadować wydarzeń</p>
      </div>
    );
  }

  const getDayName = () => {
    const days = ['NIEDZIELA', 'PONIEDZIAŁEK', 'WTOREK', 'ŚRODA', 'CZWARTEK', 'PIĄTEK', 'SOBOTA'];
    return days[new Date().getDay()];
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-300 pb-3 mb-4">
        <h2 className="text-gray-600 text-sm font-medium text-center">
          Dzisiaj w Moście
        </h2>
      </div>

      {/* Day Name */}
      <div className="text-center mb-6">
        <h3 className="text-green-600 font-bold text-xl tracking-wide">
          {getDayName()}
        </h3>
      </div>

      {/* Events List */}
      {!events || events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Brak wydarzeń na dziś</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {events.map((event,i) => (
            <div key={i} className="flex items-start gap-3">
              {/* Time */}
              <span className="text-blue-600 font-semibold text-sm min-w-[3rem]">
                {format(new Date(event.start), 'HH:mm')}
              </span>
              
              {/* Event Title */}
              <span className="text-blue-600 text-sm flex-1">
                {event.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Calendar Link */}
      <div className="flex justify-center">
        <Link
          href="/calendar"
          className="inline-block px-6 py-2 border-2 border-green-600 text-green-600 font-medium text-sm rounded hover:bg-green-600 hover:text-white transition-colors"
        >
          PRZEJDŹ DO KALENDARZA
        </Link>
      </div>
    </div>
  );
}