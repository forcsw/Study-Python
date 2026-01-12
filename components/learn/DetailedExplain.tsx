'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DetailedExplanation } from '@/types';

export interface DetailedExplainProps {
  detailedExplain: DetailedExplanation;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function DetailedExplain({
  detailedExplain,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  className,
}: DetailedExplainProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div
      className={cn(
        'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl overflow-hidden transition-colors duration-300',
        className
      )}
    >
      <button
        onClick={handleToggle}
        className="w-full p-4 flex justify-between items-center hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="detailed-explain-content"
      >
        <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          {detailedExplain.title}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div id="detailed-explain-content" className="p-4 pt-0 space-y-2">
          {detailedExplain.steps.map((step, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
            >
              <div className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-1">
                {step.round}
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-sm">{step.desc}</div>
              {step.result && (
                <div className="text-green-600 dark:text-green-400 font-mono text-sm mt-2 flex items-center gap-1">
                  <span aria-hidden="true">→</span>
                  <span>출력: {step.result}</span>
                </div>
              )}
            </div>
          ))}

          <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
            <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
              {detailedExplain.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
