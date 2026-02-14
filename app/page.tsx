// app/page.tsx
'use client';

import { TodayWidget } from '@/features/home/components/TodayWidget';
import { NewsWidget } from '@/features/home/components/NewsWidget';
import { UpcomingWidget } from '@/features/home/components/UpcomingWidget';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Link from 'next/link';
import { Calendar, Users, MessageSquare, Bell } from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Message (for authenticated users) */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-2">
              Cześć, {user.firstName || user.email.split('@')[0]}! 👋
            </h1>
            <p className="text-blue-100">
              Witaj z powrotem w MOST. Sprawdź, co dzieje się dzisiaj!
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/profile"
                className="px-4 py-2 bg-white text-blue-600 rounded font-medium text-sm hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Mój Panel
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-blue-700 text-white rounded font-medium text-sm hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Panel Admina
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <TodayWidget />
            <UpcomingWidget />
          </div>

          {/* Right Column */}
          <div>
            <NewsWidget />
          </div>
        </div>

      </main>

    </div>
  );
}