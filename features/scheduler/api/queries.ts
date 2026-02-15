import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { toast } from "react-hot-toast";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type ServiceCategory = "LITURGY" | "KITCHEN" | "OTHER";
export type VolunteerStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface VolunteerInfo {
    id: string;
    displayName: string;
    status: VolunteerStatus;
    wasPresent: boolean;
    profileImage?: string;
}

export interface ServiceSlot {
    id: string;
    date: string;         // ISO date
    time: string;         // HH:mm
    category: ServiceCategory;
    title: string;
    capacity: number;
    approvedCount: number;
    isAutoApproved: boolean;
    pointsValue: number;
    volunteers: VolunteerInfo[];
    currentUserSignedUp: boolean;
}

// ─── QUERY KEYS ──────────────────────────────────────────────────────────────

export const schedulerKeys = {
    all: ["scheduler"] as const,
    slots: (category: ServiceCategory, dateFrom: string, dateTo: string) =>
        [...schedulerKeys.all, "slots", category, dateFrom, dateTo] as const,
};

// ─── HOOKS ───────────────────────────────────────────────────────────────────

// 1. Pobierz sloty (filtrowane po kategorii i zakresie dat)
export function useServiceSlots(category: ServiceCategory, dateFrom: string, dateTo: string) {
    return useQuery({
        queryKey: schedulerKeys.slots(category, dateFrom, dateTo),
        queryFn: async () => {
            // apiClient interceptor unwraps response.data automatically
            const data = await apiClient.get("/scheduler/slots", {
                params: { category, dateFrom, dateTo },
            });
            return data as unknown as ServiceSlot[];
        },
        enabled: !!dateFrom && !!dateTo,
    });
}

// 2. Zapisz się na slot
export function useSignUp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ slotId, isAnonymous }: { slotId: string; isAnonymous: boolean }) => {
            const data = await apiClient.post<ServiceSlot>(
                `/scheduler/slots/${slotId}/sign-up`,
                { isAnonymous }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Zapisano na służbę! 🙌");
            queryClient.invalidateQueries({ queryKey: schedulerKeys.all });
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
            await apiClient.delete(`/scheduler/slots/${slotId}/sign-up`);
        },
        onSuccess: () => {
            toast.success("Wypisano ze służby");
            queryClient.invalidateQueries({ queryKey: schedulerKeys.all });
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
            await apiClient.patch(`/scheduler/admin/volunteers/${volunteerId}/confirm`);
        },
        onSuccess: () => {
            toast.success("Obecność potwierdzona ✅");
            queryClient.invalidateQueries({ queryKey: schedulerKeys.all });
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
            const data = await apiClient.post<ServiceSlot[]>(
                "/scheduler/admin/generate/liturgy",
                null,
                { params: { startMonday } }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Wygenerowano tydzień liturgii 📅");
            queryClient.invalidateQueries({ queryKey: schedulerKeys.all });
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
            const data = await apiClient.post<ServiceSlot>(
                "/scheduler/admin/generate/kitchen",
                null,
                { params: { sunday } }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Wygenerowano slot kuchenny 🍳");
            queryClient.invalidateQueries({ queryKey: schedulerKeys.all });
        },
        onError: () => {
            toast.error("Nie udało się wygenerować slotu.");
        },
    });
}
