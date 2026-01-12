'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProgress, DEFAULT_PROGRESS } from '@/types';
import { getStorage } from '@/lib/storage';

export interface UseProgressOptions {
  userId?: string;
  autoSave?: boolean;
}

export interface UseProgressReturn {
  progress: UserProgress;
  isLoading: boolean;
  error: string | null;
  completedLevels: Set<number>;
  completeLevel: (levelId: number) => Promise<void>;
  setCurrentLevel: (levelId: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
  updateTimeSpent: (minutes: number) => Promise<void>;
  reload: () => Promise<void>;
}

const GUEST_USER_ID = 'guest';

export function useProgress({
  userId = GUEST_USER_ID,
  autoSave = true,
}: UseProgressOptions = {}): UseProgressReturn {
  const [progress, setProgress] = useState<UserProgress>({
    ...DEFAULT_PROGRESS,
    userId,
    updatedAt: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storage = getStorage();

  // Load progress on mount
  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const savedProgress = await storage.getProgress(userId);
      setProgress(savedProgress);
    } catch (err) {
      console.error('Failed to load progress:', err);
      setError('진행 상황을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, storage]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Save progress
  const saveProgress = useCallback(
    async (newProgress: UserProgress) => {
      if (!autoSave) return;

      try {
        await storage.saveProgress(userId, newProgress);
      } catch (err) {
        console.error('Failed to save progress:', err);
        setError('진행 상황을 저장하는데 실패했습니다.');
      }
    },
    [userId, storage, autoSave]
  );

  // Complete a level
  const completeLevel = useCallback(
    async (levelId: number) => {
      let updatedProgress: UserProgress | null = null;

      setProgress((prev) => {
        const newCompletedLevels = Array.from(
          new Set([...prev.completedLevels, levelId])
        ).sort((a, b) => a - b);

        updatedProgress = {
          ...prev,
          completedLevels: newCompletedLevels,
          updatedAt: new Date(),
        };
        return updatedProgress;
      });

      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 0));

      if (updatedProgress) {
        await saveProgress(updatedProgress);
      }
    },
    [saveProgress]
  );

  // Set current level
  const setCurrentLevel = useCallback(
    async (levelId: number) => {
      let updatedProgress: UserProgress | null = null;

      setProgress((prev) => {
        updatedProgress = {
          ...prev,
          currentLevel: levelId,
          updatedAt: new Date(),
        };
        return updatedProgress;
      });

      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 0));

      if (updatedProgress) {
        await saveProgress(updatedProgress);
      }
    },
    [saveProgress]
  );

  // Increment streak
  const incrementStreak = useCallback(async () => {
    let updatedProgress: UserProgress | null = null;

    setProgress((prev) => {
      const today = new Date().toISOString().split('T')[0];
      const newStreak = prev.streak + 1;
      const newBestStreak = Math.max(newStreak, prev.bestStreak);

      updatedProgress = {
        ...prev,
        streak: newStreak,
        bestStreak: newBestStreak,
        lastActiveDate: today,
        updatedAt: new Date(),
      };
      return updatedProgress;
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    if (updatedProgress) {
      await saveProgress(updatedProgress);
    }
  }, [saveProgress]);

  // Reset streak
  const resetStreak = useCallback(async () => {
    let updatedProgress: UserProgress | null = null;

    setProgress((prev) => {
      const today = new Date().toISOString().split('T')[0];

      updatedProgress = {
        ...prev,
        streak: 0,
        lastActiveDate: today,
        updatedAt: new Date(),
      };
      return updatedProgress;
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    if (updatedProgress) {
      await saveProgress(updatedProgress);
    }
  }, [saveProgress]);

  // Update time spent
  const updateTimeSpent = useCallback(
    async (minutes: number) => {
      let updatedProgress: UserProgress | null = null;

      setProgress((prev) => {
        updatedProgress = {
          ...prev,
          totalTimeSpent: prev.totalTimeSpent + minutes,
          updatedAt: new Date(),
        };
        return updatedProgress;
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      if (updatedProgress) {
        await saveProgress(updatedProgress);
      }
    },
    [saveProgress]
  );

  // Computed: completedLevels as Set
  const completedLevelsSet = new Set(progress.completedLevels);

  return {
    progress,
    isLoading,
    error,
    completedLevels: completedLevelsSet,
    completeLevel,
    setCurrentLevel,
    incrementStreak,
    resetStreak,
    updateTimeSpent,
    reload: loadProgress,
  };
}
