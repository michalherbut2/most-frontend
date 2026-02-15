"use client";

import React, { useState } from "react";
import { DutySlot } from "@/features/duties/api/queries";
import DutyCardHeader from "./DutyCardHeader";
import DutyProgressBar from "./DutyProgressBar";
import DutyVolunteersList from "./DutyVolunteersList";
import DutyCardActions from "./DutyCardActions";
import EditDutySlotDialog from "../EditDutySlotDialog";

// ─── Status-based card styling ───────────────────────────────────────────────

type CardStatus = "free" | "mine" | "full";

function getCardStatus(slot: DutySlot): CardStatus {
    if (slot.currentUserSignedUp) return "mine";
    if (slot.approvedCount >= slot.capacity) return "full";
    return "free";
}

const cardStyles: Record<CardStatus, string> = {
    free: "bg-white border-gray-200",
    mine: "bg-blue-50 border-blue-300",
    full: "bg-green-50 border-green-300",
};

// ─── Main Card ───────────────────────────────────────────────────────────────

interface DutySlotCardProps {
    slot: DutySlot;
    isAdmin?: boolean;
}

export default function DutySlotCard({ slot, isAdmin = false }: DutySlotCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const status = getCardStatus(slot);

    // isPast: slot date+time is before current moment
    const slotDateTime = new Date(`${slot.date}T${slot.time}`);
    const isPast = slotDateTime < new Date();

    const cardColor = isPast ? "bg-gray-50 border-gray-200 opacity-75" : cardStyles[status];

    return (
        <>
            <div
                className={`rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col ${cardColor}`}
            >
                {/* Header */}
                <div className="p-4 md:p-5 pb-3">
                    <DutyCardHeader
                        title={slot.title}
                        time={slot.time}
                        pointsValue={slot.pointsValue}
                        isAdmin={isAdmin}
                        onDeleteClick={() => setShowDeleteConfirm(true)}
                        onEditClick={() => setShowEditDialog(true)}
                    />

                    {/* Progress */}
                    <div className="mt-3 md:mt-4">
                        <DutyProgressBar
                            current={slot.approvedCount}
                            max={slot.capacity}
                        />
                    </div>
                </div>

                {/* Volunteers */}
                {slot.volunteers.length > 0 && (
                    <div className="px-4 md:px-5 pb-3">
                        <DutyVolunteersList
                            volunteers={slot.volunteers}
                            isAdmin={isAdmin}
                            isPast={isPast}
                        />
                    </div>
                )}

                {/* Actions — pushed to bottom */}
                <div className="px-4 md:px-5 pb-4 md:pb-5 mt-auto">
                    <DutyCardActions
                        slot={slot}
                        isPast={isPast}
                        showDeleteConfirm={showDeleteConfirm}
                        onShowDeleteConfirm={setShowDeleteConfirm}
                    />
                </div>
            </div>

            {/* Edit Dialog (rendered outside card for z-index) */}
            {showEditDialog && (
                <EditDutySlotDialog
                    slot={slot}
                    onClose={() => setShowEditDialog(false)}
                />
            )}
        </>
    );
}
