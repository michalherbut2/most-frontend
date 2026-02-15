"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useForm } from "react-hook-form";
import {
  useMyHistory,
  useLeaderboard,
  useUpdateProfile,
  PointsTransactionDto,
  LeaderboardEntry,
} from "@/features/profile/api/queries";
import {
  User as UserIcon,
  Trophy,
  History,
  Settings,
  Loader,
  Star,
  TrendingUp,
  Medal,
  Save,
} from "lucide-react";

// ─── Rank calculation ────────────────────────────────────────────────────────

function getRank(points: number): { label: string; color: string; bg: string } {
  if (points >= 100) return { label: "Mistrz", color: "text-yellow-700", bg: "bg-yellow-100" };
  if (points >= 50) return { label: "Lider", color: "text-purple-700", bg: "bg-purple-100" };
  if (points >= 20) return { label: "Pomocnik", color: "text-blue-700", bg: "bg-blue-100" };
  if (points >= 5) return { label: "Aktywny", color: "text-green-700", bg: "bg-green-100" };
  return { label: "Nowicjusz", color: "text-gray-700", bg: "bg-gray-100" };
}

// ─── Tab IDs ─────────────────────────────────────────────────────────────────

type Tab = "history" | "leaderboard" | "settings";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "history", label: "Historia", icon: History },
  { id: "leaderboard", label: "Ranking", icon: Trophy },
  { id: "settings", label: "Ustawienia", icon: Settings },
];

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("history");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-[#2573a6]" />
      </div>
    );
  }

  if (!user) return null;

  const rank = getRank(user.points);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2573a6] via-[#1e5f8a] to-[#163f5c] p-6 md:p-8 text-white shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.firstName}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border-4 border-white/10 shadow-lg">
              <span className="text-3xl md:text-4xl font-bold">
                {user.firstName.charAt(0)}
              </span>
            </div>
          )}

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-white/70 text-sm mt-1">{user.email}</p>

            {/* Rank Badge */}
            <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${rank.bg} ${rank.color}`}>
              <Star className="w-3.5 h-3.5" />
              {rank.label}
            </span>
          </div>

          {/* Points Counter */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
            <Trophy className="w-6 h-6 text-yellow-300 mb-1" />
            <span className="text-3xl md:text-4xl font-black tabular-nums">
              {user.points}
            </span>
            <span className="text-xs text-white/60 uppercase tracking-wider">
              punktów
            </span>
          </div>
        </div>
      </div>

      {/* ─── Tabs Bar ────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 rounded-xl p-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Tab Content ─────────────────────────────────────────── */}
      {activeTab === "history" && <HistoryTab />}
      {activeTab === "leaderboard" && <LeaderboardTab currentUserId={user.id} />}
      {activeTab === "settings" && (
        <SettingsTab
          defaultFirstName={user.firstName}
          defaultLastName={user.lastName}
        />
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HISTORY TAB
// ═════════════════════════════════════════════════════════════════════════════

function HistoryTab() {
  const { data: history, isLoading, isError } = useMyHistory();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-7 h-7 animate-spin text-[#2573a6]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Nie udało się pobrać historii.
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
        <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Brak transakcji</h3>
        <p className="text-sm text-gray-500">
          Twoja historia punktów pojawi się tutaj.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Data
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Opis
              </th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">
                Punkty
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((tx: PointsTransactionDto) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(tx.createdAt).toLocaleDateString("pl-PL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {tx.description}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  <span
                    className={
                      tx.amount > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount} pkt
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LEADERBOARD TAB
// ═════════════════════════════════════════════════════════════════════════════

function LeaderboardTab({ currentUserId }: { currentUserId: string }) {
  const { data: entries, isLoading, isError } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-7 h-7 animate-spin text-[#2573a6]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Nie udało się pobrać rankingu.
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Brak danych rankingowych.</p>
      </div>
    );
  }

  const medalColors: Record<number, string> = {
    1: "text-yellow-500",
    2: "text-gray-400",
    3: "text-amber-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-center px-3 py-3 font-semibold text-gray-600 w-16">
                #
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Użytkownik
              </th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">
                Punkty
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry: LeaderboardEntry) => {
              const isMe = entry.userId === currentUserId;
              return (
                <tr
                  key={entry.userId}
                  className={`transition-colors ${isMe
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                    }`}
                >
                  {/* Rank */}
                  <td className="px-3 py-3 text-center">
                    {entry.rank <= 3 ? (
                      <Medal
                        className={`w-5 h-5 mx-auto ${medalColors[entry.rank] ?? "text-gray-400"
                          }`}
                      />
                    ) : (
                      <span className="font-semibold text-gray-500">
                        {entry.rank}
                      </span>
                    )}
                  </td>

                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {entry.profileImage ? (
                        <img
                          src={entry.profileImage}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-purple-700">
                            {entry.firstName.charAt(0)}
                            {entry.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span
                        className={`truncate ${isMe
                            ? "font-bold text-blue-800"
                            : "font-medium text-gray-900"
                          }`}
                      >
                        {entry.firstName} {entry.lastName}
                        {isMe && (
                          <span className="ml-2 text-[10px] bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full uppercase font-semibold">
                            Ty
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-mono font-semibold tabular-nums ${isMe ? "text-blue-700" : "text-gray-700"
                        }`}
                    >
                      {entry.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═════════════════════════════════════════════════════════════════════════════

function SettingsTab({
  defaultFirstName,
  defaultLastName,
}: {
  defaultFirstName: string;
  defaultLastName: string;
}) {
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
    },
  });

  const onSubmit = (data: { firstName: string; lastName: string }) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 max-w-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <Settings className="w-5 h-5 text-gray-500" />
        Edycja profilu
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imię
          </label>
          <input
            {...register("firstName", { required: "Imię jest wymagane" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#2573a6] focus:border-transparent outline-none"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nazwisko
          </label>
          <input
            {...register("lastName", { required: "Nazwisko jest wymagane" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#2573a6] focus:border-transparent outline-none"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#2573a6] rounded-xl hover:bg-[#1e5f8a] transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Zapisz zmiany
          </button>
        </div>
      </form>
    </div>
  );
}