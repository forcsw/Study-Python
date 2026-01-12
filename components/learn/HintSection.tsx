'use client';

import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface HintSectionProps {
  hint: string;
  hintExplain: string;
  showHint?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function HintSection({
  hint,
  hintExplain,
  showHint: controlledShowHint,
  onToggle,
  className,
}: HintSectionProps) {
  const [internalShowHint, setInternalShowHint] = useState(false);

  const isControlled = controlledShowHint !== undefined;
  const showHint = isControlled ? controlledShowHint : internalShowHint;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalShowHint(!internalShowHint);
    }
  };

  return (
    <div className={cn('', className)}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-2 bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50 p-4 rounded-xl transition-colors"
        aria-expanded={showHint}
        aria-controls="hint-content"
      >
        <span className="flex items-center gap-2 font-bold">
          <Lightbulb className="w-5 h-5" aria-hidden="true" />
          {showHint ? '힌트 숨기기' : '힌트 보기'}
        </span>
      </button>

      {showHint && (
        <div
          id="hint-content"
          className="mt-3 bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 p-4 rounded-xl transition-colors duration-300"
          role="region"
          aria-label="힌트"
        >
          <p className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
            <span aria-hidden="true">📋</span>
            이렇게 입력하세요:
          </p>
          <pre className="bg-slate-900 text-green-400 p-4 rounded text-sm font-mono whitespace-pre-wrap mb-3 overflow-x-auto">
            {hint}
          </pre>
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            <span className="font-medium" aria-hidden="true">💬 </span>
            {hintExplain}
          </p>
        </div>
      )}
    </div>
  );
}
