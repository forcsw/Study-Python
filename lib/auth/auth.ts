/**
 * NextAuth.js Main Export (NextAuth.js 메인 내보내기)
 *
 * Exports auth handlers and utilities.
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
