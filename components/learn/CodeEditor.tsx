'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CodeEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** Current code value (현재 코드 값) */
  code: string;
  /** Code change handler (코드 변경 핸들러) */
  onChange: (value: string) => void;
  /** Submit handler (제출 핸들러) */
  onSubmit?: () => void;
  /** Reset handler (초기화 핸들러) */
  onReset?: () => void;
  /** Whether code is being executed (코드 실행 중 여부) */
  isExecuting?: boolean;
  /** Whether Pyodide is loading - only affects button text, not input (Pyodide 로딩 중 - 버튼 텍스트에만 영향) */
  isPyodideLoading?: boolean;
  /** Label for accessibility (접근성용 레이블) */
  label?: string;
}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
      code,
      onChange,
      onSubmit,
      onReset,
      isExecuting = false,
      isPyodideLoading = false,
      label = '코드 작성',
      className,
      ...props
    },
    ref
  ) => {
    // Only disable during actual execution, not during Pyodide background loading
    // (실제 실행 중에만 비활성화, Pyodide 백그라운드 로딩 중에는 비활성화하지 않음)
    const isButtonLoading = isExecuting;

    return (
      <div className="w-full h-full flex flex-col">
        {/* Code textarea */}
        {label && (
          <label className="sr-only" htmlFor="code-editor">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id="code-editor"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full flex-1 min-h-[300px] p-4',
            'font-mono text-sm leading-relaxed',
            'bg-gray-900 text-green-400',
            'border-0 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset',
            'placeholder:text-gray-500',
            className
          )}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label={label}
          disabled={isButtonLoading}
          {...props}
        />

        {/* Action buttons */}
        {(onSubmit || onReset) && (
          <div className="flex gap-2 p-3 bg-gray-800 border-t border-gray-700">
            {onSubmit && (
              <button
                onClick={onSubmit}
                disabled={isButtonLoading}
                className={cn(
                  'flex-1 py-2 px-4 rounded-lg font-bold text-white',
                  'flex items-center justify-center gap-2',
                  'transition-all duration-200',
                  isButtonLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:scale-98'
                )}
                aria-busy={isButtonLoading}
              >
                {isButtonLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>{isPyodideLoading ? '로딩 중...' : '실행 중...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" aria-hidden="true" />
                    <span>실행하기</span>
                  </>
                )}
              </button>
            )}

            {onReset && (
              <button
                onClick={onReset}
                disabled={isButtonLoading}
                className={cn(
                  'py-2 px-4 rounded-lg font-bold',
                  'flex items-center justify-center gap-2',
                  'transition-all duration-200',
                  isButtonLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>초기화</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

CodeEditor.displayName = 'CodeEditor';

export { CodeEditor };
