"use client";

import { useCalendar } from "@/features/calendar/hooks/useCalendar";
import { DayCard } from "@/features/calendar/components/DayCard";
import { WeeklySchedule } from "@/features/calendar/components/WeeklySchedule";
import { Loader2 } from "lucide-react";
import { CalendarHero } from "./CalendarHero";

export function CalendarView() {
  // Używamy naszego Mózgu (Hooka)
  const { dayGroups, loading, error } = useCalendar();
  console.log("CalendarView", dayGroups, loading, error);
  
  return (
    <main className="min-h-screen bg-[#f4f6f8] pb-20">
      {/* 1. Header (może być osobnym komponentem CalendarHero) */}
      <CalendarHero />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* 2. Obsługa stanów */}
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

        {/* 3. Wyświetlanie listy */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {dayGroups.map((group, idx) => (
              <DayCard key={idx} group={group} />
            ))}
          </div>
        )}

        {/* 4. Sekcja statyczna */}
        <WeeklySchedule />
      </div>
    </main>
  );
}
