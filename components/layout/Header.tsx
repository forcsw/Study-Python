'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProgressBar } from '@/components/learn/ProgressBar';

export interface HeaderProps {
  currentLevel?: number;
  completedLevels?: number;
  totalLevels?: number;
  userName?: string;
  isLoggedIn?: boolean;
  onLevelButtonClick?: () => void;
  onLogout?: () => void;
}

export function Header({
  currentLevel = 1,
  completedLevels = 0,
  totalLevels = 15,
  userName,
  isLoggedIn = false,
  onLevelButtonClick,
  onLogout,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b-4 border-green-500 dark:border-green-600 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2"
          >
            <span className="hidden sm:inline">Study Python (Korean)</span>
            <span className="sm:hidden">Study Python</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Level Button */}
            {onLevelButtonClick && (
              <Button
                onClick={onLevelButtonClick}
                variant="primary"
                size="sm"
              >
                단계 {currentLevel}
              </Button>
            )}

            {/* User Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{userName || '사용자'}</span>
                </Link>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    title="로그아웃"
                    aria-label="로그아웃"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <ProgressBar completed={completedLevels} total={totalLevels} />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-slate-600 pt-4">
            <div className="space-y-3">
              {onLevelButtonClick && (
                <Button
                  onClick={() => {
                    onLevelButtonClick();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="primary"
                  className="w-full"
                >
                  단계 {currentLevel}
                </Button>
              )}

              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="block py-2 text-gray-600 dark:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 inline mr-2" />
                    {userName || '내 프로필'}
                  </Link>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 text-gray-600 dark:text-gray-300"
                    >
                      <LogOut className="w-5 h-5 inline mr-2" />
                      로그아웃
                    </button>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    로그인
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
