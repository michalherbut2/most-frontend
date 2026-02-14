"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // <--- Ważne do nawigacji
import { Song } from "@/shared/types/song";

export default function SongbookPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState(""); // <--- Stan wyszukiwania
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/songs");
        if (!res.ok) throw new Error("Błąd sieci");
        const data = await res.json();
        setSongs(data);
      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // Logika filtrowania (szukamy po tytule LUB treści)
  const filteredSongs = songs.filter(
    song =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Śpiewnik
      </h1>

      {/* --- WYSZUKIWARKA --- */}
      <div className="mb-6 sticky top-2 z-10">
        <input
          type="text"
          placeholder="Szukaj pieśni..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">Ładowanie...</div>
      ) : (
        <div className="space-y-3">
          {filteredSongs.map(song => (
            <Link key={song.id} href={`/songs/${song.id}`}>
              {" "}
              {/* <--- Link do szczegółów */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition active:scale-95 cursor-pointer mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {song.title}
                </h3>
                <span className="text-xs text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded">
                  {song.category}
                </span>
              </div>
            </Link>
          ))}

          {filteredSongs.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              Nic nie znaleziono :(
            </div>
          )}
        </div>
      )}
    </div>
  );
}
