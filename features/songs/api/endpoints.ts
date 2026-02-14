import { axiosClient } from '@/shared/lib/axios-client';
import { Song } from '../types';

// To są "czyste" funkcje. Nic nie wiedzą o stanie aplikacji.
export const getSongs = async (): Promise<Song[]> => {
  return await axiosClient.get('/songs');
};

export const createSong = async (newSong: Partial<Song>): Promise<Song> => {
  return await axiosClient.post('/songs', newSong);
};