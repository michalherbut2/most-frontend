"use client";

import React from "react";
import { Clock, Star, Trash2, Pencil } from "lucide-react";

interface DutyCardHeaderProps {
    title: string;
    time: string;
    pointsValue: number;
    isAdmin: boolean;
    onDeleteClick: () => void;
    onEditClick: () => void;
}

export default function DutyCardHeader({
    title,
    time,
    pointsValue,
    isAdmin,
    onDeleteClick,
    onEditClick,
}: DutyCardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-2 md:gap-3">
            {/* Left: title + time */}
            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-lg leading-tight truncate">
                    {title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs md:text-sm">{time.slice(0, 5)}</span>
                </div>
            </div>

            {/* Right: admin actions + badge */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {isAdmin && (
                    <>
                        <button
                            onClick={onEditClick}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl
                                       hover:bg-blue-50 active:bg-blue-100 transition-colors group"
                            title="Edytuj slot"
                            aria-label="Edytuj slot"
                        >
                            <Pencil className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <button
                            onClick={onDeleteClick}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl
                                       hover:bg-red-50 active:bg-red-100 transition-colors group"
                            title="Usuń slot"
                            aria-label="Usuń slot"
                        >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                    </>
                )}
                {pointsValue > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2.5 py-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs font-semibold text-yellow-700">
                            +{pointsValue}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
