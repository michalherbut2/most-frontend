// import { User } from '@/features/auth/types';
// import { Settings, Shield } from 'lucide-react';

// interface Props {
//   user: User;
// }

// export function ProfileHeader({ user }: Props) {
//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
      
//       {/* Avatar */}
//       <div className="w-24 h-24 rounded-full bg-[#2573a6] flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-50 shadow-md">
//         {user.firstName[0]}
//       </div>

//       {/* Info */}
//       <div className="flex-1 text-center md:text-left space-y-1">
//         <h1 className="text-2xl font-bold text-slate-900">
//           {user.firstName} {user.lastName}
//         </h1>
//         <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2">
//           {user.email}
//           {user.role === 'ADMIN' && (
//             <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
//               <Shield size={10} /> ADMIN
//             </span>
//           )}
//         </p>
//       </div>

//       {/* Akcje */}
//       <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
//         <Settings size={16} />
//         Ustawienia
//       </button>

//     </div>
//   );
// }

'use client';

import { User as UserIcon, Mail, Calendar, Shield, Crown, Users } from 'lucide-react';
import { formatDate } from '@/shared/lib/utils';
import type { User } from '@/shared/types/common';
import Image from 'next/image';

interface ProfileHeaderProps {
  user: User;
}

const roleConfig = {
  ADMIN: {
    label: 'Administrator',
    icon: Shield,
    color: 'text-purple-600 bg-purple-50',
  },
  LEADER: {
    label: 'Team Leader',
    icon: Crown,
    color: 'text-yellow-600 bg-yellow-50',
  },
  MEMBER: {
    label: 'Member',
    icon: Users,
    color: 'text-blue-600 bg-blue-50',
  },
  GUEST: {
    label: 'Guest',
    icon: UserIcon,
    color: 'text-slate-600 bg-slate-50',
  },
  USER: {
    label: 'User',
    icon: UserIcon,
    color: 'text-slate-600 bg-slate-50',
  },
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const config = roleConfig[user.role];
  
  const RoleIcon = config.icon;

  return (
    <div className="card">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar Section */}
        <div className="shrink-0">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.firstName}
              className="h-24 w-24 rounded-full border-4 border-slate-100 object-cover shadow-md sm:h-32 sm:w-32"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-100 bg-gradient-to-br from-[#2573a6] to-[#1e5f8a] text-4xl font-bold text-white shadow-md sm:h-32 sm:w-32">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="flex-1 space-y-4">
          {/* Name & Role */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{user.firstName}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
              >
                <RoleIcon className="h-3.5 w-3.5" />
                {config.label}
              </span>
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}