'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { PointsSummary } from '@/features/profile/components/PointsSummary';
import { RecentActivity } from '@/features/profile/components/RecentActivity';
import { Settings, Edit } from 'lucide-react';
import { LeaderboardWidget } from '@/features/points/components/LeaderboadrdWidget';
import { AwardPointsWidget } from '@/features/points/components/AwardPointsWidget';

// Mock data - replace with actual API calls using React Query
const mockActivities = [
  {
    id: '1',
    type: 'event' as const,
    title: 'Attended Weekly Meeting',
    points: 50,
    timestamp: '2026-02-10T14:30:00Z',
  },
  {
    id: '2',
    type: 'song' as const,
    title: 'Added "Bohemian Rhapsody"',
    points: 25,
    timestamp: '2026-02-08T10:15:00Z',
  },
  {
    id: '3',
    type: 'badge' as const,
    title: 'Earned "Early Bird" Badge',
    points: 100,
    timestamp: '2026-02-05T09:00:00Z',
  },
  {
    id: '4',
    type: 'comment' as const,
    title: 'Commented on Event',
    points: 10,
    timestamp: '2026-02-03T16:45:00Z',
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("is aith", isAuthenticated);
    
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#2573a6]" />
          <p className="mt-4 text-sm text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your account and view your activity
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-smooth hover:bg-slate-50">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-smooth hover:bg-slate-50">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader user={user} />

      <LeaderboardWidget />
      <AwardPointsWidget />

      {/* Points Summary */}
      <PointsSummary
        totalPoints={user.points}
        monthlyPoints={185}
        rank={12}
        badges={5}
      />

      {/* Recent Activity */}
      <RecentActivity activities={mockActivities} />

      {/* Quick Actions */}
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => router.push('/calendar')}
            className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-smooth hover:border-[#2573a6] hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">View Calendar</h3>
            <p className="mt-1 text-sm text-slate-600">Check upcoming events</p>
          </button>
          <button
            onClick={() => router.push('/songs')}
            className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-smooth hover:border-[#2573a6] hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Browse Songs</h3>
            <p className="mt-1 text-sm text-slate-600">Explore the music library</p>
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-smooth hover:border-[#2573a6] hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">View Leaderboard</h3>
            <p className="mt-1 text-sm text-slate-600">See how you rank</p>
          </button>
        </div>
      </div>
    </div>
  );
}