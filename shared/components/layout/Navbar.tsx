"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Music,
  Trophy,
  Users,
  LogIn,
  LogOut,
  User,
  Shield,
  Sparkles,
  Gamepad,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUserRole } from "@/shared/lib/hooks/useUserRole";
import { cn, formatPoints } from "@/shared/lib/utils";
import Image from "next/image";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  publicAccess?: boolean;
}

const navLinks: NavLink[] = [
  { href: "/calendar", label: "Calendar", icon: Calendar, publicAccess: true },
  { href: "/songs", label: "Songs", icon: Music, publicAccess: true },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    publicAccess: true,
  },
  { href: "/team", label: "Team", icon: Users, publicAccess: true },
  { href: "/games", label: "Games", icon: Gamepad, publicAccess: false },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin } = useUserRole();

  // Don't show navbar on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[#2573a6] transition-opacity hover:opacity-80"
          >
            <Sparkles className="h-6 w-6" />
            <span>MOST</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#2573a6] text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Auth Section */}
          <div className="flex items-center gap-3">
            {/* Admin Panel Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  pathname?.startsWith("/admin")
                    ? "bg-purple-100 text-purple-700"
                    : "text-slate-600 hover:bg-purple-50 hover:text-purple-700",
                )}
                title="Admin Panel"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {isAuthenticated && user ? (
              <>
                {/* Points Badge */}
                <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
                  <Trophy className="h-4 w-4" />
                  <span>{formatPoints(user.points)}</span>
                </div>

                {/* Notifications Badge */}
                <NotificationBell />

                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      pathname === "/profile"
                        ? "bg-[#2573a6] text-white"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.firstName}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="hidden md:inline">{user.firstName}</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              /* Guest View - Login Button */
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-[#2573a6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1e5f8a]"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
