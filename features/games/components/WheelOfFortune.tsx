"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WheelSpinResponse } from "../types";
import { useSpinWheel, useWheelStatus } from "../api/queries";

export const WheelOfFortune: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);
  const [prize, setPrize] = useState<number>(0);

  const prizes = [10, 50, 100, 10, 50, 10, 250, 10, 50, 10, 100, 500];


  const { data: wheelStatus } = useWheelStatus();
  const { mutateAsync: spinWheel } = useSpinWheel();

  const handleSpin = async () => {
    if (!wheelStatus?.canSpinAgain || isSpinning) return;

    setIsSpinning(true);
    setShowPrize(false);

    try {
      const result = await spinWheel();

      // Calculate rotation to land on prize
      const prizeIndex = prizes.findIndex(p => p === result.prizeAmount);
      const segmentAngle = 360 / prizes.length;
      const targetRotation =
        360 * 5 + prizeIndex * segmentAngle + segmentAngle / 2;

      setRotation(targetRotation);

      setTimeout(() => {
        setPrize(result.prizeAmount);
        setShowPrize(true);
        setIsSpinning(false);
      }, 3000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to spin wheel");
      setIsSpinning(false);
    }
  };

  const getTimeUntilNextSpin = () => {
    if (!wheelStatus || wheelStatus.canSpinAgain) return null;

    const next = new Date(wheelStatus.nextSpinAvailable);
    const now = new Date();
    const diff = next.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-2">
          🎡 Wheel of Fortune
        </h2>
        <p className="text-gray-700">
          Spin once every 24 hours for a chance to win points!
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative max-w-md mx-auto">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-600 drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <motion.div
          className="relative w-full aspect-square"
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="absolute inset-0 rounded-full shadow-2xl overflow-hidden border-8 border-yellow-400">
            {prizes.map((prizeAmount, index) => {
              const segmentAngle = 360 / prizes.length;
              const rotation = index * segmentAngle;

              return (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  <div
                    className={`absolute top-0 left-1/2 origin-bottom h-1/2 w-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[260px] ${
                      index % 2 === 0
                        ? "border-b-yellow-400"
                        : "border-b-orange-400"
                    }`}
                    style={{
                      transform: `translateX(-50%) rotate(${segmentAngle / 2}deg)`,
                    }}
                  >
                    <div
                      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg"
                      style={{ transform: "translateX(-50%) rotate(90deg)" }}
                    >
                      {prizeAmount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full shadow-lg border-4 border-white flex items-center justify-center">
            <span className="text-white font-bold text-2xl">✨</span>
          </div>
        </motion.div>
      </div>

      {/* Prize Display */}
      <AnimatePresence>
        {showPrize && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-8 bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You Won!</h3>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
              {prize} Points
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin Button */}
      <div className="mt-8 text-center">
        {wheelStatus?.canSpinAgain ? (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-8 rounded-full text-xl hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105"
          >
            {isSpinning ? "Spinning..." : "SPIN THE WHEEL!"}
          </button>
        ) : (
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-700 font-semibold">Already spun today!</p>
            <p className="text-sm text-gray-600 mt-1">
              Next spin available in:{" "}
              <span className="font-bold">{getTimeUntilNextSpin()}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
