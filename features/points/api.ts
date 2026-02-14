// src/features/points/api/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api-client';
import { LeaderboardEntry, PointTransaction, AwardPointsRequest } from '../types';

// 1. Pobieranie rankingu
export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['points', 'leaderboard'],
    queryFn: async () => {
      return await apiClient.get<LeaderboardEntry[]>('/points/leaderboard');
    },
    staleTime: 1000 * 60 * 5, // Cache na 5 minut
  });
};

// 2. Pobieranie historii transakcji (Moje punkty)
export const useMyPointsHistory = () => {
  return useQuery({
    queryKey: ['points', 'history'],
    queryFn: async () => {
      return await apiClient.get<PointTransaction[]>('/points/history');
    },
  });
};

// 3. Przyznawanie punktów (Tylko dla Admina/Lidera)
export const useAwardPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AwardPointsRequest) => {
      return await apiClient.post('/points/award', data);
    },
    onSuccess: () => {
      // Po sukcesie odświeżamy ranking i historię (jeśli admin nadał sobie)
      queryClient.invalidateQueries({ queryKey: ['points'] });
      // Opcjonalnie: Odśwież dane usera w AuthContext, jeśli zmieniły się jego punkty
    },
  });
};

// 1. Pobieranie listy ludzi do wyboru
export const useUsersList = () => {
  return useQuery({
    queryKey: ['users', 'lite'],
    queryFn: async () => {
      return await apiClient.get<UserSummary[]>('/users/lite');
    },
    staleTime: 1000 * 60 * 10, // Cache na 10 min, lista ludzi rzadko się zmienia
  });
};