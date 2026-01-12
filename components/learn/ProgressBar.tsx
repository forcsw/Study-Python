'use client';

import { cn } from '@/lib/utils/cn';

export interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  completed,
  total,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{completed} / {total} 완료</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`학습 진행률 ${percentage}%`}
      >
        <div
          className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
