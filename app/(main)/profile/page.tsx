'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Trophy, Clock, BookOpen, Calendar, Mail, User, Shield, Trash2, Key } from 'lucide-react';
import { useAuth, useProgress } from '@/lib/hooks';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { TOTAL_LEVELS } from '@/data/levels';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { progress, completedLevels } = useProgress({
    userId: user?.id || 'guest',
  });

  // 계정 정보 가져오기 (로그인 방식, 이메일 포함)
  const accountInfo = useQuery(api.users.getCurrentUserWithAccount);
  const deleteAccount = useMutation(api.users.deleteMyAccount);

  // 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 로그인 방식 표시 텍스트
  const getProviderText = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google 로그인';
      case 'password':
        return '이메일 로그인';
      default:
        return '알 수 없음';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isEmailLogin = accountInfo?.provider === 'password';

  const completionPercentage = Math.round((completedLevels.size / TOTAL_LEVELS) * 100);

  // Format time spent
  const formatTimeSpent = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || '프로필'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-green-600" />
            )}
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {accountInfo?.name || user.name || '사용자'}
            </h1>
            {/* 로그인 방식 표시 */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-300 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                {accountInfo ? getProviderText(accountInfo.provider) : '로딩 중...'}
              </span>
            </div>
            {/* 이메일 표시 */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm">
                {accountInfo?.email || '이메일 없음'}
              </span>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex flex-col items-center bg-orange-100 rounded-xl p-4">
            <Flame className="w-8 h-8 text-orange-500 mb-1" />
            <span className="text-2xl font-bold text-orange-700">{progress.streak}</span>
            <span className="text-xs text-orange-600">연속 학습</span>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-green-600" />}
          label="완료한 레벨"
          value={`${completedLevels.size}/${TOTAL_LEVELS}`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-yellow-600" />}
          label="달성률"
          value={`${completionPercentage}%`}
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-600" />}
          label="최고 연속"
          value={`${progress.bestStreak}일`}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          label="총 학습 시간"
          value={formatTimeSpent(progress.totalTimeSpent)}
          bgColor="bg-blue-50"
        />
      </div>

      {/* Progress Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">학습 진행률</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">전체 진행률</span>
              <span className="font-semibold text-green-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            현재 단계: <span className="font-semibold">레벨 {progress.currentLevel}</span>
          </p>
        </div>
      </Card>

      {/* Completed Levels */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">완료한 레벨</h2>
          {completedLevels.size > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Array.from(completedLevels)
                .sort((a, b) => a - b)
                .map((levelId) => (
                  <span
                    key={levelId}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium"
                  >
                    레벨 {levelId} ✓
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">아직 완료한 레벨이 없습니다. 학습을 시작해보세요!</p>
          )}
        </div>
      </Card>

      {/* Activity Section */}
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">활동 기록</h2>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Calendar className="w-5 h-5" />
            <span>마지막 학습: {formatDate(progress.lastActiveDate)}</span>
          </div>
        </div>
      </Card>

      {/* Account Management Section */}
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">계정 관리</h2>
          <div className="space-y-4">
            {/* 비밀번호 변경 (이메일 로그인만) */}
            {isEmailLogin && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">비밀번호 변경</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">계정 비밀번호를 변경합니다</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  변경
                </Button>
              </div>
            )}

            {/* 회원탈퇴 */}
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">회원탈퇴</p>
                  <p className="text-sm text-red-500 dark:text-red-300">모든 데이터가 삭제되며 복구할 수 없습니다</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => setShowDeleteModal(true)}
              >
                탈퇴
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 회원탈퇴 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="회원탈퇴"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            정말로 탈퇴하시겠습니까?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            • 모든 학습 기록이 삭제됩니다<br />
            • 진행률 및 완료한 레벨 정보가 삭제됩니다<br />
            • 이 작업은 되돌릴 수 없습니다
          </p>
          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? '처리 중...' : '탈퇴하기'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 비밀번호 변경 모달 (이메일 로그인만) */}
      {isEmailLogin && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="비밀번호 변경"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              비밀번호 변경 기능은 준비 중입니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              현재는 로그아웃 후 "비밀번호 찾기" 기능을 이용해주세요.
            </p>
            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                onClick={() => setShowPasswordModal(false)}
              >
                확인
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}

function StatCard({ icon, label, value, bgColor }: StatCardProps) {
  return (
    <Card className={`${bgColor} border-none`}>
      <div className="p-4 text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </Card>
  );
}
