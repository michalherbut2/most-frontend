"use client";

import { useState, useEffect, use } from "react";
import { Song } from "@/shared/types/song";
import Link from "next/link";

// W Next.js 13+ params w "use client" trzeba czasem obsłużyć przez React.use()
// Ale dla uproszczenia zrobimy klasycznie:

export default function SongDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // UWAGA: w najnowszym Next.js params jest Promise'm
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null,
  );
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Rozpakuj params (wymagane w Next.js 15)
  useEffect(() => {
    params.then(p => setUnwrappedParams(p));
  }, [params]);

  // 2. Pobierz piosenkę jak mamy ID
  useEffect(() => {
    if (!unwrappedParams?.id) return;

    const fetchSong = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/songs/${unwrappedParams.id}`,
        ); // <--- Backend potrzebuje tego endpointu!
        if (res.ok) {
          const data = await res.json();
          setSong(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [unwrappedParams]);

  if (loading)
    return <div className="p-10 text-center">Ładowanie tekstu...</div>;
  if (!song)
    return (
      <div className="p-10 text-center text-red-500">
        Nie znaleziono pieśni.
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* NAGŁÓWEK */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 shadow-md flex items-center gap-4 z-20">
        <Link href="/songs" className="p-2 hover:bg-blue-700 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-bold truncate">{song.title}</h1>
      </div>

      {/* TREŚĆ */}
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-sm text-gray-400 mb-4 uppercase tracking-widest border-b pb-2">
          {song.category}
        </div>

        {/* whitespace-pre-wrap JEST KLUCZOWE - zachowuje entery i spacje */}
        <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800">
          {song.content}
        </pre>
      </div>
    </div>
  );
}
