'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'studypython_theme';

export interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Hook for managing theme (dark/light mode)
 * (다크/라이트 모드 관리 훅)
 *
 * - Persists theme preference in localStorage
 * - Applies 'dark' class to document element
 * - Defaults to light mode on first load (첫 방문 시 라이트 모드 기본)
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;

    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to light mode (라이트 모드를 기본으로 설정)
      setThemeState('light');
      applyTheme('light');
    }
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Set theme with persistence
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme: mounted ? theme : 'light',
    isDark: mounted ? theme === 'dark' : false,
    toggleTheme,
    setTheme,
  };
}
