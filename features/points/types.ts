// Odpowiednik LeaderboardEntry.java
export interface LeaderboardEntry {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  points: number;
}

// Odpowiednik TransactionHistoryDto.java
export interface PointTransaction {
  id: string; // UUID to string w JS
  amount: number;
  type: 'MANUAL_AWARD' | 'BET_ENTRY' | 'BET_WIN' | 'TASK_COMPLETION';
  description: string;
  createdAt: string; // Data przychodzi jako ISO String
}

// Do wysyłania nagród (dla Admina)
export interface AwardPointsRequest {
  userId: string;
  amount: number;
  reason: string;
}