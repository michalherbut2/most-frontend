"use client";

import React, { useMemo, useState } from "react";
import {
    ServiceSlot,
    useServiceSlots,
    useGenerateLiturgyWeek,
} from "@/features/scheduler/api/queries";
import ServiceSlotCard from "@/features/scheduler/components/ServiceSlotCard";
import { useUserRole } from "@/shared/lib/hooks/useUserRole";
import {
    ChevronLeft,
    ChevronRight,
    Loader,
    AlertTriangle,
    BookOpen,
    Wand2,
} from "lucide-react";

const DAY_LABELS = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"];
const DAY_LABELS_FULL = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatISO(date: Date): string {
    return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export default function LiturgySchedulerPage() {
    const [weekOffset, setWeekOffset] = useState(0);
    const { isAdmin } = useUserRole();
    const generateMutation = useGenerateLiturgyWeek();

    const monday = useMemo(() => {
        const today = new Date();
        const mon = getMonday(today);
        return addDays(mon, weekOffset * 7);
    }, [weekOffset]);

    const sunday = useMemo(() => addDays(monday, 6), [monday]);

    const { data: slots, isLoading, isError, refetch } = useServiceSlots(
        "LITURGY",
        formatISO(monday),
        formatISO(sunday)
    );

    // Grupuj sloty wg dnia tygodnia (0=Pn ... 6=Ndz)
    const slotsByDay = useMemo(() => {
        const grouped: Record<number, ServiceSlot[]> = {};
        for (let i = 0; i < 7; i++) grouped[i] = [];

        slots?.forEach((slot: ServiceSlot) => {
            const d = new Date(slot.date);
            const dayIdx = (d.getDay() + 6) % 7; // Pn=0, Nd=6
            grouped[dayIdx]?.push(slot);
        });

        return grouped;
    }, [slots]);

    const weekLabel = `${monday.toLocaleDateString("pl-PL", { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })}`;

    const handleGenerate = () => {
        generateMutation.mutate(formatISO(monday));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    Grafik Liturgii
                </h1>
                <p className="text-gray-500 mt-1 ml-[52px]">
                    Zapisz się na czytania i psalmy
                </p>
            </div>

            {/* Admin Toolbar */}
            {isAdmin && (
                <div className="mb-6 flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                        <Wand2 className="w-4 h-4" />
                        <span>Panel admina</span>
                    </div>
                    <div className="h-5 w-px bg-purple-200" />
                    <button
                        onClick={handleGenerate}
                        disabled={generateMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {generateMutation.isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Wand2 className="w-4 h-4" />
                        )}
                        Generuj Sloty (Ten Tydzień)
                    </button>
                </div>
            )}

            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setWeekOffset((o) => o - 1)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <span className="text-sm font-semibold text-gray-800">{weekLabel}</span>
                    {weekOffset !== 0 && (
                        <button
                            onClick={() => setWeekOffset(0)}
                            className="ml-3 text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Bieżący tydzień
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setWeekOffset((o) => o + 1)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-16">
                    <Loader className="w-8 h-8 animate-spin text-purple-500" />
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

            {/* Week Grid */}
            {!isLoading && !isError && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const dayDate = addDays(monday, dayIdx);
                        const daySlots = slotsByDay[dayIdx] ?? [];
                        const isToday = formatISO(dayDate) === formatISO(new Date());
                        const isPast = dayDate < new Date() && !isToday;

                        return (
                            <div
                                key={dayIdx}
                                className={`rounded-xl border p-3 min-h-[180px] transition-colors ${isToday
                                        ? "border-purple-300 bg-purple-50/50"
                                        : isPast
                                            ? "border-gray-100 bg-gray-50/50 opacity-60"
                                            : "border-gray-200 bg-white"
                                    }`}
                            >
                                {/* Day Header */}
                                <div className="text-center mb-3">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">
                                        {DAY_LABELS[dayIdx]}
                                    </span>
                                    <p className={`text-lg font-bold ${isToday ? "text-purple-700" : "text-gray-800"}`}>
                                        {dayDate.getDate()}
                                    </p>
                                </div>

                                {/* Day Slots */}
                                <div className="space-y-2">
                                    {daySlots.length === 0 ? (
                                        <p className="text-[10px] text-gray-400 text-center mt-4">
                                            {dayIdx === 5 ? "Brak mszy" : "Brak slotów"}
                                        </p>
                                    ) : (
                                        daySlots.map((slot: ServiceSlot) => (
                                            <ServiceSlotCard key={slot.id} slot={slot} isAdmin={isAdmin} />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && slots?.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl mt-4">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Brak harmonogramu</h3>
                    <p className="text-sm text-gray-500">
                        Na ten tydzień nie wygenerowano jeszcze grafiku liturgii.
                    </p>
                </div>
            )}
        </div>
    );
}
