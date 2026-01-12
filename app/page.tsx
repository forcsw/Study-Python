'use client';

import Link from 'next/link';
import { Code, BookOpen, Trophy, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Study Python (Korean)</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-green-100 hover:text-white transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              시작하기
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            파이썬, 쉽게 배워요!
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-2xl mx-auto animate-slide-up">
            한국어로 배우는 파이썬 프로그래밍.
            <br />
            단계별로 차근차근, 누구나 할 수 있어요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/learn/1"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
            >
              시작하기 (로그인 없이)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login?callbackUrl=/learn/1"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
            >
              시작하기 (로그인하여)
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-green-200 text-sm mt-4">
            ⚠️ 로그인 없이 사용할 경우, 학습 과정이 저장되지 않습니다.
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            왜 Study Python (Korean)인가요?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="쉬운 설명"
              description="어려운 프로그래밍 용어를 일상적인 한국어로 쉽게 풀어서 설명해요."
            />
            <FeatureCard
              icon={<Code className="w-8 h-8" />}
              title="실시간 코딩"
              description="브라우저에서 바로 코드를 실행하고 결과를 확인할 수 있어요."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="단계별 학습"
              description="15개의 체계적인 레벨로 기초부터 탄탄하게 배워요."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="영어 사전"
              description="프로그래밍 영어 단어도 발음과 함께 배울 수 있어요."
            />
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="bg-white dark:bg-slate-800 py-20 px-4 transition-colors">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            무엇을 배우나요?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            총 15개의 레벨로 파이썬 기초를 완벽하게 마스터해요
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              '화면에 출력하기 (print)',
              '변수와 데이터 저장',
              '문자열 다루기',
              '숫자 계산하기',
              '조건문 (if)',
              'for 반복문',
              'while 반복문',
              '리스트 (목록)',
              '리스트 조작하기',
              '함수 만들기',
              '매개변수 사용하기',
              '딕셔너리 (사전)',
              '문자열 변환',
              '종합 실습',
              '최종 도전!',
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            이런 분들께 추천해요
          </h2>
          <div className="space-y-4">
            {[
              '프로그래밍을 처음 배우는 분',
              '영어가 어려워서 코딩을 포기했던 분',
              '파이썬을 기초부터 다시 배우고 싶은 분',
              '자녀와 함께 코딩을 배우고 싶은 부모님',
              '컴퓨터 과학 입문을 준비하는 학생',
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm"
              >
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작하세요!
          </h2>
          <p className="text-xl text-green-100 mb-8">
            무료로 파이썬을 배우고, 새로운 가능성을 열어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/learn/1"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
            >
              시작하기 (로그인 없이)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login?callbackUrl=/learn/1"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
            >
              시작하기 (로그인하여)
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-green-200 text-sm mt-4">
            ⚠️ 로그인 없이 사용할 경우, 학습 과정이 저장되지 않습니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl font-bold text-white">Study Python (Korean)</span>
          </div>
          <p className="text-sm">
            © 2026 Study Python (Korean). 한국어 사용자를 위한 파이썬 학습 플랫폼.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
      <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
