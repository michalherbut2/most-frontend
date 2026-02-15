import { apiClient } from "@/shared/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "USER" | "LEADER" | "ADMIN";
    points: number;
    active: boolean;
    profileImage: string | null;
    sectionId: string | null;
    sectionName: string | null;
    emailVerified: boolean;
    createdAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // current page (0-indexed)
    size: number;
    first: boolean;
    last: boolean;
}

export interface AdminUpdatePayload {
    userId: string;
    role: "USER" | "LEADER" | "ADMIN";
    points: number;
}

// ─── QUERY KEYS ─────────────────────────────────────────────────────────────

const userKeys = {
    all: ["users"] as const,
    adminList: (page: number, search: string) =>
        [...userKeys.all, "admin-list", page, search] as const,
};

// ─── HOOKS ──────────────────────────────────────────────────────────────────

export function useUsers(page: number, search: string) {
    return useQuery<PageResponse<UserDto>>({
        queryKey: userKeys.adminList(page, search),
        queryFn: async () => {
            const data = await apiClient.get("/users/admin/list", {
                params: { page, size: 20, search: search || undefined },
            });
            return data as unknown as PageResponse<UserDto>;
        },
        placeholderData: (prev) => prev, // keepPreviousData equivalent
    });
}

export function useAdminUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, role, points }: AdminUpdatePayload) => {
            const data = await apiClient.put(`/users/${userId}/admin-update`, {
                role,
                points,
            });
            return data as unknown as UserDto;
        },
        onSuccess: () => {
            toast.success("Użytkownik zaktualizowany ✅");
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: () => {
            toast.error("Nie udało się zaktualizować użytkownika.");
        },
    });
}
