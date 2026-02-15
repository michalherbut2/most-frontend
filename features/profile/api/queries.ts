import { apiClient } from "@/shared/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface PointsTransactionDto {
    id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
}

export interface LeaderboardEntry {
    userId: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    points: number;
    rank: number;
}

export interface UpdateProfilePayload {
    firstName: string;
    lastName: string;
}

// ─── QUERY KEYS ─────────────────────────────────────────────────────────────

const profileKeys = {
    all: ["profile"] as const,
    history: () => [...profileKeys.all, "history"] as const,
    leaderboard: () => [...profileKeys.all, "leaderboard"] as const,
};

// ─── HOOKS ──────────────────────────────────────────────────────────────────

export function useMyHistory() {
    return useQuery<PointsTransactionDto[]>({
        queryKey: profileKeys.history(),
        queryFn: async () => {
            const data = await apiClient.get("/users/me/history");
            return data as unknown as PointsTransactionDto[];
        },
    });
}

export function useLeaderboard() {
    return useQuery<LeaderboardEntry[]>({
        queryKey: profileKeys.leaderboard(),
        queryFn: async () => {
            const data = await apiClient.get("/users/leaderboard");
            return data as unknown as LeaderboardEntry[];
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            await apiClient.put("/users/me", payload);
        },
        onSuccess: () => {
            toast.success("Profil zaktualizowany ✅");
            queryClient.invalidateQueries({ queryKey: profileKeys.all });
            // Also invalidate auth state so the user object is refreshed
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
        onError: () => {
            toast.error("Nie udało się zaktualizować profilu.");
        },
    });
}
