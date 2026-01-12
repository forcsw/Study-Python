import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: 'Study Python (Korean) - 파이썬 쉽게 배우기',
  description: '한국어 사용자를 위한 파이썬 학습 앱. 단계별로 파이썬을 쉽고 재미있게 배워보세요!',
  keywords: ['파이썬', 'Python', '프로그래밍', '코딩', '학습', '한국어'],
  authors: [{ name: 'Study Python Team' }],
  openGraph: {
    title: 'Study Python (Korean) - 파이썬 쉽게 배우기',
    description: '한국어 사용자를 위한 파이썬 학습 앱',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('studypython_theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
