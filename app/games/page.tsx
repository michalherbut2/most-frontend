"use client";

import React, { useState } from "react";
import { BetCard } from "@/features/games/components/BetCard";
import { CreateBetForm } from "@/features/games/components/CreateBetForm";
import { WheelOfFortune } from "@/features/games/components/WheelOfFortune";
import { CoinFlip } from "@/features/games/components/CoinFlip";
import { useActiveBets, useMyBets, useSettledBets } from "@/features/games/api/queries";
import { Loader } from "lucide-react";
import { useAuth, useUserRole } from "@/features/auth/hooks/useAuth";

type TabType = "active-bets" | "my-bets" | "completed-bets" | "create-bet" | "arcade";

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("active-bets");
  // const [activeBets, setActiveBets] = useState<Bet[]>([]);
  // const [myBets, setMyBets] = useState<Bet[]>([]);
  
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "active-bets", label: "Active Bets", icon: "🎲" },
    { id: "my-bets", label: "My Bets", icon: "📊" },
    { id: "completed-bets", label: "Completed", icon: "🏁" }, // Nowa zakładka
    { id: "create-bet", label: "Create Bet", icon: "➕" },
    { id: "arcade", label: "Arcade Games", icon: "🎮" },
  ];

  const { user } = useAuth();
  const { isAdmin } = useUserRole();

  const { data: activeBets, isLoading: loadingActive } = useActiveBets();
  const { data: myBets, isLoading: loadingMy } = useMyBets();
  const { data: settledBets, isLoading: loadingSettled } = useSettledBets(); // Pobieranie zakończonych
  
  const isLoading = loadingActive || loadingMy || loadingSettled;
  
  if (isLoading) return <Loader />;
  // if (activeBets?.length === 0) return <div>Brak aktywnych zakładów. Stwórz jakiś!</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                🎰 Entertainment Hub
              </h1>
              <p className="text-gray-600 mt-2">
                Games, Betting & Daily Rewards
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg px-6 py-3">
              <p className="text-sm text-gray-600">Your Balance</p>
              <p className="text-2xl font-bold text-purple-600">1,250 pts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-b-4 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Bets Tab */}
        {activeTab === "active-bets" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Bets</h2>
              <p className="text-gray-600">
                Place your bets and test your predictions
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-gray-600 mt-4">Loading bets...</p>
              </div>
            ) : activeBets?.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Active Bets
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to create a bet!
                </p>
                <button
                  onClick={() => setActiveTab("create-bet")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Create Bet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBets?.map(bet => (
                  <BetCard
                    key={bet.id}
                    bet={bet}
                    currentUserId={user.id}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Bets Tab */}
        {activeTab === "my-bets" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Bets</h2>
              <p className="text-gray-600">
                Track your betting history and results
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-gray-600 mt-4">Loading your bets...</p>
              </div>
            ) : myBets?.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Bets Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start betting to see your history here
                </p>
                <button
                  onClick={() => setActiveTab("active-bets")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Browse Active Bets
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBets?.map(bet => (
                  <BetCard
                    key={bet.id}
                    bet={bet}
                    currentUserId={user.id}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 👇 4. NOWA ZAKŁADKA: Completed Bets */}
        {activeTab === "completed-bets" && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Completed Bets</h2>
              <p className="text-gray-600">Past results and outcomes</p>
            </div>

            {settledBets?.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                <div className="text-6xl mb-4 opacity-50">🏁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No History</h3>
                <p className="text-gray-500">No bets have been settled yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settledBets?.map(bet => (
                  <div key={bet.id} className="opacity-90 hover:opacity-100 transition-opacity">
                    {/* Reużywamy BetCard, ale można tu przekazać props isCompleted jeśli karta ma wyglądać inaczej */}
                    <BetCard 
                      bet={bet} 
                      currentUserId={user?.id} 
                      isAdmin={isAdmin} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Bet Tab */}
        {activeTab === "create-bet" && (
          <div className="max-w-3xl mx-auto">
            <CreateBetForm
              onSuccess={() => {
                setActiveTab("active-bets");
              }}
            />
          </div>
        )}

        {/* Arcade Tab */}
        {activeTab === "arcade" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Arcade Games</h2>
              <p className="text-gray-600">
                Daily rewards and luck-based games
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WheelOfFortune />
              <CoinFlip />
            </div>

            {/* Game Rules */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                How to Play
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">
                    🎡 Wheel of Fortune
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Spin once every 24 hours</li>
                    <li>• Free daily bonus</li>
                    <li>• Prizes: 10-500 points</li>
                    <li>• Higher prizes are rarer</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">
                    🪙 Coin Flip
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bet any amount (min 10 pts)</li>
                    <li>• 50/50 chance to win</li>
                    <li>• Win: Get double your bet</li>
                    <li>• Lose: Lose your bet</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
