import { v4 as uuidv4 } from 'uuid';
import { User, Session, UserProgress, DEFAULT_PROGRESS } from '@/types';
import { IStorageProvider } from './storage-provider';
import fs from 'fs';
import path from 'path';

/**
 * FileStorageProvider (파일 저장소 제공자)
 *
 * Server-side storage using JSON files.
 * Used by API routes where localStorage is not available.
 */

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read JSON file safely
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  ensureDataDir();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

// Write JSON file safely
function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDataDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

export class FileStorageProvider implements IStorageProvider {
  isAvailable(): boolean {
    return true;
  }

  // ================== User Operations ==================

  async getUser(userId: string): Promise<User | null> {
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
    const userData = users[userId];
    if (!userData) return null;

    return {
      ...userData,
      createdAt: new Date(userData.createdAt),
      updatedAt: new Date(userData.updatedAt),
    };
  }

  async saveUser(user: User): Promise<void> {
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
    users[user.id] = {
      ...user,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
      updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
    };
    writeJsonFile(USERS_FILE, users);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
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
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
    delete users[userId];
    writeJsonFile(USERS_FILE, users);

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
      id: user.id,
      updatedAt: new Date(),
    };

    await this.saveUser(updatedUser);
    return updatedUser;
  }

  // ================== Progress Operations ==================

  async getProgress(userId: string): Promise<UserProgress> {
    const allProgress = readJsonFile<Record<string, any>>(PROGRESS_FILE, {});
    const progressData = allProgress[userId];

    if (!progressData) {
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
    const allProgress = readJsonFile<Record<string, any>>(PROGRESS_FILE, {});
    allProgress[userId] = {
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    writeJsonFile(PROGRESS_FILE, allProgress);
  }

  async updateProgress(
    userId: string,
    data: Partial<UserProgress>
  ): Promise<UserProgress> {
    const progress = await this.getProgress(userId);
    const updatedProgress: UserProgress = {
      ...progress,
      ...data,
      userId,
      updatedAt: new Date(),
    };

    if (updatedProgress.streak > updatedProgress.bestStreak) {
      updatedProgress.bestStreak = updatedProgress.streak;
    }

    await this.saveProgress(userId, updatedProgress);
    return updatedProgress;
  }

  private async deleteUserProgress(userId: string): Promise<void> {
    const allProgress = readJsonFile<Record<string, any>>(PROGRESS_FILE, {});
    delete allProgress[userId];
    writeJsonFile(PROGRESS_FILE, allProgress);
  }

  // ================== Session Operations ==================

  async createSession(userId: string, expiresIn = 7 * 24 * 60 * 60 * 1000): Promise<Session> {
    const sessions = readJsonFile<Record<string, any>>(SESSIONS_FILE, {});
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

    writeJsonFile(SESSIONS_FILE, sessions);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const sessions = readJsonFile<Record<string, any>>(SESSIONS_FILE, {});
    const sessionData = sessions[sessionId];

    if (!sessionData) return null;

    const session: Session = {
      ...sessionData,
      expiresAt: new Date(sessionData.expiresAt),
      createdAt: new Date(sessionData.createdAt),
    };

    if (session.expiresAt < new Date()) {
      await this.deleteSession(sessionId);
      return null;
    }

    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessions = readJsonFile<Record<string, any>>(SESSIONS_FILE, {});
    delete sessions[sessionId];
    writeJsonFile(SESSIONS_FILE, sessions);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    const sessions = readJsonFile<Record<string, any>>(SESSIONS_FILE, {});
    const filteredSessions: Record<string, any> = {};

    for (const [id, session] of Object.entries(sessions)) {
      if ((session as any).userId !== userId) {
        filteredSessions[id] = session;
      }
    }

    writeJsonFile(SESSIONS_FILE, filteredSessions);
  }

  // ================== Utility Operations ==================

  async clearAll(): Promise<void> {
    writeJsonFile(USERS_FILE, {});
    writeJsonFile(PROGRESS_FILE, {});
    writeJsonFile(SESSIONS_FILE, {});
  }
}
