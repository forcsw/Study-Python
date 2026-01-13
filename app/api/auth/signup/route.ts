/**
 * Signup API Route (회원가입 API 라우트)
 *
 * Handles user registration with email and password.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getStorage } from '@/lib/storage';

interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupRequest;
    const { email, password, name } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const storage = getStorage();

    // Check if user already exists
    const existingUser = await storage.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = {
      id: uuidv4(),
      email: email.toLowerCase(),
      name: name || email.split('@')[0],
      passwordHash,
      provider: 'credentials' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await storage.saveUser(user);

    // Return success (don't include passwordHash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
