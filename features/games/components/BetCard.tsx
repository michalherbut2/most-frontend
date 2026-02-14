"use client";

import React, { useState } from "react";
import { Bet, BetStatus } from "../types";
import { useCancelBet, usePlaceBet, useResolveBet } from "../api/queries";

interface BetCardProps {
  bet: Bet;
  currentUserId: string;
  isAdmin: boolean;
}

export const BetCard: React.FC<BetCardProps> = ({
  bet,
  currentUserId,
  isAdmin,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [betAmount, setBetAmount] = useState<number>(10);
  const [resolvingOption, setResolvingOption] = useState<string>("");

  const isCreator = bet.creatorId === currentUserId;
  const canResolve =
    ((isCreator || isAdmin) && bet.status === BetStatus.OPEN) ||
    bet.status === BetStatus.LOCKED;
  const canBet =
    bet.status === BetStatus.OPEN &&
    !bet.userEntry &&
    new Date(bet.bettingDeadline) > new Date();

  const getTimeRemaining = () => {
    const deadline = new Date(bet.bettingDeadline);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const { mutate: placeBet, isPending } = usePlaceBet();

  const handlePlaceBet = () => {
    if (!selectedOption || betAmount < 1) return;

    try {
      placeBet({
        betId: bet.id,
        selectedOption,
        amount: betAmount,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to place bet");
    }
  };

  
  const { mutate: resolveBet, isPending: isResolving } = useResolveBet()
  const betId = bet.id;


  const handleResolve = async (winningOption: string) => {
    if (
      !confirm(
        `Are you sure you want to resolve this bet with "${winningOption}" as the winning option?`,
      )
    ) {
      return;
    }


    setResolvingOption(winningOption);
    try {
      resolveBet({betId, winningOption});
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to resolve bet");
    } finally {
      setResolvingOption("");
    }
  };

  const { mutate: cancelBet } = useCancelBet();

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this bet? All participants will be refunded.",
      )
    ) {
      return;
    }

    try {
      cancelBet(betId);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to cancel bet");
    }
  };

  const getStatusColor = () => {
    switch (bet.status) {
      case BetStatus.OPEN:
        return "bg-green-100 text-green-800";
      case BetStatus.LOCKED:
        return "bg-yellow-100 text-yellow-800";
      case BetStatus.RESOLVED:
        return "bg-blue-100 text-blue-800";
      case BetStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex-1">{bet.topic}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}
        >
          {bet.status}
        </span>
      </div>

      {/* Pool Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Pool</p>
            <p className="text-2xl font-bold text-purple-600">
              {bet.totalPool} pts
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Entries</p>
            <p className="text-2xl font-bold text-pink-600">
              {bet.totalEntries}
            </p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {bet.options.map(option => {
          const pool = bet.poolByOption[option] || 0;
          const entries = bet.entriesByOption[option] || 0;
          const percentage =
            bet.totalPool > 0 ? ((pool / bet.totalPool) * 100).toFixed(1) : "0";
          const isWinning = bet.winningOption === option;
          const isUserChoice = bet.userEntry?.selectedOption === option;

          return (
            <div
              key={option}
              className={`border rounded-lg p-3 transition-all ${
                isWinning
                  ? "bg-green-50 border-green-500 border-2"
                  : isUserChoice
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">
                  {option}
                  {isWinning && " 🏆"}
                  {isUserChoice && " ⭐"}
                </span>
                <span className="text-sm text-gray-600">
                  {pool} pts ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isWinning ? "bg-green-500" : "bg-purple-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {entries} {entries === 1 ? "entry" : "entries"}
              </p>

              {/* Resolve button for creator/admin */}
              {canResolve && (
                <button
                  onClick={() => handleResolve(option)}
                  disabled={isResolving}
                  className="mt-2 w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  {isResolving && resolvingOption === option
                    ? "Resolving..."
                    : "Set as Winner"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* User Entry Info */}
      {bet.userEntry && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm font-semibold text-blue-900">Your Bet</p>
          <p className="text-sm text-blue-700">
            {bet.userEntry.amount} pts on &quot;{bet.userEntry.selectedOption}&quot;
          </p>
          {bet.userEntry.settled && bet.userEntry.winnings !== undefined && (
            <p className="text-sm font-bold text-blue-900 mt-1">
              {bet.userEntry.winnings > 0 ? (
                <>Won: {bet.userEntry.winnings} pts 🎉</>
              ) : (
                <>Lost 😢</>
              )}
            </p>
          )}
        </div>
      )}

      {/* Place Bet Form */}
      {canBet && (
        <div className="border-t pt-4 space-y-3">
          <select
            value={selectedOption}
            onChange={e => setSelectedOption(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select your choice</option>
            {bet.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
            min="1"
            placeholder="Bet amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <button
            onClick={handlePlaceBet}
            disabled={!selectedOption || betAmount < 1 || isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? "Placing..." : `Place Bet (${betAmount} pts)`}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-600">
        <span>⏰ {getTimeRemaining()} remaining</span>
        {isAdmin &&
          bet.status !== BetStatus.RESOLVED &&
          bet.status !== BetStatus.CANCELLED && (
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Cancel Bet
            </button>
          )}
      </div>
    </div>
  );
};
