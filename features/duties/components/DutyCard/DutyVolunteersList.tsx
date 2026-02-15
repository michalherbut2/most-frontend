"use client";

import React from "react";
import { CheckCircle, Loader, Check, Clock } from "lucide-react";
import { VolunteerInfo, useConfirmPresence, useApproveVolunteer } from "@/features/duties/api/queries";

interface DutyVolunteersListProps {
    volunteers: VolunteerInfo[];
    isAdmin: boolean;
    isPast: boolean;
}

export default function DutyVolunteersList({
    volunteers,
    isAdmin,
    isPast,
}: DutyVolunteersListProps) {
    if (volunteers.length === 0) return null;

    return (
        <div className="space-y-1.5 md:space-y-2">
            {volunteers.map((v) => (
                <VolunteerChip key={v.id} volunteer={v} isAdmin={isAdmin} isPast={isPast} />
            ))}
        </div>
    );
}

// ─── Volunteer Chip ──────────────────────────────────────────────────────────

function VolunteerChip({
    volunteer,
    isAdmin,
    isPast,
}: {
    volunteer: VolunteerInfo;
    isAdmin: boolean;
    isPast: boolean;
}) {
    const confirmMutation = useConfirmPresence();
    const approveMutation = useApproveVolunteer();

    // ─── Determine admin action for this volunteer ───────────────────────────
    // A) PENDING → show "Zatwierdź" button
    // B) APPROVED + !isPast → show "Zatwierdzony" badge
    // C) APPROVED + isPast + !wasPresent → show "Potwierdź obecność" button
    // D) wasPresent → show green checkmark

    const renderAdminAction = () => {
        if (!isAdmin) {
            // Non-admin user: just show their own PENDING status text
            if (volunteer.status === "PENDING") {
                return (
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
                        Oczekuje
                    </span>
                );
            }
            return null;
        }

        // Admin views:
        if (volunteer.wasPresent) {
            // Already confirmed — green check
            return (
                <span className="flex items-center gap-1 text-[10px] md:text-xs text-green-600 font-medium flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Obecny
                </span>
            );
        }

        if (volunteer.status === "PENDING") {
            // A) Approve button
            return (
                <button
                    onClick={() => approveMutation.mutate(volunteer.id)}
                    disabled={approveMutation.isPending}
                    className="min-h-[36px] text-[10px] md:text-xs font-medium text-green-700 bg-green-100
                               hover:bg-green-200 active:bg-green-300 rounded-lg px-2.5 py-1.5
                               transition-colors disabled:opacity-50 flex-shrink-0 flex items-center gap-1"
                >
                    {approveMutation.isPending ? (
                        <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                        <>
                            <Check className="w-3 h-3" />
                            Zatwierdź
                        </>
                    )}
                </button>
            );
        }

        if (volunteer.status === "APPROVED" && !isPast) {
            // B) Approved badge (before event)
            return (
                <span className="flex items-center gap-1 text-[10px] md:text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full font-medium flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    Zatwierdzony
                </span>
            );
        }

        if (volunteer.status === "APPROVED" && isPast) {
            // C) Confirm presence button (after event)
            return (
                <button
                    onClick={() => confirmMutation.mutate(volunteer.id)}
                    disabled={confirmMutation.isPending}
                    className="min-h-[36px] text-[10px] md:text-xs font-medium text-blue-700 bg-blue-100
                               hover:bg-blue-200 active:bg-blue-300 rounded-lg px-2.5 py-1.5
                               transition-colors disabled:opacity-50 flex-shrink-0 flex items-center gap-1"
                >
                    {confirmMutation.isPending ? (
                        <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                        "✅ Obecność"
                    )}
                </button>
            );
        }

        return null;
    };

    return (
        <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Avatar */}
                {volunteer.profileImage ? (
                    <img
                        src={volunteer.profileImage}
                        alt=""
                        className="w-7 h-7 md:w-6 md:h-6 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-7 h-7 md:w-6 md:h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-purple-700">
                            {volunteer.displayName.charAt(0)}
                        </span>
                    </div>
                )}

                {/* Name — truncated */}
                <span
                    className="text-xs md:text-sm text-gray-700 truncate max-w-[120px] md:max-w-[160px]"
                    title={volunteer.displayName}
                >
                    {volunteer.displayName}
                </span>

                {/* Non-admin pending indicator (Clock icon) */}
                {!isAdmin && volunteer.status === "PENDING" && (
                    <Clock className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                )}
            </div>

            {/* Admin action / status */}
            {renderAdminAction()}
        </div>
    );
}
