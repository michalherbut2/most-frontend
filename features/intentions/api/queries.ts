import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client"; // Twój klient axios
import { toast } from "react-hot-toast"; // Zakładam, że masz tosty, jak nie to console.log

// --- TYPES ---

export enum IntentionType {
    BOX_INTENTION = "BOX_INTENTION",
    MASS_INTENTION = "MASS_INTENTION",
}

export enum IntentionStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
}

export interface Intention {
    id: string;
    content: string;
    type: IntentionType;
    status: IntentionStatus;
    targetDate: string; // ISO Date string
    isAnonymous: boolean;
    adminResponse?: string;
    authorName?: string;
    createdAt: string;
}

export interface CreateIntentionRequest {
    content: string;
    type: IntentionType;
    isAnonymous: boolean;
    userSelectedDate?: string; // YYYY-MM-DD
}

export interface ReviewIntentionRequest {
    isApproved: boolean;
    adminResponse?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "SUCCESS" | "WARNING" | "SYSTEM";
    isRead: boolean;
    createdAt: string;
}

// --- KEYS ---

export const intentionKeys = {
    all: ["intentions"] as const,
    my: () => [...intentionKeys.all, "my"] as const,
    adminPending: () => [...intentionKeys.all, "admin", "pending"] as const,
};

export const notificationKeys = {
    all: ["notifications"] as const,
    unreadCount: () => [...notificationKeys.all, "unread"] as const,
};

// --- HOOKS ---

// 1. Pobierz moje intencje
export function useMyIntentions() {
    return useQuery({
        queryKey: intentionKeys.my(),
        queryFn: async () => {
            const data = await apiClient.get<Intention[]>("/intentions/my");
            return data;
        },
    });
}

// 1b. Pobierz intencje oczekujące (Admin)
export function usePendingIntentions() {
    return useQuery({
        queryKey: intentionKeys.adminPending(),
        queryFn: async () => {
            const data = await apiClient.get<Intention[]>("/intentions/admin/pending");
            return data;
        },
    });
}

// 1c. Zatwierdź / Odrzuć intencję (Admin)
export function useReviewIntention() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...payload }: ReviewIntentionRequest & { id: string }) => {
            const { data } = await apiClient.put<Intention>(
                `/intentions/admin/${id}/review`,
                payload
            );
            return data;
        },
        onSuccess: (_data, variables) => {
            toast.success(
                variables.isApproved
                    ? "Intencja została zatwierdzona ✅"
                    : "Intencja została odrzucona"
            );
            queryClient.invalidateQueries({ queryKey: intentionKeys.adminPending() });
        },
        onError: () => {
            toast.error("Nie udało się przetworzyć intencji.");
        },
    });
}

// 2. Utwórz intencję
export function useCreateIntention() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateIntentionRequest) => {
            const { data } = await apiClient.post<Intention>("/intentions", payload);
            return data;
        },
        onSuccess: () => {
            toast.success("Intencja wysłana do akceptacji 🙏");
            queryClient.invalidateQueries({ queryKey: intentionKeys.my() });
        },
        onError: (error) => {
            toast.error("Nie udało się wysłać intencji.");
            console.error(error);
        },
    });
}

// 3. Powiadomienia (Lista)
export function useNotifications() {
    return useQuery({
        queryKey: notificationKeys.all,
        queryFn: async () => {
            const data = await apiClient.get<Notification[]>("/notifications");
            return data;
        },
    });
}

// 4. Licznik nieprzeczytanych (POLLING - Co 60s)
export function useUnreadNotificationsCount() {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: async () => {
            const data = await apiClient.get<number>("/notifications/unread-count");
            return data;
        },
        refetchInterval: 60 * 1000, // ✅ Senior Tip: Odpytuj co minutę
        refetchOnWindowFocus: true, // ✅ Senior Tip: Odśwież jak user wróci na kartę
        staleTime: 30 * 1000,
    });
}

// 5. Oznacz jako przeczytane
export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.patch(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}

// 6. Oznacz wszystkie jako przeczytane
export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await apiClient.patch(`/notifications/read-all`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}