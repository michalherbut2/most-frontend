"use client";

import React, { useState } from "react";
import {
    Intention,
    IntentionType,
    usePendingIntentions,
    useReviewIntention,
} from "@/features/intentions/api/queries";
import {
    CheckCircle,
    XCircle,
    Inbox,
    Loader,
    AlertTriangle,
    RefreshCw,
    Calendar,
    User,
    FileText,
    X,
} from "lucide-react";

// ─── Rejection Modal ────────────────────────────────────────────────────────

interface RejectModalProps {
    intention: Intention;
    onClose: () => void;
    onConfirm: (adminResponse: string) => void;
    isPending: boolean;
}

function RejectModal({ intention, onClose, onConfirm, isPending }: RejectModalProps) {
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Odrzuć intencję</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                        <p className="font-medium text-gray-500 text-xs uppercase mb-1">Treść intencji:</p>
                        <p className="line-clamp-3">{intention.content}</p>
                    </div>

                    <div>
                        <label
                            htmlFor="reject-reason"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Powód odrzucenia <span className="text-gray-400">(opcjonalny)</span>
                        </label>
                        <textarea
                            id="reject-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            placeholder="Np. Proszę o uzupełnienie treści..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 pb-5">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <XCircle className="w-4 h-4" />
                        )}
                        Odrzuć
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Type Badge ─────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: IntentionType }) {
    if (type === IntentionType.BOX_INTENTION) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                <Inbox className="w-3 h-3" />
                Skrzynka
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            <Calendar className="w-3 h-3" />
            Msza
        </span>
    );
}

// ─── Skeleton Loader ────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-5 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
            <td className="px-5 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
            <td className="px-5 py-4"><div className="h-4 w-48 bg-gray-200 rounded" /></td>
            <td className="px-5 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
            <td className="px-5 py-4">
                <div className="flex gap-2">
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                    <div className="h-8 w-20 bg-gray-200 rounded-lg" />
                </div>
            </td>
        </tr>
    );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

export default function AdminIntentionsDashboard() {
    const { data: intentions, isLoading, isError, refetch } = usePendingIntentions();
    const reviewMutation = useReviewIntention();
    const [rejectTarget, setRejectTarget] = useState<Intention | null>(null);

    // --- Approve ---
    const handleApprove = (id: string) => {
        reviewMutation.mutate({ id, isApproved: true });
    };

    // --- Reject (via modal) ---
    const handleRejectConfirm = (adminResponse: string) => {
        if (!rejectTarget) return;
        reviewMutation.mutate(
            { id: rejectTarget.id, isApproved: false, adminResponse },
            { onSettled: () => setRejectTarget(null) }
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    Panel Intencji
                </h1>
                <p className="text-gray-500 mt-1 ml-[52px]">
                    Zarządzaj oczekującymi intencjami Wspólnoty
                </p>
            </div>

            {/* Stats bar */}
            {!isLoading && !isError && intentions && (
                <div className="mb-6 flex items-center gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        <span className="text-sm font-medium text-yellow-800">
                            {intentions.length} {intentions.length === 1 ? "intencja oczekuje" : "intencji oczekuje"}
                        </span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Odśwież listę"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* ─── Error State ───────────────────────────────────── */}
            {isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-800 mb-1">
                        Nie udało się pobrać intencji
                    </h3>
                    <p className="text-sm text-red-600 mb-4">
                        Sprawdź połączenie z serwerem i spróbuj ponownie.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Spróbuj ponownie
                    </button>
                </div>
            )}

            {/* ─── Empty State ───────────────────────────────────── */}
            {!isLoading && !isError && intentions?.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Wszystko przetworzone! 🎉
                    </h3>
                    <p className="text-sm text-gray-500">
                        Brak oczekujących intencji do rozpatrzenia.
                    </p>
                </div>
            )}

            {/* ─── Table ─────────────────────────────────────────── */}
            {(isLoading || (intentions && intentions.length > 0)) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Typ
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Treść
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Autor
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Akcje
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* Loading Skeletons */}
                                {isLoading && (
                                    <>
                                        <SkeletonRow />
                                        <SkeletonRow />
                                        <SkeletonRow />
                                        <SkeletonRow />
                                    </>
                                )}

                                {/* Data Rows */}
                                {intentions?.map((intention) => (
                                    <tr
                                        key={intention.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(intention.targetDate).toLocaleDateString("pl-PL", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <TypeBadge type={intention.type} />
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-800 max-w-xs">
                                            <p className="line-clamp-2">{intention.content}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                                {intention.authorName ?? "—"}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(intention.id)}
                                                    disabled={reviewMutation.isPending}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Zatwierdź
                                                </button>
                                                <button
                                                    onClick={() => setRejectTarget(intention)}
                                                    disabled={reviewMutation.isPending}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Odrzuć
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ─── Reject Modal ──────────────────────────────────── */}
            {rejectTarget && (
                <RejectModal
                    intention={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                    onConfirm={handleRejectConfirm}
                    isPending={reviewMutation.isPending}
                />
            )}
        </div>
    );
}
