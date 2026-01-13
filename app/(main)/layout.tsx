'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth, useProgress } from '@/lib/hooks';
import { LevelSelector } from '@/components/learn/LevelSelector';
import { Modal } from '@/components/ui/Modal';
import { levels, TOTAL_LEVELS } from '@/data/levels';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: authLoading, signOutAndRedirect } = useAuth();
  const { progress, isLoading: progressLoading, completedLevels } = useProgress({
    userId: user?.id || 'guest',
  });

  const [showLevelSelector, setShowLevelSelector] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    // /learn 경로는 비로그인 접근 허용 (게스트 학습)
    const isPublicRoute = pathname?.startsWith('/learn');

    if (!authLoading && !isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router, pathname]);

  const handleLevelSelect = (levelId: number) => {
    setShowLevelSelector(false);
    router.push(`/learn/${levelId}`);
  };

  const handleLogout = async () => {
    await signOutAndRedirect('/');
  };

  // Show loading state while checking auth
  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        streak={progress.streak}
        currentLevel={progress.currentLevel}
        completedLevels={completedLevels.size}
        totalLevels={TOTAL_LEVELS}
        userName={user?.name || undefined}
        isLoggedIn={isAuthenticated}
        onLevelButtonClick={() => setShowLevelSelector(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">{children}</main>

      {/* Level Selector Modal */}
      <Modal
        isOpen={showLevelSelector}
        onClose={() => setShowLevelSelector(false)}
        title="단계 선택"
      >
        <LevelSelector
          levels={levels}
          currentLevel={progress.currentLevel}
          completedLevels={completedLevels}
          onLevelSelect={handleLevelSelect}
        />
      </Modal>
    </div>
  );
}
