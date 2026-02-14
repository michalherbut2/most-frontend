"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { 
  useNotifications, 
  useUnreadNotificationsCount, 
  useMarkNotificationRead,
  useMarkAllNotificationsRead 
} from "@/features/intentions/api/queries";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hooki API
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // Zamykanie po kliknięciu poza
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) markRead.mutate(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* IKONA DZWONKA */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Powiadomienia</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllRead.mutate()}
                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3 h-3" /> Oznacz wszystkie
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Ładowanie...</div>
            ) : notifications?.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2 opacity-30">🔕</div>
                <p className="text-gray-500 text-sm">Brak nowych powiadomień</p>
              </div>
            ) : (
              notifications?.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.isRead)}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !n.isRead ? "bg-purple-50/40" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                       n.type === 'SUCCESS' ? 'bg-green-500' : 
                       n.type === 'WARNING' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: pl })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};