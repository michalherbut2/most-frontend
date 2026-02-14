'use client';

import { Trophy, TrendingUp, Award, Zap } from 'lucide-react';
import { formatPoints } from '@/shared/lib/utils';

interface PointsSummaryProps {
  totalPoints: number;
  monthlyPoints?: number;
  rank?: number;
  badges?: number;
}

export function PointsSummary({
  totalPoints,
  monthlyPoints = 0,
  rank,
  badges = 0,
}: PointsSummaryProps) {
  const stats = [
    {
      label: 'Total Points',
      value: formatPoints(totalPoints),
      icon: Trophy,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'This Month',
      value: `+${formatPoints(monthlyPoints)}`,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Rank',
      value: rank ? `#${rank}` : 'N/A',
      icon: Zap,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Badges',
      value: badges.toString(),
      icon: Award,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Points Summary</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}