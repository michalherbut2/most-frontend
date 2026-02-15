"use client";

import React from "react";

interface DutyProgressBarProps {
    current: number;
    max: number;
}

export default function DutyProgressBar({ current, max }: DutyProgressBarProps) {
    const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
    const isFull = current >= max;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs md:text-sm text-gray-500">Zajęte miejsca</span>
                <span
                    className={`text-xs md:text-sm font-semibold ${isFull ? "text-red-600" : "text-gray-700"
                        }`}
                >
                    {current}/{max}
                </span>
            </div>
            <div className="h-2 md:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isFull
                            ? "bg-red-500"
                            : pct >= 75
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
