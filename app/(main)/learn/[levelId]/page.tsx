'use client';

import { useRouter } from 'next/navigation';
import { getLevelById, TOTAL_LEVELS } from '@/data/levels';
import { LevelContent } from '@/components/learn/LevelContent';
import { useAuth, useProgress } from '@/lib/hooks';

interface LevelPageProps {
  params: { levelId: string };
}

export default function LevelPage({ params }: LevelPageProps) {
  const router = useRouter();
  const levelId = parseInt(params.levelId, 10);
  const level = getLevelById(levelId);

  const { user } = useAuth();
  const { progress, completedLevels, completeLevel, setCurrentLevel } = useProgress({
    userId: user?.id || 'guest',
  });

  // Handle invalid level ID
  if (!level || isNaN(levelId) || levelId < 1 || levelId > TOTAL_LEVELS) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          레벨을 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-8">
          존재하지 않는 레벨입니다. 유효한 레벨을 선택해주세요.
        </p>
        <button
          onClick={() => router.push('/learn')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          레벨 선택으로 돌아가기
        </button>
      </div>
    );
  }

  const handleComplete = async (completedLevelId: number) => {
    await completeLevel(completedLevelId);
    // Update current level to next if not already further
    if (completedLevelId >= progress.currentLevel && completedLevelId < TOTAL_LEVELS) {
      await setCurrentLevel(completedLevelId + 1);
    }
  };

  const handleNavigate = (newLevelId: number) => {
    router.push(`/learn/${newLevelId}`);
  };

  return (
    <LevelContent
      level={level}
      onComplete={handleComplete}
      onNavigate={handleNavigate}
      isCompleted={completedLevels.has(levelId)}
    />
  );
}
