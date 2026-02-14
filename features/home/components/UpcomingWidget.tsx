// features/home/components/UpcomingWidget.tsx
'use client';

import { useTodayEvents } from '../api';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

export function UpcomingWidget() {
  const { data: events, isLoading, error } = useTodayEvents();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !events || events.length === 0) {
    return null; // Don't show widget if no upcoming events
  }

  // Get the first upcoming event to feature
  const featuredEvent = events[0];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-300 p-4">
        <h2 className="text-gray-700 font-semibold text-lg text-center">
          Zbliżają się
        </h2>
      </div>

      {/* Featured Event Card */}
      <div className="relative">
        {/* Background Image - Using placeholder, replace with actual event image if available */}
        <div 
          className="h-48 bg-gradient-to-br from-pink-300 via-pink-200 to-purple-200 flex items-center justify-center relative"
          style={{
            backgroundImage: featuredEvent.imageUrl 
              ? `url(${featuredEvent.imageUrl})` 
              : 'linear-gradient(135deg, #fbbf77 0%, #f7a7b7 50%, #c9a7eb 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Event Title */}
          <div className="relative z-10 text-center px-6">
            <h3 className="text-white font-bold text-2xl drop-shadow-lg italic font-serif">
              {featuredEvent.title}
            </h3>
          </div>

          {/* Date Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded shadow-lg">
            <p className="text-gray-800 font-medium text-sm">
              Start:
            </p>
            <p className="text-gray-900 font-bold">
              {/* {format(new Date(featuredEvent.start), 'dd.MM.yyyy - godz. HH:mm', { locale: pl })} */}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-4 flex justify-center">
        <Link
          href="/calendar"
          className="inline-block px-8 py-2 border-2 border-green-600 text-green-600 font-medium text-sm rounded hover:bg-green-600 hover:text-white transition-colors"
        >
          CZYTAJ WIĘCEJ
        </Link>
      </div>
    </div>
  );
}