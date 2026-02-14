import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api-client';

import {
  Bet,
  CreateBetRequest,
  PlaceBetRequest,
  WheelSpinResponse,
  CoinFlipResult,
} from "../types";
import { createQueryKeys } from '@/shared/lib/query-factory';


// // Query keys 
// export const gamesKeys = {
//   all: ['games'] as const,
//   lists: () => [...gamesKeys.all, 'list'] as const,
//   list: (filters?: object) => [...gamesKeys.lists(), filters] as const,
//   details: () => [...gamesKeys.all, 'detail'] as const,
//   detail: (id: number) => [...gamesKeys.details(), id] as const,
//   today: () => [...gamesKeys.all, 'today'] as const,
//   upcoming: (limit: number) => [...gamesKeys.all, 'upcoming', limit] as const,
// };

const baseKeys = createQueryKeys('games');

export const gamesKeys = {
  ...baseKeys,

}


// Queries
export function useActiveBets() {
  return useQuery({
    queryKey: gamesKeys.lists(),
    queryFn: () => apiClient.get<Bet[]>('/calendar'),
  });
}

//  async getActiveBets(): Promise<Bet[]> {
//     const response = await fetch(`${API_BASE}/bets/active`, {
//       credentials: "include",
//     });
//     if (!response.ok) throw new Error("Failed to fetch active bets");
//     return response.json();
//   },

export function useCalendarEvent(id: number) {
  return useQuery({
    queryKey: gamesKeys.detail(id),
    queryFn: () => apiClient.get<CalendarEvent>(`/calendar/${id}`),
    enabled: !!id,
  });
}

export function useTodayEvents() {
  return useQuery({
    queryKey: gamesKeys.today(),
    queryFn: () => apiClient.get<CalendarEvent[]>('/calendar/today'),
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations
export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<CalendarEvent, 'id'>) => 
      apiClient.post<CalendarEvent>('/calendar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamesKeys.lists() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CalendarEvent> }) =>
      apiClient.put<CalendarEvent>(`/calendar/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: gamesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: gamesKeys.lists() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/calendar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamesKeys.lists() });
    },
  });
}

export const gamesApi = {
  // Betting endpoints
 

  async getMyBets(): Promise<Bet[]> {
    const response = await fetch(`${API_BASE}/bets/my`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch my bets");
    return response.json();
  },

  async getBet(betId: string): Promise<Bet> {
    const response = await fetch(`${API_BASE}/bets/${betId}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch bet");
    return response.json();
  },

  async createBet(request: CreateBetRequest): Promise<Bet> {
    const response = await fetch(`${API_BASE}/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Failed to create bet");
    return response.json();
  },

  async placeBet(request: PlaceBetRequest): Promise<void> {
    const response = await fetch(`${API_BASE}/bets/place`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to place bet");
    }
  },

  async resolveBet(betId: string, winningOption: string): Promise<Bet> {
    const response = await fetch(`${API_BASE}/bets/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ betId, winningOption }),
    });
    if (!response.ok) throw new Error("Failed to resolve bet");
    return response.json();
  },

  async cancelBet(betId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/bets/${betId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to cancel bet");
  },

  // Arcade endpoints
  async spinWheel(): Promise<WheelSpinResponse> {
    const response = await fetch(`${API_BASE}/arcade/wheel/spin`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to spin wheel");
    }
    return response.json();
  },

  async checkWheelStatus(): Promise<WheelSpinResponse> {
    const response = await fetch(`${API_BASE}/arcade/wheel/status`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to check wheel status");
    return response.json();
  },

  async flipCoin(amount: number): Promise<CoinFlipResult> {
    const response = await fetch(`${API_BASE}/arcade/coinflip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to flip coin");
    }
    return response.json();
  },
};
