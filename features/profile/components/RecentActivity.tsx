'use client';

import { Calendar, Music, MessageSquare, Trophy } from 'lucide-react';
import { formatDate } from '@/shared/lib/utils';

interface Activity {
  id: string;
  type: 'event' | 'song' | 'comment' | 'badge';
  title: string;
  points: number;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityConfig = {
  event: {
    icon: Calendar,
    color: 'text-blue-600 bg-blue-50',
    label: 'Event',
  },
  song: {
    icon: Music,
    color: 'text-purple-600 bg-purple-50',
    label: 'Song',
  },
  comment: {
    icon: MessageSquare,
    color: 'text-green-600 bg-green-50',
    label: 'Comment',
  },
  badge: {
    icon: Trophy,
    color: 'text-orange-600 bg-orange-50',
    label: 'Badge',
  },
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h2>
        <p className="text-center text-sm text-slate-500 py-8">
          No recent activity. Start earning points by participating in events!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 transition-smooth hover:border-slate-300"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${config.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{activity.title}</p>
                  <p className="text-sm text-slate-600">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                <Trophy className="h-3.5 w-3.5" />
                <span>+{activity.points}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}