'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialLoginButtons } from './SocialLoginButtons';

export interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = '/learn' }: LoginFormProps) {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('password', password);
      formData.set('flow', 'signIn');

      await signIn('password', formData);
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">로그인</h1>
          <p className="text-gray-600 dark:text-gray-400">Study Python (Korean)에 오신 것을 환영합니다!</p>
        </div>

        {error && (
          <div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              이메일
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">또는</span>
            </div>
          </div>

          <div className="mt-6">
            <SocialLoginButtons callbackUrl={callbackUrl} />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="font-semibold text-green-600 hover:text-green-500">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
