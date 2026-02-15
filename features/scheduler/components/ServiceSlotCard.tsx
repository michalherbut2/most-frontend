"use client";

import React, { useState } from "react";
import {
    ServiceSlot,
    VolunteerInfo,
    useSignUp,
    useCancelSignUp,
    useConfirmPresence,
} from "@/features/scheduler/api/queries";
import {
    Clock,
    Users,
    Star,
    UserPlus,
    UserMinus,
    CheckCircle,
    Loader,
    Eye,
    EyeOff,
    X,
} from "lucide-react";

// ─── Sign-Up Modal ───────────────────────────────────────────────────────────

interface SignUpModalProps {
    slot: ServiceSlot;
    onClose: () => void;
}

function SignUpModal({ slot, onClose }: SignUpModalProps) {
    const [isAnonymous, setIsAnonymous] = useState(false);
    const signUpMutation = useSignUp();

    const handleSubmit = () => {
        signUpMutation.mutate(
            { slotId: slot.id, isAnonymous },
            { onSuccess: () => onClose() }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Zgłoś się</h3>
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
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">{slot.title}</p>
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
                                +{slot.pointsValue} {slot.pointsValue === 1 ? "punkt" : "punktów"} do zdobycia
                            </span>
                        </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
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
                            ✅ To zgłoszenie zostanie automatycznie zatwierdzone (jeśli są wolne miejsca).
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 pb-5">
                    <button
                        onClick={onClose}
                        disabled={signUpMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={signUpMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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

// ─── Progress Bar ────────────────────────────────────────────────────────────

function CapacityBar({ current, max }: { current: number; max: number }) {
    const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
    const isFull = current >= max;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Zajęte miejsca</span>
                <span className={`text-xs font-semibold ${isFull ? "text-red-600" : "text-gray-700"}`}>
                    {current}/{max}
                </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isFull ? "bg-red-500" : pct >= 75 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ─── Volunteer Chip ──────────────────────────────────────────────────────────

function VolunteerChip({
    volunteer,
    isAdmin,
}: {
    volunteer: VolunteerInfo;
    isAdmin: boolean;
}) {
    const confirmMutation = useConfirmPresence();

    return (
        <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
                {volunteer.profileImage ? (
                    <img
                        src={volunteer.profileImage}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-purple-700">
                            {volunteer.displayName.charAt(0)}
                        </span>
                    </div>
                )}
                <span className="text-xs text-gray-700 truncate">{volunteer.displayName}</span>
                {volunteer.status === "PENDING" && (
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                        Oczekuje
                    </span>
                )}
                {volunteer.wasPresent && (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                )}
            </div>

            {isAdmin && !volunteer.wasPresent && volunteer.status === "APPROVED" && (
                <button
                    onClick={() => confirmMutation.mutate(volunteer.id)}
                    disabled={confirmMutation.isPending}
                    className="text-[10px] font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md px-2 py-1 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                    ✅ Obecność
                </button>
            )}
        </div>
    );
}

// ─── Main Card ───────────────────────────────────────────────────────────────

interface ServiceSlotCardProps {
    slot: ServiceSlot;
    isAdmin?: boolean;
}

export default function ServiceSlotCard({ slot, isAdmin = false }: ServiceSlotCardProps) {
    const [showModal, setShowModal] = useState(false);
    const cancelMutation = useCancelSignUp();

    const approvedVolunteers = slot.volunteers.filter((v) => v.status === "APPROVED");

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Header */}
                <div className="p-4 pb-3">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{slot.title}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs">{slot.time.slice(0, 5)}</span>
                            </div>
                        </div>
                        {slot.pointsValue > 0 && (
                            <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs font-semibold text-yellow-700">
                                    +{slot.pointsValue}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Capacity Bar */}
                    <CapacityBar current={slot.approvedCount} max={slot.capacity} />
                </div>

                {/* Volunteers */}
                {slot.volunteers.length > 0 && (
                    <div className="px-4 pb-3 space-y-1.5">
                        {slot.volunteers.map((v) => (
                            <VolunteerChip key={v.id} volunteer={v} isAdmin={isAdmin} />
                        ))}
                    </div>
                )}

                {/* Action */}
                <div className="px-4 pb-4">
                    {slot.currentUserSignedUp ? (
                        <button
                            onClick={() => cancelMutation.mutate(slot.id)}
                            disabled={cancelMutation.isPending}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                            {cancelMutation.isPending ? (
                                <Loader className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <UserMinus className="w-3.5 h-3.5" />
                            )}
                            Wypisz się
                        </button>
                    ) : slot.approvedCount >= slot.capacity ? (
                        <div className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
                            <Users className="w-3.5 h-3.5" />
                            Brak wolnych miejsc
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Zgłoś się
                        </button>
                    )}
                </div>
            </div>

            {/* Sign-Up Modal */}
            {showModal && (
                <SignUpModal slot={slot} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
