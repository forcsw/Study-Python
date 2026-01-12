import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors"
        >
          <span className="text-xl font-bold">Study Python (Korean)</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center text-sm text-gray-500">
        © 2026 Study Python (Korean). 한국어 사용자를 위한 파이썬 학습 플랫폼.
      </footer>
    </div>
  );
}
