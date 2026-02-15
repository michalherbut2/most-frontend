"use client";

import React, { useMemo, useState } from "react";
import {
    DutySlot,
    useDutySlots,
    useGenerateSundayKitchen,
} from "@/features/duties/api/queries";
import DutySlotCard from "@/features/duties/components/DutySlotCard";
import CreateDutySlotDialog from "@/features/duties/components/CreateDutySlotDialog";
import { useUserRole } from "@/shared/lib/hooks/useUserRole";
import {
    Loader,
    AlertTriangle,
    ChefHat,
    CalendarDays,
    Wand2,
    Plus,
} from "lucide-react";

function formatISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function calculateNextSunday(from: Date): Date {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0=Nd, 1=Pn, ...
    // Jeśli dziś niedziela -> następna niedziela (za 7 dni)
    // W przeciwnym razie -> najbliższa niedziela
    const daysUntilSunday = day === 0 ? 7 : 7 - day;
    d.setDate(d.getDate() + daysUntilSunday);
    return d;
}

export default function CommunitySchedulerPage() {
    const { isAdmin } = useUserRole();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const generateMutation = useGenerateSundayKitchen();

    // Pobierz sloty kuchenne na najbliższe 4 tygodnie
    const dateFrom = useMemo(() => formatISO(new Date()), []);
    const dateTo = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 28);
        return formatISO(d);
    }, []);

    const { data: slots, isLoading, isError, refetch } = useDutySlots(
        "KITCHEN",
        dateFrom,
        dateTo
    );

    // Grupuj sloty wg daty
    const grouped = useMemo(() => {
        if (!slots) return {};
        const map: Record<string, DutySlot[]> = {};
        slots.forEach((slot: DutySlot) => {
            if (!map[slot.date]) map[slot.date] = [];
            map[slot.date].push(slot);
        });
        return map;
    }, [slots]);

    const sortedDates = Object.keys(grouped).sort();

    const handleGenerate = () => {
        const nextSunday = calculateNextSunday(new Date());
        generateMutation.mutate(formatISO(nextSunday));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
                        <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    Grafik Wspólnotowy
                </h1>
                <p className="text-gray-500 mt-1 ml-[52px]">
                    Zapisy na niedzielne gotowanie i wolontariat
                </p>
            </div>

            {/* Admin Toolbar */}
            {isAdmin && (
                <div className="mb-6 flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
                        <Wand2 className="w-4 h-4" />
                        <span>Panel admina</span>
                    </div>
                    <div className="h-5 w-px bg-orange-200" />
                    <button
                        onClick={handleGenerate}
                        disabled={generateMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {generateMutation.isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Wand2 className="w-4 h-4" />
                        )}
                        Generuj Niedzielę (Najbliższą)
                    </button>
                    <button
                        onClick={() => setShowCreateDialog(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Dodaj Slot
                    </button>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-16">
                    <Loader className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-800 mb-1">Nie udało się pobrać harmonogramu</h3>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg px-4 py-2 hover:bg-red-200 transition-colors"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            )}

            {/* Events List */}
            {!isLoading && !isError && sortedDates.length > 0 && (
                <div className="space-y-6">
                    {sortedDates.map((dateStr) => {
                        const dateObj = new Date(dateStr + "T00:00:00");
                        const label = dateObj.toLocaleDateString("pl-PL", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        return (
                            <div key={dateStr}>
                                <div className="flex items-center gap-2 mb-3">
                                    <CalendarDays className="w-4 h-4 text-orange-500" />
                                    <h2 className="text-sm font-semibold text-gray-700 capitalize">
                                        {label}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {grouped[dateStr].map((slot: DutySlot) => (
                                        <DutySlotCard key={slot.id} slot={slot} isAdmin={isAdmin} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && slots?.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
                    <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Brak nadchodzących wydarzeń</h3>
                    <p className="text-sm text-gray-500">
                        Nie ma jeszcze zaplanowanych służb kuchennych.
                    </p>
                </div>
            )}

            {/* Create Slot Dialog */}
            {showCreateDialog && (
                <CreateDutySlotDialog
                    defaultCategory="KITCHEN"
                    onClose={() => setShowCreateDialog(false)}
                />
            )}
        </div>
    );
}
