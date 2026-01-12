'use client';

import { cn } from '@/lib/utils/cn';

export interface TaskDescriptionProps {
  task: string;
  className?: string;
}

export function TaskDescription({ task, className }: TaskDescriptionProps) {
  return (
    <div
      className={cn(
        'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 p-4 rounded-xl transition-colors duration-300',
        className
      )}
      role="region"
      aria-label="할 일"
    >
      <h3 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
        <span aria-hidden="true">📝</span>
        할 일:
      </h3>
      <p className="text-green-700 dark:text-green-400">{task}</p>
    </div>
  );
}
