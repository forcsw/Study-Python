import { Metadata } from 'next';
import { SignupForm } from '@/components/auth';

export const metadata: Metadata = {
  title: '회원가입 - Study Python (Korean)',
  description: 'Study Python (Korean)에 가입하고 파이썬을 배워보세요',
};

interface SignupPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const callbackUrl = searchParams?.callbackUrl || '/learn';

  return <SignupForm callbackUrl={callbackUrl} />;
}
