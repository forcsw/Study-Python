import { Metadata } from 'next';
import { LoginForm } from '@/components/auth';

export const metadata: Metadata = {
  title: '로그인 - Study Python (Korean)',
  description: 'Study Python (Korean)에 로그인하세요',
};

interface LoginPageProps {
  searchParams: {
    callbackUrl?: string;
    message?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl = searchParams?.callbackUrl || '/learn';
  const message = searchParams?.message;

  return (
    <div className="w-full">
      {message === 'signup-success' && (
        <div className="max-w-md mx-auto mb-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
            회원가입이 완료되었습니다! 로그인해주세요.
          </div>
        </div>
      )}
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
