// Authentication provider types (인증 제공자 타입)
export type AuthProvider = 'credentials' | 'google';

// User interface (사용자 인터페이스)
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  passwordHash?: string; // Only for credentials auth
  provider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
}

// User creation input (사용자 생성 입력)
export interface CreateUserInput {
  email: string;
  name: string;
  password?: string; // For credentials auth
  image?: string;
  provider: AuthProvider;
}

// User update input (사용자 업데이트 입력)
export interface UpdateUserInput {
  name?: string;
  image?: string;
}

// Session interface (세션 인터페이스)
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

// Public user info (공개 사용자 정보) - for client-side
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  image?: string;
}
