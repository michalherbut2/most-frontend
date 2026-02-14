// To jest interfejs - kontrakt, jak wyglądają dane z Backend
export interface Song {
  id: string;
  title: string;
  category: string;
  content: string;
  // Tutaj opcjonalnie możemy dodać isFavorite, ale obsłużymy to w stanie komponentu
  isFavorite?: boolean; 
}