export interface Member {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl?: string;
  phoneNumber?: string;
  email?: string;
}

// Struktura pomocnicza do wyświetlania
export interface TeamSection {
  name: string;       // np. "Logistyka"
  leader?: Member;    // Szef
  assistants: Member[]; // Ekipa
}