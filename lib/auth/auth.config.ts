/**
 * NextAuth.js Configuration (NextAuth.js 설정)
 *
 * Configures authentication providers and callbacks.
 */

import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { getStorage } from '@/lib/storage';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),

    // Credentials Provider (Email/Password)
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const storage = getStorage();
          const user = await storage.findUserByEmail(email);

          if (!user || !user.passwordHash) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const storage = getStorage();
          const existingUser = await storage.findUserByEmail(user.email ?? '');

          if (!existingUser && user.email) {
            // Create new user for Google sign-in
            const newUser = {
              id: user.id ?? crypto.randomUUID(),
              email: user.email,
              name: user.name ?? user.email.split('@')[0],
              image: user.image ?? undefined,
              provider: 'google' as const,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await storage.saveUser(newUser);
          }
        } catch (error) {
          console.error('Error saving Google user:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider ?? 'credentials';
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { provider?: string }).provider = token.provider as string;
      }
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute =
        nextUrl.pathname.startsWith('/learn') || nextUrl.pathname.startsWith('/profile');
      const isOnAuthRoute =
        nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isOnAuthRoute && isLoggedIn) {
        return Response.redirect(new URL('/learn', nextUrl));
      }

      return true;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
