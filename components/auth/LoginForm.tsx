'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth, useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Mail, Lock, Loader2, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialLoginButtons } from './SocialLoginButtons';

export interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = '/learn' }: LoginFormProps) {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 계정 확인 및 비밀번호 재설정 상태
  const [showAccountCheck, setShowAccountCheck] = useState(false);
  const [checkEmail, setCheckEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [accountCheckResult, setAccountCheckResult] = useState<{
    exists: boolean;
    providers: string[];
    maskedEmail?: string;
  } | null>(null);

  // 비밀번호 재설정 상태
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Convex hooks
  const accountInfo = useQuery(
    api.users.checkAccountByEmail,
    checkEmail ? { email: checkEmail } : 'skip'
  );
  const resetPassword = useAction(api.users.resetPassword);

  // 이미 로그인된 사용자는 callbackUrl로 리다이렉트
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, authLoading, router, callbackUrl]);

  // 계정 정보 조회 결과 업데이트
  useEffect(() => {
    if (accountInfo !== undefined && isChecking) {
      setAccountCheckResult(accountInfo);
      setIsChecking(false);
    }
  }, [accountInfo, isChecking]);

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

  // 계정 확인 핸들러
  const handleCheckAccount = () => {
    if (!checkEmail || !checkEmail.includes('@')) {
      return;
    }
    setIsChecking(true);
    setAccountCheckResult(null);
  };

  // 계정 확인 모달 열기 (현재 입력된 이메일로)
  const openAccountCheck = () => {
    setCheckEmail(email);
    setShowAccountCheck(true);
    setAccountCheckResult(null);
    setShowResetPassword(false);
    setResetSuccess(false);
  };

  // 비밀번호 재설정 핸들러
  const handleResetPassword = async () => {
    setResetError('');

    if (!newPassword || !confirmNewPassword) {
      setResetError('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword({ email: checkEmail, newPassword });
      setResetSuccess(true);
      setShowResetPassword(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Reset password error:', err);
      if (err instanceof Error) {
        setResetError(err.message);
      } else {
        setResetError('비밀번호 재설정에 실패했습니다.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  // 모달 닫기
  const closeAccountCheck = () => {
    setShowAccountCheck(false);
    setAccountCheckResult(null);
    setShowResetPassword(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError('');
    setResetSuccess(false);
  };

  // Provider 텍스트 변환
  const getProviderText = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'password':
        return '이메일/비밀번호';
      default:
        return provider;
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
            <p>{error}</p>
            <button
              type="button"
              onClick={openAccountCheck}
              className="mt-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 underline"
            >
              <HelpCircle className="w-4 h-4" />
              계정 확인하기
            </button>
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

      {/* 계정 확인 모달 */}
      {showAccountCheck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              계정 확인
            </h2>

            {/* 이메일 입력 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                이메일 주소
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={checkEmail}
                  onChange={(e) => {
                    setCheckEmail(e.target.value);
                    setAccountCheckResult(null);
                    setResetSuccess(false);
                  }}
                  placeholder="확인할 이메일 주소"
                  disabled={isChecking}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleCheckAccount}
                  disabled={isChecking || !checkEmail.includes('@')}
                  size="sm"
                >
                  {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : '확인'}
                </Button>
              </div>
            </div>

            {/* 확인 결과 */}
            {accountCheckResult && (
              <div className="mb-4">
                {accountCheckResult.exists ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-300">
                          계정이 존재합니다
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          이메일: {accountCheckResult.maskedEmail}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          가입 방식: {accountCheckResult.providers.map(getProviderText).join(', ')}
                        </p>

                        {/* Google 로그인 안내 */}
                        {accountCheckResult.providers.includes('google') && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                            ✓ Google 로그인을 사용해주세요
                          </p>
                        )}

                        {/* 이메일 로그인 - 비밀번호 재설정 버튼 */}
                        {accountCheckResult.providers.includes('password') && !showResetPassword && !resetSuccess && (
                          <button
                            type="button"
                            onClick={() => setShowResetPassword(true)}
                            className="mt-3 text-sm text-green-600 hover:text-green-700 dark:text-green-400 underline"
                          >
                            비밀번호 재설정하기
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-300">
                          계정을 찾을 수 없습니다
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                          해당 이메일로 가입된 계정이 없습니다.
                        </p>
                        <Link
                          href="/signup"
                          className="inline-block mt-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 underline"
                          onClick={closeAccountCheck}
                        >
                          회원가입하기
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 비밀번호 재설정 성공 메시지 */}
            {resetSuccess && (
              <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      비밀번호가 재설정되었습니다
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      새 비밀번호로 로그인해주세요.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 비밀번호 재설정 폼 */}
            {showResetPassword && (
              <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  새 비밀번호 설정
                </h3>

                {resetError && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                    {resetError}
                  </div>
                )}

                <div className="space-y-3">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 (최소 6자)"
                    disabled={isResetting}
                  />
                  <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="새 비밀번호 확인"
                    disabled={isResetting}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowResetPassword(false);
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setResetError('');
                      }}
                      disabled={isResetting}
                      size="sm"
                    >
                      취소
                    </Button>
                    <Button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isResetting}
                      size="sm"
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          처리 중...
                        </>
                      ) : (
                        '비밀번호 변경'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 닫기 버튼 */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeAccountCheck}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
