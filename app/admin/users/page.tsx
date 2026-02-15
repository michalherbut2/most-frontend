"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUserRole } from "@/shared/lib/hooks/useUserRole";
import { useUsers, UserDto } from "@/features/users/api/queries";
import EditUserDialog from "@/features/users/components/EditUserDialog";
import {
    Users,
    Search,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Shield,
    Loader,
    AlertTriangle,
} from "lucide-react";

// ─── Role Badge ──────────────────────────────────────────────────────────────

const roleBadge: Record<string, { bg: string; text: string; label: string }> = {
    ADMIN: { bg: "bg-purple-100", text: "text-purple-700", label: "Admin" },
    LEADER: { bg: "bg-blue-100", text: "text-blue-700", label: "Lider" },
    USER: { bg: "bg-gray-100", text: "text-gray-700", label: "Użytkownik" },
};

export default function AdminUsersPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { isAdmin } = useUserRole();

    const [page, setPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [editingUser, setEditingUser] = useState<UserDto | null>(null);

    // Debounce search input (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(0); // reset to first page on new search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Redirect if not admin
    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isAdmin)) {
            router.push("/");
        }
    }, [isAuthenticated, isAdmin, authLoading, router]);

    const { data, isLoading, isError, refetch } = useUsers(page, debouncedSearch);

    if (authLoading || !isAdmin) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-200">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    Zarządzanie Użytkownikami
                </h1>
                <p className="text-gray-500 mt-1 ml-[52px]">
                    Przeglądaj, wyszukuj i edytuj konta użytkowników
                </p>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Szukaj po imieniu, nazwisku lub email..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                </div>

                {/* Pagination info + controls */}
                {data && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                        <span>
                            Strona {data.number + 1} z {data.totalPages || 1}
                            {" "}({data.totalElements} użytkowników)
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={data.first}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={data.last}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-16">
                    <Loader className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-800 mb-1">
                        Nie udało się pobrać listy użytkowników
                    </h3>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg px-4 py-2 hover:bg-red-200 transition-colors"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            )}

            {/* Table */}
            {!isLoading && !isError && data && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                                        Użytkownik
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                                        Email
                                    </th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-600">
                                        Rola
                                    </th>
                                    <th className="text-right px-4 py-3 font-semibold text-gray-600">
                                        Punkty
                                    </th>
                                    <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                                        Dołączył
                                    </th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-600 w-16">
                                        Akcje
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.content.map((u) => {
                                    const badge = roleBadge[u.role] ?? roleBadge.USER;
                                    return (
                                        <tr
                                            key={u.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Avatar + Name */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {u.profileImage ? (
                                                        <img
                                                            src={u.profileImage}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs font-bold text-purple-700">
                                                                {u.firstName.charAt(0)}
                                                                {u.lastName.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {u.firstName} {u.lastName}
                                                        </p>
                                                        {/* Show email inline on mobile */}
                                                        <p className="text-xs text-gray-500 truncate md:hidden">
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email — desktop */}
                                            <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                                                {u.email}
                                            </td>

                                            {/* Role Badge */}
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                >
                                                    {u.role === "ADMIN" && (
                                                        <Shield className="w-3 h-3" />
                                                    )}
                                                    {badge.label}
                                                </span>
                                            </td>

                                            {/* Points */}
                                            <td className="px-4 py-3 text-right font-mono text-gray-700 tabular-nums">
                                                {u.points}
                                            </td>

                                            {/* Joined date — hidden on mobile */}
                                            <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">
                                                {u.createdAt
                                                    ? new Date(u.createdAt).toLocaleDateString("pl-PL")
                                                    : "—"}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => setEditingUser(u)}
                                                    className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-gray-500 hover:bg-purple-100 hover:text-purple-700 transition-colors"
                                                    title="Edytuj"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty search result */}
                    {data.content.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                Brak wyników
                            </h3>
                            <p className="text-sm text-gray-500">
                                Nie znaleziono użytkowników pasujących do &quot;{debouncedSearch}&quot;
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Dialog */}
            {editingUser && (
                <EditUserDialog
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    );
}
