'use client';

import { useState } from 'react';
import { useUserRole } from '@/features/auth/hooks/useAuth';
import { useUsersList, useAwardPoints } from '../api';
import { Gift, Search, X, CheckCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export function AwardPointsWidget() {
  const { isAdmin, isLeader } = useUserRole(); // Twój hook sprawdzający role
  const [isOpen, setIsOpen] = useState(false);

  // Jeśli nie jesteś szefem, nawet nie renderuj tego komponentu
  if (!isAdmin && !isLeader) return null;

  return (
    <>
      {/* 1. KARTA NA DASHBOARDZIE */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Gift size={100} />
        </div>
        
        <h3 className="text-lg font-bold mb-2">Strefa Lidera</h3>
        <p className="text-blue-100 text-sm mb-6 opacity-90">
          Doceniaj zaangażowanie innych. Przyznawaj punkty za aktywność.
        </p>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
        >
          <Gift size={16} />
          Przyznaj Punkty
        </button>
      </div>

      {/* 2. MODAL (Formularz) */}
      {isOpen && (
        <AwardModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

// --- Osobny komponent dla czytelności ---
function AwardModal({ onClose }: { onClose: () => void }) {
  const { data: users } = useUsersList();
  const { mutate: awardPoints, isPending } = useAwardPoints();
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState(10); // Domyślnie 10 pkt
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !amount || !reason) return;

    awardPoints(
      { userId: selectedUserId, amount, reason },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(onClose, 2000); // Zamknij po 2 sek
        },
      }
    );
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-8 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Punkty przyznane!</h3>
          <p className="text-gray-500 mt-2">Ranking został zaktualizowany.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Gift className="text-indigo-600" size={20} />
            Nagrodź użytkownika
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* 1. Wybór użytkownika (Prosty Select) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Komu?</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Wybierz osobę...</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Ilość punktów */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ile punktów?</label>
            <div className="flex gap-2">
              {[10, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={clsx(
                    "flex-1 py-2 text-sm font-medium rounded-lg border transition-all",
                    amount === val 
                      ? "bg-indigo-600 text-white border-indigo-600" 
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  +{val}
                </button>
              ))}
            </div>
            <input 
               type="number"
               value={amount}
               onChange={(e) => setAmount(Number(e.target.value))}
               className="w-full mt-2 p-2 text-center border-b border-gray-200 focus:border-indigo-500 outline-none font-bold text-indigo-600"
            />
          </div>

          {/* 3. Powód */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Za co?</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="np. Pomoc przy sprzątaniu salki"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Footer */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending || !selectedUserId}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
              Przyznaj Punkty
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}