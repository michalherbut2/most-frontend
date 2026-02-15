"use client";

import React, { useState } from "react";
import {
    UserPlus,
    UserMinus,
    Users,
    Loader,
    Star,
    Eye,
    EyeOff,
    X,
    Trash2,
    AlertTriangle,
    Clock,
} from "lucide-react";
import {
    DutySlot,
    useSignUp,
    useCancelSignUp,
    useDeleteDutySlot,
} from "@/features/duties/api/queries";

// ─── Props ───────────────────────────────────────────────────────────────────

interface DutyCardActionsProps {
    slot: DutySlot;
    isPast: boolean;
    showDeleteConfirm: boolean;
    onShowDeleteConfirm: (show: boolean) => void;
}

export default function DutyCardActions({
    slot,
    isPast,
    showDeleteConfirm,
    onShowDeleteConfirm,
}: DutyCardActionsProps) {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const cancelMutation = useCancelSignUp();
    const deleteMutation = useDeleteDutySlot();

    return (
        <>
            {/* Action Button */}
            {isPast ? (
                <div
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 md:py-2
                                text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200
                                rounded-xl md:rounded-lg cursor-not-allowed"
                >
                    <Clock className="w-4 h-4" />
                    Wydarzenie minęło
                </div>
            ) : slot.currentUserSignedUp ? (
                <button
                    onClick={() => cancelMutation.mutate(slot.id)}
                    disabled={cancelMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 md:py-2
                               text-sm font-medium text-red-700 bg-red-50 border border-red-200
                               rounded-xl md:rounded-lg hover:bg-red-100 active:bg-red-200
                               transition-colors disabled:opacity-50"
                >
                    {cancelMutation.isPending ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <UserMinus className="w-4 h-4" />
                    )}
                    Wypisz się
                </button>
            ) : slot.approvedCount >= slot.capacity ? (
                <div
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 md:py-2
                                text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200
                                rounded-xl md:rounded-lg cursor-not-allowed"
                >
                    <Users className="w-4 h-4" />
                    Brak wolnych miejsc
                </div>
            ) : (
                <button
                    onClick={() => setShowSignUpModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 md:py-2
                               text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200
                               rounded-xl md:rounded-lg hover:bg-purple-100 active:bg-purple-200
                               transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Zgłoś się
                </button>
            )}

            {/* Sign-Up Modal */}
            {showSignUpModal && (
                <SignUpModal
                    slot={slot}
                    onClose={() => setShowSignUpModal(false)}
                />
            )}

            {/* Delete Confirm Dialog */}
            {showDeleteConfirm && (
                <DeleteConfirmDialog
                    slot={slot}
                    isPending={deleteMutation.isPending}
                    onConfirm={() => {
                        deleteMutation.mutate(slot.id, {
                            onSuccess: () => onShowDeleteConfirm(false),
                        });
                    }}
                    onCancel={() => onShowDeleteConfirm(false)}
                />
            )}
        </>
    );
}

// ─── Sign-Up Modal ───────────────────────────────────────────────────────────

function SignUpModal({
    slot,
    onClose,
}: {
    slot: DutySlot;
    onClose: () => void;
}) {
    const [isAnonymous, setIsAnonymous] = useState(false);
    const signUpMutation = useSignUp();

    const handleSubmit = () => {
        signUpMutation.mutate(
            { slotId: slot.id, anonymous: isAnonymous },
            { onSuccess: () => onClose() }
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm sm:mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Zgłoś się
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">
                            {slot.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(slot.date).toLocaleDateString("pl-PL", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}
                            {" · "}
                            {slot.time.slice(0, 5)}
                        </p>
                    </div>

                    {slot.pointsValue > 0 && (
                        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-800">
                                +{slot.pointsValue}{" "}
                                {slot.pointsValue === 1
                                    ? "punkt"
                                    : "punktów"}{" "}
                                do zdobycia
                            </span>
                        </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer select-none min-h-[44px]">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500 w-5 h-5"
                        />
                        <div className="flex items-center gap-1.5">
                            {isAnonymous ? (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                                <Eye className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-700">
                                Zapisz się anonimowo
                            </span>
                        </div>
                    </label>

                    {slot.isAutoApproved && (
                        <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                            ✅ To zgłoszenie zostanie automatycznie zatwierdzone
                            (jeśli są wolne miejsca).
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-5 pt-0">
                    <button
                        onClick={onClose}
                        disabled={signUpMutation.isPending}
                        className="flex-1 px-4 py-3 md:py-2 text-sm font-medium text-gray-700 bg-gray-100
                                   rounded-xl md:rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={signUpMutation.isPending}
                        className="flex-1 px-4 py-3 md:py-2 text-sm font-medium text-white bg-purple-600
                                   rounded-xl md:rounded-lg hover:bg-purple-700 transition-colors
                                   disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {signUpMutation.isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <UserPlus className="w-4 h-4" />
                        )}
                        Zgłoś się
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Confirm Dialog ───────────────────────────────────────────────────

function DeleteConfirmDialog({
    slot,
    isPending,
    onConfirm,
    onCancel,
}: {
    slot: DutySlot;
    isPending: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm sm:mx-4">
                <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Usunąć ten slot?
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                                <span className="font-medium">
                                    {slot.title}
                                </span>
                                {" · "}
                                {slot.time.slice(0, 5)}
                            </p>
                        </div>
                    </div>
                    {slot.volunteers.length > 0 && (
                        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                            ⚠️ Zapisani wolontariusze (
                            {slot.volunteers.length}) zostaną automatycznie
                            wypisani.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3 p-5 pt-0">
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="flex-1 px-4 py-3 md:py-2 text-sm font-medium text-gray-700 bg-gray-100
                                   rounded-xl md:rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 px-4 py-3 md:py-2 text-sm font-medium text-white bg-red-600
                                   rounded-xl md:rounded-lg hover:bg-red-700 transition-colors
                                   disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        Usuń
                    </button>
                </div>
            </div>
        </div>
    );
}
