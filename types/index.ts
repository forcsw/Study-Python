// Level types (레벨 타입)
export type {
  DictionaryWord,
  EnglishDictionaryWord,
  ExecutionStep,
  DetailedExplanation,
  Level,
  LevelStatus,
} from './level';

// User types (사용자 타입)
export type {
  AuthProvider,
  User,
  CreateUserInput,
  UpdateUserInput,
  Session,
  PublicUser,
} from './user';

// Progress types (진행 상황 타입)
export type {
  UserProgress,
  UpdateProgressInput,
  LearningStats,
} from './progress';

export { DEFAULT_PROGRESS } from './progress';

// Feedback type for code execution (코드 실행 피드백 타입)
export interface Feedback {
  type: 'success' | 'error';
  message: string;
  output: string;
  expected?: string;
}

// Code execution result (코드 실행 결과)
export interface CodeExecutionResult {
  output: string;
  isCorrect: boolean;
  usedPyodide: boolean;
  error?: string;
}

// Storage provider interface (저장소 제공자 인터페이스)
export interface IStorageProvider {
  // User operations
  getUser(userId: string): Promise<import('./user').User | null>;
  saveUser(user: import('./user').User): Promise<void>;
  findUserByEmail(email: string): Promise<import('./user').User | null>;
  deleteUser(userId: string): Promise<void>;

  // Progress operations
  getProgress(userId: string): Promise<import('./progress').UserProgress>;
  saveProgress(userId: string, progress: import('./progress').UserProgress): Promise<void>;

  // Session operations (for credentials auth)
  createSession(userId: string): Promise<import('./user').Session>;
  getSession(sessionId: string): Promise<import('./user').Session | null>;
  deleteSession(sessionId: string): Promise<void>;
}
