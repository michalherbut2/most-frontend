import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSongs, createSong } from './endpoints';

// Klucze cache'a (żeby React wiedział co odświeżyć)
const keys = {
  all: ['songs'] as const,
};

// Hook do ODCZYTU (Zastępuje: store.songs, store.isLoading, store.fetchSongs)
export function useSongs() {
  return useQuery({
    queryKey: keys.all,
    queryFn: getSongs,
    staleTime: 1000 * 60 * 5, // Dane są świeże przez 5 minut (Cache!)
  });
}

// Hook do ZAPISU (Zastępuje: store.addSong)
export function useAddSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSong,
    onSuccess: () => {
      // Automatycznie odśwież listę po dodaniu!
      // Nie musisz ręcznie aktualizować tablicy jak w Zustandzie.
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}