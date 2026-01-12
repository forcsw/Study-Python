'use client';

import { cn } from '@/lib/utils/cn';

export interface EasyExplainProps {
  explanations: string[];
  className?: string;
}

export function EasyExplain({ explanations, className }: EasyExplainProps) {
  return (
    <div
      className={cn(
        'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 p-4 rounded-xl transition-colors duration-300',
        className
      )}
    >
      <h3 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
        <span aria-hidden="true">📚</span>
        쉽게 이해하기
      </h3>
      <ul className="space-y-2" role="list">
        {explanations.map((line, i) => (
          <li
            key={i}
            className="text-green-700 dark:text-green-400 text-sm leading-relaxed"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
