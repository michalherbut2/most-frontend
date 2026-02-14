"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { gamesApi } from "../api/gamesApi";
import { CoinFlipResult } from "../types";
import { useFlipCoin } from "../api/queries";

export const CoinFlip: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [result, setResult] = useState<CoinFlipResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const { mutateAsync: flipCoin, isPending: isFlipping } = useFlipCoin();


  const handleFlip = async () => {
    if (betAmount < 1) {
      alert("Minimum bet is 1 points");
      return;
    }

    setShowResult(false);
    setResult(null);

    try {
      const flipResult = await flipCoin(betAmount);
      
      // Show coin flipping animation
      setTimeout(() => {
        setResult(flipResult.data);
        setShowResult(true);
      }, 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to flip coin");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
          🪙 Coin Flip
        </h2>
        <p className="text-gray-700">Double or nothing! 50/50 chance to win</p>
      </div>

      {/* Coin Animation */}
      <div className="relative h-64 flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div
              key="flipping"
              className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl flex items-center justify-center text-white text-6xl"
              animate={{
                rotateY: [0, 1800],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            >
              💰
            </motion.div>
          ) : showResult && result ? (
            <motion.div
              key="result"
              initial={{ scale: 0, rotateY: 0 }}
              animate={{ scale: 1, rotateY: 360 }}
              className={`w-40 h-40 rounded-full ${
                result.won
                  ? "bg-gradient-to-br from-green-400 to-green-600"
                  : "bg-gradient-to-br from-red-400 to-red-600"
              } shadow-2xl flex items-center justify-center text-white`}
            >
              <div className="text-center">
                <div className="text-6xl mb-2">{result.won ? "😄" : "😢"}</div>
                <div className="text-2xl font-bold">{result.outcome}</div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-xl flex items-center justify-center text-white text-6xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              💰
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-6 rounded-lg ${
              result.won
                ? "bg-green-100 border-2 border-green-500"
                : "bg-red-100 border-2 border-red-500"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-2 ${
                result.won ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.won ? "🎉 You Won!" : "😢 You Lost"}
            </h3>
            <p className="text-lg">
              Bet: <span className="font-bold">{result.amountBet} points</span>
            </p>
            <p
              className={`text-xl font-bold ${
                result.won ? "text-green-700" : "text-red-700"
              }`}
            >
              Result: {result.result > 0 ? "+" : ""}
              {result.result} points
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bet Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bet Amount
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={e => setBetAmount(Number(e.target.value))}
              min="10"
              step="10"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
              disabled={isFlipping}
            />
            <button
              onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}
              className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-bold"
              disabled={isFlipping}
            >
              -
            </button>
            <button
              onClick={() => setBetAmount(prev => prev + 10)}
              className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-bold"
              disabled={isFlipping}
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Win:{" "}
            <span className="font-bold text-green-600">
              {betAmount * 2} points
            </span>{" "}
            | Lose:{" "}
            <span className="font-bold text-red-600">{betAmount} points</span>
          </p>
        </div>

        <button
          onClick={handleFlip}
          disabled={isFlipping || betAmount < 10}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-lg transform hover:scale-105"
        >
          {isFlipping ? "Flipping..." : `Flip Coin (${betAmount} pts)`}
        </button>

        <div className="text-center text-sm text-gray-600">
          <p>50% chance to win | 50% chance to lose</p>
          <p className="font-semibold mt-1">
            Win = Double your bet | Lose = Lose your bet
          </p>
        </div>
      </div>
    </div>
  );
};
