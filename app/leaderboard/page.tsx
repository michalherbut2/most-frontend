'use client';

import { Award, Calendar } from 'lucide-react';

export default function PointsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Award className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Kalendarz Punktów</h1>
            <p className="text-purple-100">
              Zarządzaj swoimi punktami i sprawdź historię transakcji
            </p>
          </div>
        </div>
      </div>

      {/* Content
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PointsCard />
        </div>
        <div className="lg:col-span-2">
          <PointsHistory />
        </div>
      </div> */}
    </div>
  );
}