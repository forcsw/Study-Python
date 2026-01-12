import { LevelStatus } from './level';

// User progress interface (사용자 진행 상황 인터페이스)
export interface UserProgress {
  userId: string;
  completedLevels: number[]; // Array of completed level IDs
  currentLevel: number;
  streak: number; // Consecutive correct answers
  bestStreak: number; // Best streak ever
  lastActiveDate: string; // ISO date string (YYYY-MM-DD)
  totalTimeSpent: number; // Total time in minutes
  levelStatuses: LevelStatus[];
  updatedAt: Date;
}

// Default progress for new users (새 사용자의 기본 진행 상황)
export const DEFAULT_PROGRESS: Omit<UserProgress, 'userId'> = {
  completedLevels: [],
  currentLevel: 1,
  streak: 0,
  bestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalTimeSpent: 0,
  levelStatuses: [],
  updatedAt: new Date(),
};

// Progress update input (진행 상황 업데이트 입력)
export interface UpdateProgressInput {
  completedLevels?: number[];
  currentLevel?: number;
  streak?: number;
  totalTimeSpent?: number;
}

// Learning statistics (학습 통계)
export interface LearningStats {
  totalLevelsCompleted: number;
  totalLevels: number;
  progressPercentage: number;
  currentStreak: number;
  bestStreak: number;
  totalTimeSpent: number;
  averageAttemptsPerLevel: number;
}
