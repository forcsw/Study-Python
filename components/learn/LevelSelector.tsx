'use client';

import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Level } from '@/types';

export interface LevelSelectorProps {
  levels: Level[];
  currentLevel: number;
  completedLevels: Set<number>;
  onLevelSelect: (levelId: number) => void;
}

export function LevelSelector({
  levels,
  currentLevel,
  completedLevels,
  onLevelSelect,
}: LevelSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {levels.map((level) => {
        const isCompleted = completedLevels.has(level.id);
        const isCurrent = currentLevel === level.id;

        return (
          <button
            key={level.id}
            onClick={() => onLevelSelect(level.id)}
            className={cn(
              'p-3 rounded-xl border-2 text-left transition-all hover:shadow-md',
              isCurrent
                ? 'border-green-500 bg-green-50'
                : isCompleted
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={`단계 ${level.id}: ${level.title}${isCompleted ? ' (완료)' : ''}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">단계 {level.id}</span>
              {isCompleted && (
                <CheckCircle
                  className="w-4 h-4 text-emerald-500"
                  aria-label="완료됨"
                />
              )}
            </div>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-1">
              {level.title}
            </h3>
          </button>
        );
      })}
    </div>
  );
}
