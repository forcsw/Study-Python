'use client';

import { Flame, Trophy, Clock, BookOpen, Calendar, Mail, User } from 'lucide-react';
import { useAuth, useProgress } from '@/lib/hooks';
import { TOTAL_LEVELS } from '@/data/levels';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { progress, completedLevels } = useProgress({
    userId: user?.id || 'guest',
  });

  if (!isAuthenticated || !user) {
    return null;
  }

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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {user.name || '사용자'}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">활동 기록</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>마지막 학습: {formatDate(progress.lastActiveDate)}</span>
          </div>
        </div>
      </Card>
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
