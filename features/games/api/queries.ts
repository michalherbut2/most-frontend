// features/calendar/api/queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Bet,
  CreateBetRequest,
  PlaceBetRequest,
  WheelSpinResponse,
  CoinFlipResult,
} from "../types";

// ==========================================
// 1. KLUCZE (Query Keys)
// ==========================================
export const entertainmentKeys = {
  all: ["entertainment"] as const,
  bets: {
    all: ["entertainment", "bets"] as const,
    active: ["entertainment", "bets", "active"] as const,
    settled: ["entertainment", "bets", "settled"] as const,
    my: () => ["entertainment", "bets", "my"] as const,
    detail: (id: string) => ["entertainment", "bets", "detail", id] as const,
  },
  arcade: {
    wheel: ["entertainment", "arcade", "wheel"] as const,
  },
};

// ==========================================
// 2. HOOKI (Queries & Mutations)
// ==========================================

// --- BETTING: ODCZYT ---

export function useActiveBets() {
  return useQuery({
    queryKey: entertainmentKeys.bets.active, // Używamy naszego nowego klucza
    queryFn: async () => {
      // Backend wymaga @AuthenticationPrincipal, więc Token poleci automagicznie
      // w nagłówku dzięki axios-client.ts. Nie musisz nic tu dodawać.

      // Uwaga: Upewnij się co do ścieżki.
      // Jeśli w Springu masz @RequestMapping("/api/games/bets"), to tutaj:
      const response = await apiClient.get<Bet[]>("/games/bets/active");
      
      return response;
    },
    // Opcjonalnie: Odświeżaj co minutę, żeby widzieć nowe zakłady od innych
    refetchInterval: 60 * 1000,
  });
}

export function useSettledBets() {
  return useQuery({
    queryKey: entertainmentKeys.bets.settled,
    queryFn: async () => {
      return await apiClient.get<Bet[]>("/games/bets/settled");
    },
  });
}


export function useMyBets() {
  return useQuery({
    queryKey: entertainmentKeys.bets.my(),
    queryFn: async () => {
      return await apiClient.get<Bet[]>("/games/bets/my");
    },
  });
}

export function useBet(betId: string) {
  return useQuery({
    queryKey: entertainmentKeys.bets.detail(betId),
    queryFn: async () => {
      return await apiClient.get<Bet>(`/games/bets/${betId}`);
    },
    enabled: !!betId, // Nie strzelaj, jak nie ma ID
  });
}

// --- BETTING: AKCJE ---

export function useCreateBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBetRequest) => {
      console.log("data", data);
      
      return await apiClient.post<Bet>("/games/bets", data);
    },
    onSuccess: () => {
      // Odświeżamy listy zakładów (np. w dashboardzie i "moje zakłady")
      queryClient.invalidateQueries({ queryKey: entertainmentKeys.bets.all });
    },
  });
}

export function usePlaceBet() {
  const queryClient = useQueryClient();
  const { checkAuth: refreshUser } = useAuth(); // 👇 Ważne: Żeby zaktualizować portfel!

  return useMutation({
    mutationFn: async (data: PlaceBetRequest) => {
      return await apiClient.post<void>("/games/bets/place", data);
    },
    onSuccess: (_, variables) => {
      // 1. Odśwież szczegóły tego konkretnego zakładu (pula się zmieniła)
      queryClient.invalidateQueries({
        queryKey: entertainmentKeys.bets.detail(variables.betId),
      });
      // 2. Odśwież moje zakłady
      queryClient.invalidateQueries({ queryKey: entertainmentKeys.bets.my() });
      // 3. Odśwież punkty w Navbarze (bo user wydał kasę)
      refreshUser();
    },
  });
}

export function useResolveBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      betId,
      winningOption,
    }: {
      betId: string;
      winningOption: string;
    }) => {
      return await apiClient.post<Bet>("/games/bets/resolve", {
        betId,
        winningOption,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: entertainmentKeys.bets.detail(variables.betId),
      });
      queryClient.invalidateQueries({ queryKey: entertainmentKeys.bets.my() });
    },
  });
}

export function useCancelBet() {
  const queryClient = useQueryClient();
  const { checkAuth: refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (betId: string) => {
      return await apiClient.delete<void>(`/games/bets/${betId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entertainmentKeys.bets.all });
      // Zwrot kasy dla wszystkich -> warto odświeżyć usera
      refreshUser();
    },
  });
}

// --- ARCADE (Gry) ---

export function useWheelStatus() {
  return useQuery({
    queryKey: entertainmentKeys.arcade.wheel,
    queryFn: () => {
      return apiClient.get<WheelSpinResponse>("/games/arcade/wheel/status");
    },
    staleTime: 0, // Dane są "nieświeże" od razu -> wymusza sprawdzenie przy ponownym wejściu
    refetchOnWindowFocus: true, // Odśwież jak user wróci na zakładkę
    retry: false,
  });
}

export function useSpinWheel() {
  const queryClient = useQueryClient();
  const { checkAuth: refreshUser } = useAuth();

  return useMutation({
    mutationFn: () => {
      return apiClient.post<WheelSpinResponse>("/games/arcade/wheel/spin");
    },
    onSuccess: () => {
      // Zablokuj koło (status changed)
      queryClient.invalidateQueries({
        queryKey: entertainmentKeys.arcade.wheel,
      });
      // Dodaj wygrane punkty
      refreshUser();
    },
  });
}

export function useFlipCoin() {
  const { checkAuth: refreshUser } = useAuth();

  return useMutation({
    mutationFn: (amount: number) =>
      apiClient.post<CoinFlipResult>("/games/arcade/coinflip", {
        amount,
      }),
    onSuccess: () => {
      // Tutaj tylko odświeżamy portfel, bo rzut monetą nie ma historii w cache
      refreshUser();
    },
  });
}
