"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api";
import { authCookie } from "@/shared/lib/auth-cookie";
import { AuthStore, LoginRequest } from "../types";

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true });

          const data = await authApi.login(credentials);

          authCookie.set(data.token);

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authCookie.remove();
        set({ user: null, isAuthenticated: false });
        window.location.href = "/login";
      },

      checkAuth: async () => {
        try {
          const token = authCookie.get();

          if (!token) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const user = await authApi.me();
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to refresh user:", error);
          get().logout();
        }
      },
    }),
    {
      name: "most-auth", // Klucz w localStorage
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export function useUserRole() {
  const user = useAuth((state) => state.user);

  const role = user?.role;
  const isAdmin = role === 'ADMIN';
  const isLeader = role === 'LEADER' || isAdmin;
  // Każdy zalogowany jest USER, więc to jest zazwyczaj true jeśli user istnieje
  const isUser = !!user; 

  return { role, isAdmin, isLeader, isUser };
}