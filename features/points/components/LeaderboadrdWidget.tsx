'use client';

import { useLeaderboard } from '../api';
import { Medal, User } from 'lucide-react';
import { clsx } from 'clsx';

export function LeaderboardWidget() {
  const { data: leaders, isLoading } = useLeaderboard();

  if (isLoading) return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;

  // Top 3 mają specjalne kolory
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500 bg-yellow-100 ring-yellow-200'; // Złoto
      case 1: return 'text-gray-400 bg-gray-100 ring-gray-200';       // Srebro
      case 2: return 'text-orange-500 bg-orange-100 ring-orange-200'; // Brąz
      default: return 'text-blue-500 bg-blue-50 ring-blue-100';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
          <Medal className="w-5 h-5 text-yellow-500" />
          Ranking MOSTu
        </h3>
        <span className="text-xs text-slate-400 font-medium">Top 5</span>
      </div>

      <div className="space-y-4">
        {leaders?.slice(0, 5).map((entry, index) => (
          <div key={index} className="flex items-center gap-4 group">
            
            {/* Pozycja / Medal */}
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-opacity-30 transition-all group-hover:scale-110",
              getMedalColor(index)
            )}>
              {index + 1}
            </div>

            {/* Avatar + Nazwa */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                 {/* Tu mógłby być Avatar z URL, na razie placeholder */}
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={14} />
                 </div>
                 <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                   {entry.firstName} {entry.lastName}
                 </p>
              </div>
            </div>

            {/* Punkty */}
            <div className="text-right">
              <span className="font-bold text-slate-900 dark:text-white">
                {entry.points}
              </span>
              <span className="text-xs text-slate-400 ml-1">pkt</span>
            </div>
          </div>
        ))}

        {!leaders?.length && (
           <p className="text-center text-gray-400 text-sm py-4">Brak danych</p>
        )}
      </div>
    </div>
  );
}