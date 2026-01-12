import { LocalStorageProvider } from './local-storage';
import { FileStorageProvider } from './file-storage';
import type { IStorageProvider } from './storage-provider';

export type { IStorageProvider } from './storage-provider';
export { StorageError, StorageErrorCode } from './storage-provider';
export { LocalStorageProvider } from './local-storage';
export { FileStorageProvider } from './file-storage';

/**
 * Creates a storage provider instance (저장소 제공자 인스턴스 생성)
 *
 * - Server-side (API routes): Uses FileStorageProvider (JSON files)
 * - Client-side (browser): Uses LocalStorageProvider
 *
 * @example
 * // Use in components or hooks
 * const storage = createStorageProvider();
 * const progress = await storage.getProgress(userId);
 */
export function createStorageProvider(): IStorageProvider {
  // Server-side: use file-based storage
  if (typeof window === 'undefined') {
    return new FileStorageProvider();
  }

  // Client-side: use localStorage
  return new LocalStorageProvider();
}

// Separate instances for server and client (서버와 클라이언트 분리 인스턴스)
let serverStorageInstance: IStorageProvider | null = null;
let clientStorageInstance: IStorageProvider | null = null;

export function getStorage(): IStorageProvider {
  if (typeof window === 'undefined') {
    // Server-side
    if (!serverStorageInstance) {
      serverStorageInstance = new FileStorageProvider();
    }
    return serverStorageInstance;
  } else {
    // Client-side
    if (!clientStorageInstance) {
      clientStorageInstance = new LocalStorageProvider();
    }
    return clientStorageInstance;
  }
}

// For testing purposes (테스트 목적)
export function resetStorage(): void {
  serverStorageInstance = null;
  clientStorageInstance = null;
}
