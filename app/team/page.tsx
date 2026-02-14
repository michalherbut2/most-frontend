"use client";

import React, { useEffect, useState } from "react";
import { teamApi } from "@/services/api";
import { TeamMember } from "@/shared/types/TeamMember";
import TeamMemberCard from "@/components/TeamMemberCard";
import TeamMemberModal from "@/components/TeamMemberModal";

const CACHE_KEY = "most_team_data";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 godziny w milisekundach

export default function Home() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtry
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedPrzeslo, setSelectedPrzeslo] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(""); // <--- NOWE: Stan wyszukiwania
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, selectedSection, selectedPrzeslo, searchQuery]);

  const loadMembers = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // 2. SPRAWDZAMY CACHE (jeśli nie wymuszamy odświeżenia)
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          // Jeśli dane są młodsze niż 24h, użyj ich i przerwij pobieranie
          if (age < CACHE_DURATION) {
            console.log(
              `📦 Używam danych z cache (wiek: ${(age / 1000 / 60).toFixed(0)} min)`,
            );
            setMembers(data);
            setLoading(false);
            return;
          }
        }
      }

      // 3. JEŚLI BRAK CACHE LUB FORCE REFRESH -> POBIERZ Z API
      console.log("🌐 Pobieram świeże dane z API...");
      const data = await teamApi.getAllMembers();

      // Zapisz do stanu
      setMembers(data);

      // 4. ZAKTUALIZUJ CACHE
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: data,
          timestamp: Date.now(),
        }),
      );
    } catch (err) {
      setError("Błąd podczas ładowania członków zespołu");
      console.error(err);

      // Fallback: Jeśli API padnie, a mamy stary cache, spróbujmy go użyć mimo wszystko
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setMembers(JSON.parse(cached).data);
        setError("Błąd sieci - wyświetlam ostatnio zapamiętane dane.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    try {
      setScraping(true);
      setError(null);
      const data = await teamApi.scrapeMembers();
      setMembers(data);

      // Ważne: Po scrapowaniu też aktualizujemy cache!
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: data,
          timestamp: Date.now(),
        }),
      );

      alert("Pomyślnie zescrapowano dane!");
    } catch (err) {
      // ... error handling ...
    } finally {
      setScraping(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...members];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        m =>
          (m.fullName && m.fullName.toLowerCase().includes(lowerQuery)) ||
          (m.name && m.name.toLowerCase().includes(lowerQuery)),
      );
    }

    // Filtr po sekcji
    if (selectedSection !== "all") {
      filtered = filtered.filter(m => m.section === selectedSection);
    }

    // Filtr po przęśle (tylko dla Podprzęsłowych)
    if (selectedPrzeslo !== "all") {
      filtered = filtered.filter(m => m.belongsTo === selectedPrzeslo);
    }

    setFilteredMembers(filtered);
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  // Pobierz unikalne sekcje
  const sections = [
    "all",
    ...Array.from(new Set(members.map(m => m.section).filter(Boolean))),
  ];

  // Pobierz unikalne przęsła (dla Podprzęsłowych)
  const przesla = [
    "all",
    ...Array.from(
      new Set(
        members
          .filter(m => m.section === "Podprzęsłowi" && m.belongsTo)
          .map(m => m.belongsTo),
      ),
    ),
  ];

  // Grupuj członków według sekcji dla lepszego wyświetlania
  const groupedMembers = filteredMembers.reduce(
    (acc, member) => {
      const section = member.section || "Inne";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(member);
      return acc;
    },
    {} as Record<string, TeamMember[]>,
  );

  // Kolejność sekcji
  const sectionOrder = ["Sekstet", "Przęsłowi", "Podprzęsłowi", "Inne"];

  const isFilteringActive =
    searchQuery !== "" ||
    selectedSection !== "all" ||
    selectedPrzeslo !== "all";

  return (
    <main className="main-container">
      <div className="header">
        <h1>Konstrukcja Zespołu</h1>
        <div className="button-group">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-outline ${isFilteringActive ? "active-filter" : ""}`}
          >
            {showFilters ? "🔼 Ukryj filtry" : "🔍 Szukaj i filtruj"}
            {isFilteringActive && !showFilters && (
              <span className="filter-dot"></span>
            )}
          </button>
          {/* <button 
            onClick={() => loadMembers(true)} 
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Ładowanie...' : 'Odśwież'}
          </button>
          <button 
            onClick={handleScrape} 
            disabled={scraping}
            className="btn btn-primary"
          >
            {scraping ? 'Scrapowanie...' : 'Scrapuj dane'}
          </button> */}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className={`filters-wrapper ${showFilters ? "open" : ""}`}>
        {!loading && members.length > 0 && (
          <div className="filters">
            <div className="filter-group search-group">
              <label>Szukaj:</label>
              <input
                type="text"
                placeholder="Imię, nazwisko lub rola..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Sekcja:</label>
              <select
                value={selectedSection}
                onChange={e => {
                  setSelectedSection(e.target.value);
                  setSelectedPrzeslo("all");
                }}
              >
                <option value="all">Wszystkie</option>
                {sections
                  .filter(s => s !== "all")
                  .map(section => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
              </select>
            </div>

            {(selectedSection === "Podprzęsłowi" ||
              selectedSection === "all") &&
              przesla.length > 1 && (
                <div className="filter-group">
                  <label>Przęsło:</label>
                  <select
                    value={selectedPrzeslo}
                    onChange={e => setSelectedPrzeslo(e.target.value)}
                  >
                    <option value="all">Wszystkie</option>
                    {przesla
                      .filter(p => p !== "all")
                      .map(przeslo => (
                        <option key={przeslo} value={przeslo}>
                          {przeslo}
                        </option>
                      ))}
                  </select>
                </div>
              )}

            <div className="results-count">
              Znaleziono: <strong>{filteredMembers.length}</strong>
            </div>

            {/* Przycisk resetu (opcjonalny, dla wygody) */}
            {isFilteringActive && (
              <button
                className="reset-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSection("all");
                  setSelectedPrzeslo("all");
                }}
              >
                Resetuj
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Ładowanie członków zespołu...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="empty-state">
          <p>Brak członków zespołu w bazie danych.</p>
          <p>Kliknij "Scrapuj dane" aby pobrać dane ze strony.</p>
        </div>
      ) : (
        <div className="content-wrapper">
          {filteredMembers.length === 0 ? (
            // <--- NOWE: Komunikat gdy wyszukiwanie nic nie znajdzie
            <div className="empty-search">
              <p>Nie znaleziono osób pasujących do kryteriów.</p>
            </div>
          ) : (
            sectionOrder.map(sectionName => {
              const sectionMembers = groupedMembers[sectionName];
              if (!sectionMembers || sectionMembers.length === 0) return null;

              return (
                <div key={sectionName} className="section-container">
                  <h2 className="section-title">{sectionName}</h2>
                  <ul className="team-grid">
                    {sectionMembers.map(member => (
                      <TeamMemberCard
                        key={member.id}
                        member={member}
                        onClick={() => handleMemberClick(member)}
                      />
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      )}

      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <style jsx>{`
        .main-container {
          min-height: 100vh;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .header {
          max-width: 1200px;
          margin: 0 auto 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        h1 {
          font-size: 2.5rem;
          color: #2573a6;
          margin: 0;
          font-weight: 700;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #2573a6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1a5680;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 115, 166, 0.3);
        }

        .btn-secondary {
          background: white;
          color: #2573a6;
          border: 2px solid #2573a6;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f0f8ff;
          transform: translateY(-2px);
        }

        /* 1. Wrapper do animacji */
        .filters-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          max-height: 0; /* Domyślnie ukryte */
          opacity: 0;
          overflow: hidden; /* Ważne! */
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* Płynna animacja */
          transform: translateY(-10px);
        }

        /* Klasa dodawana gdy otwarte */
        .filters-wrapper.open {
          max-height: 500px; /* Wystarczająco dużo, żeby zmieścić zawartość */
          opacity: 1;
          transform: translateY(0);
          margin-bottom: 30px; /* Margines pojawia się dopiero po otwarciu */
        }

        /* 2. Przycisk Outline */
        .btn-outline {
          background: transparent;
          border: 2px solid #2573a6;
          color: #2573a6;
          position: relative;
        }

        .btn-outline:hover {
          background: rgba(37, 115, 166, 0.1);
        }

        .btn-outline.active-filter {
          background: #e3f2fd;
          border-color: #2573a6;
        }

        /* Kropka sygnalizująca aktywne filtry gdy panel zamknięty */
        .filter-dot {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 12px;
          height: 12px;
          background-color: #ff8c00;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* 3. Przycisk resetu wewnątrz filtrów */
        .reset-btn {
          background: none;
          border: none;
          color: #c33;
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.9rem;
          margin-left: 10px;
        }

        .btn-link {
          background: none;
          border: none;
          color: #2573a6;
          text-decoration: underline;
          cursor: pointer;
          font-weight: bold;
        }

        /* Reszta stylów ... */
        .filters {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Lekko zmieniony cień */
          border: 1px solid rgba(37, 115, 166, 0.1);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-group {
          flex-grow: 1; /* Wyszukiwarka zajmie dostępne miejsce */
          min-width: 250px;
        }

        .search-input {
          width: 100%;
          padding: 8px 16px;
          border: 2px solid #d0e8ff;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2573a6;
        }

        .filter-group label {
          font-weight: 600;
          color: #2573a6;
        }

        .filter-group select {
          padding: 8px 16px;
          border: 2px solid #d0e8ff;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          background: white;
          transition: border-color 0.2s;
        }

        .filter-group select:hover {
          border-color: #2573a6;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #2573a6;
        }

        .results-count {
          margin-left: auto;
          color: #666;
          font-size: 0.95rem;
        }

        .results-count strong {
          color: #2573a6;
        }

        .empty-search {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #888;
        }

        .error-message {
          max-width: 1200px;
          margin: 0 auto 20px;
          padding: 15px 20px;
          background: #fee;
          border-left: 4px solid #c33;
          color: #c33;
          border-radius: 4px;
        }

        .loading {
          max-width: 1200px;
          margin: 100px auto;
          text-align: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2573a6;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          max-width: 1200px;
          margin: 100px auto;
          text-align: center;
          color: #666;
        }

        .empty-state p {
          font-size: 1.1rem;
          margin: 10px 0;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-container {
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 2rem;
          color: #2573a6;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 3px solid #2573a6;
          font-weight: 700;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          padding: 0;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: stretch;
          }

          h1 {
            font-size: 2rem;
            text-align: center;
          }

          .button-group {
            flex-direction: column;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            flex-direction: column;
            align-items: stretch;
          }

          .results-count {
            margin-left: 0;
            text-align: center;
          }

          .team-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </main>
  );
}
