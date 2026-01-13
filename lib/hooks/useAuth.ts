'use client';

import { useConvexAuth } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface UseAuthReturn {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  signOutAndRedirect: (callbackUrl?: string) => Promise<void>;
}

/**
 * Hook for using authentication in components
 * (컴포넌트에서 인증을 사용하기 위한 훅)
 *
 * Convex Auth 기반으로 구현됨
 */
export function useAuth(): UseAuthReturn {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  // 사용자 계정 정보 조회 (users 테이블 + profiles 테이블 통합)
  const accountInfo = useQuery(
    api.users.getCurrentUserWithAccount,
    isAuthenticated ? {} : 'skip'
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const signOutAndRedirect = useCallback(
    async (callbackUrl = '/') => {
      await signOut();
      router.push(callbackUrl);
    },
    [signOut, router]
  );

  return {
    user: accountInfo
      ? {
          id: accountInfo.userId,
          name: accountInfo.name,
          email: accountInfo.email,
          image: accountInfo.image,
        }
      : null,
    isLoading,
    isAuthenticated,
    signOut: handleSignOut,
    signOutAndRedirect,
  };
}
