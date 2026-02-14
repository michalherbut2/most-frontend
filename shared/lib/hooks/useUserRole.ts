'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useMemo } from 'react';

export function useUserRole() {
  const { user, isAuthenticated } = useAuth();

  const roles = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        isAdmin: false,
        isLeader: false,
        isMember: false,
        isGuest: true,
        role: 'GUEST' as const,
      };
    }

    return {
      isAdmin: user.role === 'ADMIN',
      isLeader: user.role === 'LEADER',
      isUser: user.role === 'USER',
      isGuest: false,
      role: user.role,
    };
  }, [user, isAuthenticated]);

  return roles;
}