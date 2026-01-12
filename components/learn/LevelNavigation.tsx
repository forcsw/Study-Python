'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface LevelNavigationProps {
  currentLevel: number;
  totalLevels: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export function LevelNavigation({
  currentLevel,
  totalLevels,
  onPrevious,
  onNext,
  className,
}: LevelNavigationProps) {
  const isFirst = currentLevel === 1;
  const isLast = currentLevel === totalLevels;

  return (
    <div
      className={cn('flex justify-between items-center', className)}
      role="navigation"
      aria-label="레벨 네비게이션"
    >
      <Button
        onClick={onPrevious}
        disabled={isFirst}
        variant="secondary"
        aria-label="이전 단계로 이동"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        이전
      </Button>

      <span className="text-gray-600 dark:text-gray-400 text-sm">
        단계 {currentLevel} / {totalLevels}
      </span>

      <Button
        onClick={onNext}
        disabled={isLast}
        variant="primary"
        aria-label="다음 단계로 이동"
      >
        다음
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
