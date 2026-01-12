import { User, Session, UserProgress } from '@/types';

/**
 * Storage Provider Interface (저장소 제공자 인터페이스)
 *
 * This interface defines the contract for all storage implementations.
 * Currently implemented: LocalStorageProvider
 * Future: DatabaseProvider (Prisma + PostgreSQL)
 */
export interface IStorageProvider {
  // User operations (사용자 작업)
  getUser(userId: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  findUserByEmail(email: string): Promise<User | null>;
  deleteUser(userId: string): Promise<void>;
  updateUser(userId: string, data: Partial<User>): Promise<User | null>;

  // Progress operations (진행 상황 작업)
  getProgress(userId: string): Promise<UserProgress>;
  saveProgress(userId: string, progress: UserProgress): Promise<void>;
  updateProgress(userId: string, data: Partial<UserProgress>): Promise<UserProgress>;

  // Session operations (세션 작업) - for credentials auth
  createSession(userId: string, expiresIn?: number): Promise<Session>;
  getSession(sessionId: string): Promise<Session | null>;
  deleteSession(sessionId: string): Promise<void>;
  deleteUserSessions(userId: string): Promise<void>;

  // Utility operations (유틸리티 작업)
  clearAll(): Promise<void>;
  isAvailable(): boolean;
}

// Storage error types (저장소 오류 유형)
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: StorageErrorCode,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export enum StorageErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_DATA = 'INVALID_DATA',
  STORAGE_FULL = 'STORAGE_FULL',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}
