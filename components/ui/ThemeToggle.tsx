'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme toggle button component
 * (테마 토글 버튼 컴포넌트)
 *
 * Switches between light and dark mode
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-colors duration-200',
        'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600',
        'text-slate-600 dark:text-slate-300',
        'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        'dark:focus:ring-offset-slate-800',
        className
      )}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드' : '다크 모드'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}
