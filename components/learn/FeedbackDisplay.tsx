'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Feedback } from '@/types';

export interface FeedbackDisplayProps {
  feedback: Feedback | null;
  className?: string;
}

export function FeedbackDisplay({ feedback, className }: FeedbackDisplayProps) {
  if (!feedback) return null;

  const isSuccess = feedback.type === 'success';

  return (
    <div
      className={cn(
        'p-4 rounded-xl border-2 transition-colors duration-300',
        isSuccess
          ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700'
          : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {isSuccess ? (
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
        )}
        <p
          className={cn(
            'font-bold text-lg',
            isSuccess ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
          )}
        >
          {feedback.message}
        </p>
      </div>

      {/* Output */}
      <div className="mb-2">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">내 결과:</p>
        <pre
          className={cn(
            'p-3 rounded text-sm font-mono border overflow-x-auto',
            isSuccess
              ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-700'
              : 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-700'
          )}
        >
          {feedback.output || '(출력 없음)'}
        </pre>
      </div>

      {/* Expected output (only for errors) */}
      {feedback.expected && !isSuccess && (
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">정답:</p>
          <pre className="bg-white dark:bg-slate-800 p-3 rounded text-sm font-mono border border-gray-200 dark:border-gray-700 overflow-x-auto">
            {feedback.expected}
          </pre>
        </div>
      )}
    </div>
  );
}
