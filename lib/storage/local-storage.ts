import { v4 as uuidv4 } from 'uuid';
import { User, Session, UserProgress, DEFAULT_PROGRESS } from '@/types';
import { IStorageProvider, StorageError, StorageErrorCode } from './storage-provider';

/**
 * LocalStorageProvider (로컬 저장소 제공자)
 *
 * Implements IStorageProvider using browser's localStorage.
 * Data persists across sessions but is limited to ~5MB.
 *
 * Note: This is for development/demo purposes.
 * For production, use DatabaseProvider with a real database.
 */
export class LocalStorageProvider implements IStorageProvider {
  private readonly USERS_KEY = 'pylingo_users';
  private readonly PROGRESS_KEY = 'pylingo_progress';
  private readonly SESSIONS_KEY = 'pylingo_sessions';

  constructor() {
    // Initialize storage if needed
    if (typeof window !== 'undefined') {
      this.initializeStorage();
    }
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.PROGRESS_KEY)) {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.SESSIONS_KEY)) {
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify({}));
    }
  }

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // ================== User Operations ==================

  async getUser(userId: string): Promise<User | null> {
    const users = this.getUsers();
    const userData = users[userId];
    if (!userData) return null;

    return {
      ...userData,
      createdAt: new Date(userData.createdAt),
      updatedAt: new Date(userData.updatedAt),
    };
  }

  async saveUser(user: User): Promise<void> {
    const users = this.getUsers();
    users[user.id] = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
    this.setUsers(users);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = this.getUsers();
    const userData = Object.values(users).find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    ) as any;

    if (!userData) return null;

    return {
      ...userData,
      createdAt: new Date(userData.createdAt),
      updatedAt: new Date(userData.updatedAt),
    };
  }

  async deleteUser(userId: string): Promise<void> {
    const users = this.getUsers();
    delete users[userId];
    this.setUsers(users);

    // Also delete user's progress and sessions
    await this.deleteUserProgress(userId);
    await this.deleteUserSessions(userId);
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User | null> {
    const user = await this.getUser(userId);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...data,
      id: user.id, // Prevent ID change
      updatedAt: new Date(),
    };

    await this.saveUser(updatedUser);
    return updatedUser;
  }

  // ================== Progress Operations ==================

  async getProgress(userId: string): Promise<UserProgress> {
    const allProgress = this.getAllProgress();
    const progressData = allProgress[userId];

    if (!progressData) {
      // Return default progress for new users
      return {
        ...DEFAULT_PROGRESS,
        userId,
        updatedAt: new Date(),
      };
    }

    return {
      ...progressData,
      updatedAt: new Date(progressData.updatedAt),
    };
  }

  async saveProgress(userId: string, progress: UserProgress): Promise<void> {
    const allProgress = this.getAllProgress();
    allProgress[userId] = {
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    this.setAllProgress(allProgress);
  }

  async updateProgress(
    userId: string,
    data: Partial<UserProgress>
  ): Promise<UserProgress> {
    const progress = await this.getProgress(userId);
    const updatedProgress: UserProgress = {
      ...progress,
      ...data,
      userId, // Prevent userId change
      updatedAt: new Date(),
    };

    // Update bestStreak if current streak is higher
    if (
      updatedProgress.streak > updatedProgress.bestStreak
    ) {
      updatedProgress.bestStreak = updatedProgress.streak;
    }

    await this.saveProgress(userId, updatedProgress);
    return updatedProgress;
  }

  private async deleteUserProgress(userId: string): Promise<void> {
    const allProgress = this.getAllProgress();
    delete allProgress[userId];
    this.setAllProgress(allProgress);
  }

  // ================== Session Operations ==================

  async createSession(userId: string, expiresIn = 7 * 24 * 60 * 60 * 1000): Promise<Session> {
    const sessions = this.getSessions();
    const session: Session = {
      id: uuidv4(),
      userId,
      expiresAt: new Date(Date.now() + expiresIn),
      createdAt: new Date(),
    };

    sessions[session.id] = {
      ...session,
      expiresAt: session.expiresAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
    };

    this.setSessions(sessions);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const sessions = this.getSessions();
    const sessionData = sessions[sessionId];

    if (!sessionData) return null;

    const session: Session = {
      ...sessionData,
      expiresAt: new Date(sessionData.expiresAt),
      createdAt: new Date(sessionData.createdAt),
    };

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      await this.deleteSession(sessionId);
      return null;
    }

    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessions = this.getSessions();
    delete sessions[sessionId];
    this.setSessions(sessions);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    const sessions = this.getSessions();
    const filteredSessions: Record<string, any> = {};

    for (const [id, session] of Object.entries(sessions)) {
      if ((session as any).userId !== userId) {
        filteredSessions[id] = session;
      }
    }

    this.setSessions(filteredSessions);
  }

  // ================== Utility Operations ==================

  async clearAll(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.PROGRESS_KEY);
    localStorage.removeItem(this.SESSIONS_KEY);
    this.initializeStorage();
  }

  // ================== Private Helpers ==================

  private getUsers(): Record<string, any> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private setUsers(users: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private getAllProgress(): Record<string, any> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private setAllProgress(progress: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
  }

  private getSessions(): Record<string, any> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private setSessions(sessions: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }
}
