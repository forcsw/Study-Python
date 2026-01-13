'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Trophy, Clock, BookOpen, Calendar, Mail, User, Shield, Trash2, Key, Camera, Edit3 } from 'lucide-react';
import { useAuth, useProgress } from '@/lib/hooks';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { TOTAL_LEVELS } from '@/data/levels';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { progress, completedLevels } = useProgress({
    userId: user?.id || 'guest',
  });

  // 계정 정보 가져오기 (로그인 방식, 이메일 포함)
  const accountInfo = useQuery(api.users.getCurrentUserWithAccount);
  const deleteAccount = useMutation(api.users.deleteMyAccount);
  const changePassword = useAction(api.users.changePassword);

  // 프로필 편집용 mutation
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfile = useMutation(api.users.updateProfile);

  // 이미지 URL (서버에서 이미 변환됨)
  const displayImageUrl = accountInfo?.image || null;

  // 파일 업로드 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 프로필 편집 상태
  const [editNickname, setEditNickname] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // 비밀번호 변경 폼 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 비밀번호 변경 처리
  const handleChangePassword = async () => {
    setPasswordError('');

    // 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호와 확인이 일치하지 않습니다.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        email: accountInfo?.email || '',
        currentPassword,
        newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setShowPasswordModal(false);
      // 폼 초기화
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 비밀번호 모달 닫기 (폼 초기화 포함)
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  // 프로필 편집 모달 열기
  const openEditProfileModal = () => {
    setEditNickname(accountInfo?.nickname || user?.name || '');
    setPreviewImage(null);
    setUploadingFile(null);
    setProfileError('');
    setShowEditProfileModal(true);
  };

  // 프로필 편집 모달 닫기
  const closeEditProfileModal = () => {
    setShowEditProfileModal(false);
    setEditNickname('');
    setPreviewImage(null);
    setUploadingFile(null);
    setProfileError('');
  };

  // 이미지 선택 처리
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('이미지 파일은 5MB 이하만 가능합니다.');
      return;
    }

    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      setProfileError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setUploadingFile(file);
    setProfileError('');

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 프로필 저장
  const handleSaveProfile = async () => {
    setProfileError('');

    if (!editNickname.trim()) {
      setProfileError('닉네임을 입력해주세요.');
      return;
    }

    if (editNickname.trim().length > 20) {
      setProfileError('닉네임은 20자 이하로 입력해주세요.');
      return;
    }

    setIsSavingProfile(true);
    try {
      let imageStorageId: string | undefined;

      // 이미지 업로드
      if (uploadingFile) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': uploadingFile.type },
          body: uploadingFile,
        });

        if (!response.ok) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        const result = await response.json();
        imageStorageId = result.storageId;
      }

      // 프로필 업데이트
      await updateProfile({
        name: editNickname.trim(),
        ...(imageStorageId && { image: imageStorageId }),
      });

      closeEditProfileModal();
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      if (error instanceof Error) {
        setProfileError(error.message);
      } else {
        setProfileError('프로필 저장에 실패했습니다.');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 로그인 방식 표시 텍스트
  const getProviderText = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google 로그인';
      case 'password':
        return '이메일 로그인';
      default:
        return '알 수 없음';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isEmailLogin = accountInfo?.provider === 'password';

  const completionPercentage = Math.round((completedLevels.size / TOTAL_LEVELS) * 100);

  // Format time spent
  const formatTimeSpent = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
          {/* Avatar - 이메일 로그인 사용자는 클릭하여 편집 가능 */}
          <div className="relative">
            <div
              className={`w-24 h-24 bg-green-100 rounded-full flex items-center justify-center ${
                isEmailLogin ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
              }`}
              onClick={isEmailLogin ? openEditProfileModal : undefined}
            >
              {displayImageUrl ? (
                <img
                  src={displayImageUrl}
                  alt={user.name || '프로필'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-green-600" />
              )}
            </div>
            {/* 이메일 로그인 사용자에게만 카메라 아이콘 표시 */}
            {isEmailLogin && (
              <button
                onClick={openEditProfileModal}
                className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
                title="프로필 편집"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            {/* 닉네임 */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {accountInfo?.nickname || user.name || '사용자'}
              </h1>
              {/* 모든 사용자에게 닉네임 편집 버튼 표시 */}
              <button
                onClick={openEditProfileModal}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="닉네임 편집"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {/* 이메일 로그인 사용자: 이름 표시 */}
            {isEmailLogin && accountInfo?.name && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm">이름: {accountInfo.name}</span>
              </div>
            )}
            {/* 이메일 로그인 사용자: 이메일 표시 */}
            {isEmailLogin && accountInfo?.email && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">이메일: {accountInfo.email}</span>
              </div>
            )}
            {/* 로그인 방식 표시 */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-300 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                {accountInfo ? getProviderText(accountInfo.provider) : '로딩 중...'}
              </span>
            </div>
            {/* Google 로그인의 경우: 이름과 이메일 표시 */}
            {!isEmailLogin && accountInfo?.name && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm">이름: {accountInfo.name}</span>
              </div>
            )}
            {!isEmailLogin && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">이메일: {accountInfo?.email || '이메일 없음'}</span>
              </div>
            )}
          </div>

          {/* Streak Badge */}
          <div className="flex flex-col items-center bg-orange-100 rounded-xl p-4">
            <Flame className="w-8 h-8 text-orange-500 mb-1" />
            <span className="text-2xl font-bold text-orange-700">{progress.streak}</span>
            <span className="text-xs text-orange-600">연속 학습</span>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-green-600" />}
          label="완료한 레벨"
          value={`${completedLevels.size}/${TOTAL_LEVELS}`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-yellow-600" />}
          label="달성률"
          value={`${completionPercentage}%`}
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-600" />}
          label="최고 연속"
          value={`${progress.bestStreak}일`}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          label="총 학습 시간"
          value={formatTimeSpent(progress.totalTimeSpent)}
          bgColor="bg-blue-50"
        />
      </div>

      {/* Progress Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">학습 진행률</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">전체 진행률</span>
              <span className="font-semibold text-green-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            현재 단계: <span className="font-semibold">레벨 {progress.currentLevel}</span>
          </p>
        </div>
      </Card>

      {/* Completed Levels */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">완료한 레벨</h2>
          {completedLevels.size > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Array.from(completedLevels)
                .sort((a, b) => a - b)
                .map((levelId) => (
                  <span
                    key={levelId}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium"
                  >
                    레벨 {levelId} ✓
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">아직 완료한 레벨이 없습니다. 학습을 시작해보세요!</p>
          )}
        </div>
      </Card>

      {/* Activity Section */}
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">활동 기록</h2>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Calendar className="w-5 h-5" />
            <span>마지막 학습: {formatDate(progress.lastActiveDate)}</span>
          </div>
        </div>
      </Card>

      {/* Account Management Section */}
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">계정 관리</h2>
          <div className="space-y-4">
            {/* 비밀번호 변경 (이메일 로그인만) */}
            {isEmailLogin && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">비밀번호 변경</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">계정 비밀번호를 변경합니다</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  변경
                </Button>
              </div>
            )}

            {/* 회원탈퇴 */}
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">회원탈퇴</p>
                  <p className="text-sm text-red-500 dark:text-red-300">모든 데이터가 삭제되며 복구할 수 없습니다</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => setShowDeleteModal(true)}
              >
                탈퇴
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 회원탈퇴 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="회원탈퇴"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            정말로 탈퇴하시겠습니까?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            • 모든 학습 기록이 삭제됩니다<br />
            • 진행률 및 완료한 레벨 정보가 삭제됩니다<br />
            • 이 작업은 되돌릴 수 없습니다
          </p>
          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? '처리 중...' : '탈퇴하기'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 비밀번호 변경 모달 (이메일 로그인만) */}
      {isEmailLogin && (
        <Modal
          isOpen={showPasswordModal}
          onClose={closePasswordModal}
          title="비밀번호 변경"
        >
          <div className="space-y-4">
            {/* 에러 메시지 */}
            {passwordError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              </div>
            )}

            {/* 현재 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="현재 비밀번호를 입력하세요"
                disabled={isChangingPassword}
              />
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="새 비밀번호 (최소 6자)"
                disabled={isChangingPassword}
              />
            </div>

            {/* 새 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="새 비밀번호를 다시 입력하세요"
                disabled={isChangingPassword}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={closePasswordModal}
                disabled={isChangingPassword}
              >
                취소
              </Button>
              <Button
                variant="primary"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 프로필 편집 모달 (모든 사용자) */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={closeEditProfileModal}
        title="프로필 편집"
      >
        <div className="space-y-6">
          {/* 에러 메시지 */}
          {profileError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>
            </div>
          )}

          {/* 프로필 이미지 (이메일 로그인 사용자만 변경 가능) */}
          {isEmailLogin && (
            <div className="flex flex-col items-center">
              <div
                className="relative w-32 h-32 bg-green-100 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="미리보기"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt={user.name || '프로필'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-green-600" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                클릭하여 이미지 변경 (최대 5MB)
              </p>
            </div>
          )}

          {/* 닉네임 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              닉네임
            </label>
            <input
              type="text"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="닉네임을 입력하세요 (최대 20자)"
              maxLength={20}
              disabled={isSavingProfile}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {editNickname.length}/20
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={closeEditProfileModal}
              disabled={isSavingProfile}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}

function StatCard({ icon, label, value, bgColor }: StatCardProps) {
  return (
    <Card className={`${bgColor} border-none`}>
      <div className="p-4 text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </Card>
  );
}
