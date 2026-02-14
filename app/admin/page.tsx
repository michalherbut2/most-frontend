'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUserRole } from '@/shared/lib/hooks/useUserRole';
import {
  Shield,
  Users,
  Calendar,
  Music,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Users',
    value: '1,234',
    change: '+12.5%',
    icon: Users,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    label: 'Active Events',
    value: '56',
    change: '+8.2%',
    icon: Calendar,
    color: 'text-green-600 bg-green-50',
  },
  {
    label: 'Songs Library',
    value: '892',
    change: '+23.1%',
    icon: Music,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    label: 'Engagement Rate',
    value: '87%',
    change: '+5.3%',
    icon: TrendingUp,
    color: 'text-orange-600 bg-orange-50',
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = useUserRole();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      console.log('not admin');
      console.log("isAuthenticated", isAuthenticated);
      console.log("isAdmin", isAdmin);
      console.log("isLoading", isLoading);
      
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />
          <p className="mt-4 text-sm text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If not admin, don't render (will redirect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-purple-100 p-3">
          <Shield className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">
            Manage users, content, and platform settings
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2.5 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-smooth hover:border-purple-300 hover:bg-purple-50">
            <Users className="h-5 w-5 text-purple-600" />
            <h3 className="mt-2 font-medium text-slate-900">Manage Users</h3>
            <p className="text-sm text-slate-600">View and edit user accounts</p>
          </button>
          <button className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-smooth hover:border-blue-300 hover:bg-blue-50">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="mt-2 font-medium text-slate-900">Manage Events</h3>
            <p className="text-sm text-slate-600">Create and edit calendar events</p>
          </button>
          <button className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-smooth hover:border-green-300 hover:bg-green-50">
            <Music className="h-5 w-5 text-green-600" />
            <h3 className="mt-2 font-medium text-slate-900">Manage Songs</h3>
            <p className="text-sm text-slate-600">Review and moderate song library</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Admin Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Sample admin action #{i}
                  </p>
                  <p className="text-xs text-slate-600">2 hours ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}