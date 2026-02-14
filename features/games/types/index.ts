// src/features/games/types/index.ts

export enum BetStatus {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
}

export interface BetEntry {
  id: string;
  userId: string;
  betId: string;
  amount: number;
  selectedOption: string;
  placedAt: string;
  winnings?: number;
  settled: boolean;
}

export interface Bet {
  id: string;
  creatorId: string;
  topic: string;
  options: string[];
  status: BetStatus;
  bettingDeadline: string;
  resolutionDate: string;
  winningOption?: string;
  createdAt: string;
  resolvedAt?: string;
  totalPool: number;
  poolByOption: Record<string, number>;
  entriesByOption: Record<string, number>;
  totalEntries: number;
  userEntry?: BetEntry;
}

export interface CreateBetRequest {
  topic: string;
  options: string[];
  bettingDeadline: string;
  resolutionDate: string;
}

export interface PlaceBetRequest {
  betId: string;
  selectedOption: string;
  amount: number;
}

export interface WheelSpinResponse {
  prizeAmount: number;
  canSpinAgain: boolean;
  nextSpinAvailable: string;
}

export interface CoinFlipResult {
  won: boolean;
  amountBet: number;
  result: number;
  outcome: 'HEADS' | 'TAILS';
}