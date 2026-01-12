'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              오류가 발생했어요
            </h2>
            <p className="text-gray-600 mb-6">
              예상치 못한 문제가 발생했습니다. 다시 시도해 주세요.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left bg-gray-100 p-4 rounded-lg">
                <summary className="cursor-pointer text-sm text-gray-500">
                  오류 상세 정보
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <Button onClick={this.handleRetry} variant="primary">
              <RefreshCcw className="w-4 h-4" />
              다시 시도
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple error display component (for non-boundary use)
export function ErrorDisplay({
  title = '오류가 발생했어요',
  message = '예상치 못한 문제가 발생했습니다.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center p-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4" />
          다시 시도
        </Button>
      )}
    </div>
  );
}
