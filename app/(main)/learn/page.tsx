'use client';

import { useRouter } from 'next/navigation';
import { levels, TOTAL_LEVELS } from '@/data/levels';
import { LevelSelector } from '@/components/learn/LevelSelector';
import { useAuth, useProgress } from '@/lib/hooks';

export default function LearnPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { progress, completedLevels } = useProgress({
    userId: user?.id || 'guest',
  });

  const handleLevelSelect = (levelId: number) => {
    router.push(`/learn/${levelId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">학습 시작하기</h1>
        <p className="text-gray-600">
          {completedLevels.size}개 완료 / 총 {TOTAL_LEVELS}개 레벨
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <LevelSelector
          levels={levels}
          currentLevel={progress.currentLevel}
          completedLevels={completedLevels}
          onLevelSelect={handleLevelSelect}
        />
      </div>
    </div>
  );
}
