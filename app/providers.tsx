'use client';

import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client Providers (클라이언트 프로바이더)
 *
 * Wraps the application with necessary client-side providers.
 * - ConvexAuthProvider: Convex 인증 및 데이터베이스 연결
 */
export function Providers({ children }: ProvidersProps) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
