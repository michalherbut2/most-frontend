'use client';
import { useSongs, useAddSong } from '../api/queries';

export function SongList() {
  // ViewModel w jednej linijce:
  const { data: songs, isLoading, isError } = useSongs(); 
  const addSongMutation = useAddSong();

  if (isLoading) return <div>Ładowanie śpiewnika...</div>;
  if (isError) return <div>Błąd pobierania!</div>;

  return (
    <div>
      <button 
        onClick={() => addSongMutation.mutate({ title: "Nowa Piosenka" })}
        disabled={addSongMutation.isPending}
      >
        {addSongMutation.isPending ? 'Dodawanie...' : 'Dodaj Piosenkę'}
      </button>

      <ul>
        {songs?.map(song => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
    </div>
  );
}