import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { toast } from "react-hot-toast";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type DutyCategory = "LITURGY" | "KITCHEN" | "OTHER";
export type VolunteerStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface VolunteerInfo {
    id: string;
    displayName: string;
    status: VolunteerStatus;
    wasPresent: boolean;
    profileImage?: string;
}

export interface DutySlot {
    id: string;
    date: string;         // ISO date
    time: string;         // HH:mm
    category: DutyCategory;
    title: string;
    capacity: number;
    approvedCount: number;
    isAutoApproved: boolean;
    pointsValue: number;
    volunteers: VolunteerInfo[];
    currentUserSignedUp: boolean;
}

// ─── QUERY KEYS ──────────────────────────────────────────────────────────────

export const dutyKeys = {
    all: ["duties"] as const,
    slots: (category: DutyCategory, dateFrom: string, dateTo: string) =>
        [...dutyKeys.all, "slots", category, dateFrom, dateTo] as const,
};

// ─── HOOKS ───────────────────────────────────────────────────────────────────

// 1. Pobierz sloty (filtrowane po kategorii i zakresie dat)
export function useDutySlots(category: DutyCategory, dateFrom: string, dateTo: string) {
    return useQuery({
        queryKey: dutyKeys.slots(category, dateFrom, dateTo),
        queryFn: async () => {
            // apiClient interceptor unwraps response.data automatically
            const data = await apiClient.get("/duties/slots", {
                params: { category, dateFrom, dateTo },
            });
            return data as unknown as DutySlot[];
        },
        enabled: !!dateFrom && !!dateTo,
    });
}

// 2. Zapisz się na slot
export function useSignUp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ slotId, anonymous }: { slotId: string; anonymous: boolean }) => {
            const data = await apiClient.post<DutySlot>(
                `/duties/slots/${slotId}/sign-up`,
                { anonymous }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Zapisano na służbę! 🙌");
            queryClient.invalidateQueries({ queryKey: dutyKeys.all });
        },
        onError: () => {
            toast.error("Nie udało się zapisać na służbę.");
        },
    });
}

// 3. Wypisz się ze slotu
export function useCancelSignUp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (slotId: string) => {
            await apiClient.delete(`/duties/slots/${slotId}/sign-up`);
        },
        onSuccess: () => {
            toast.success("Wypisano ze służby");
            queryClient.invalidateQueries({ queryKey: dutyKeys.all });
        },
        onError: () => {
            toast.error("Nie udało się wypisać ze służby.");
        },
    });
}

// 4. Potwierdź obecność (Admin)
export function useConfirmPresence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (volunteerId: string) => {
            await apiClient.patch(`/duties/admin/volunteers/${volunteerId}/confirm`);
        },
        onSuccess: () => {
            toast.success("Obecność potwierdzona ✅");
            queryClient.invalidateQueries({ queryKey: dutyKeys.all });
        },
        onError: () => {
            toast.error("Nie udało się potwierdzić obecności.");
        },
    });
}

// 5. Generuj tydzień liturgii (Admin)
export function useGenerateLiturgyWeek() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (startMonday: string) => {
            const data = await apiClient.post<DutySlot[]>(
                "/duties/admin/generate/liturgy",
                null,
                { params: { startMonday } }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Wygenerowano tydzień liturgii 📅");
            queryClient.invalidateQueries({ queryKey: dutyKeys.all });
        },
        onError: () => {
            toast.error("Nie udało się wygenerować harmonogramu.");
        },
    });
}

// 6. Generuj slot kuchenny (Admin)
export function useGenerateSundayKitchen() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sunday: string) => {
            const data = await apiClient.post<DutySlot>(
                "/duties/admin/generate/kitchen",
                null,
                { params: { sunday } }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Wygenerowano slot kuchenny 🍳");
            queryClient.invalidateQueries({ queryKey: dutyKeys.all });
        },
        onError: () => {
            toast.error("Nie udało się wygenerować slotu.");
        },
    });
}
