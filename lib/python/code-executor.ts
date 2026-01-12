/**
 * Code Executor (코드 실행기)
 *
 * Unified Python code execution with Pyodide and pattern matching fallback.
 * (Pyodide와 패턴 매칭 폴백을 사용한 통합 Python 코드 실행)
 */

import {
  executePythonWithPyodide,
  isPyodideLoaded,
  isCodeSafe,
  PyodideExecutionResult,
} from './pyodide-loader';
import { executeWithPatternMatching, PatternMatchResult } from './pattern-matcher';

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  method: 'pyodide' | 'pattern-matching';
}

export interface ExecuteCodeOptions {
  preferPyodide?: boolean;
  timeout?: number;
  fallbackOnError?: boolean;
}

const DEFAULT_OPTIONS: ExecuteCodeOptions = {
  preferPyodide: true,
  timeout: 5000,
  fallbackOnError: true,
};

/**
 * Execute Python code
 * (Python 코드 실행)
 *
 * Uses Pyodide when available, falls back to pattern matching.
 *
 * @param code - Python code to execute
 * @param options - Execution options
 * @returns Execution result
 */
export async function executeCode(
  code: string,
  options: ExecuteCodeOptions = {}
): Promise<ExecutionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check if code is safe
  if (!isCodeSafe(code)) {
    return {
      success: false,
      output: '',
      error: '안전하지 않은 코드가 감지되었습니다.',
      method: 'pattern-matching',
    };
  }

  // Try Pyodide first if preferred and loaded
  if (opts.preferPyodide && isPyodideLoaded()) {
    try {
      const result: PyodideExecutionResult = await executePythonWithPyodide(
        code,
        opts.timeout
      );

      if (result.success) {
        return {
          ...result,
          method: 'pyodide',
        };
      }

      // If Pyodide failed and fallback is enabled, try pattern matching
      if (opts.fallbackOnError) {
        const fallbackResult = executeWithPatternMatching(code);
        if (fallbackResult.success && fallbackResult.output) {
          return {
            success: true,
            output: fallbackResult.output,
            method: 'pattern-matching',
          };
        }
      }

      // Return Pyodide error
      return {
        success: false,
        output: '',
        error: result.error,
        executionTime: result.executionTime,
        method: 'pyodide',
      };
    } catch (error) {
      // Pyodide failed, try pattern matching
      if (opts.fallbackOnError) {
        const fallbackResult = executeWithPatternMatching(code);
        return {
          ...fallbackResult,
          method: 'pattern-matching',
        };
      }

      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'pyodide',
      };
    }
  }

  // Use pattern matching as primary method
  const patternResult: PatternMatchResult = executeWithPatternMatching(code);

  return {
    success: patternResult.success,
    output: patternResult.output,
    error: patternResult.error,
    method: 'pattern-matching',
  };
}

/**
 * Execute code synchronously using pattern matching only
 * (패턴 매칭만 사용하여 동기적으로 코드 실행)
 *
 * Useful for quick feedback without waiting for Pyodide
 *
 * @param code - Python code to execute
 * @returns Execution result
 */
export function executeCodeSync(code: string): ExecutionResult {
  if (!isCodeSafe(code)) {
    return {
      success: false,
      output: '',
      error: '안전하지 않은 코드가 감지되었습니다.',
      method: 'pattern-matching',
    };
  }

  const result = executeWithPatternMatching(code);

  return {
    ...result,
    method: 'pattern-matching',
  };
}

/**
 * Check if code output matches expected output
 * (코드 출력이 예상 출력과 일치하는지 확인)
 *
 * @param code - Python code to execute
 * @param expectedOutput - Expected output
 * @param options - Execution options
 * @returns true if output matches
 */
export async function checkCodeOutput(
  code: string,
  expectedOutput: string,
  options: ExecuteCodeOptions = {}
): Promise<boolean> {
  const result = await executeCode(code, options);

  if (!result.success) {
    return false;
  }

  return normalizeOutput(result.output) === normalizeOutput(expectedOutput);
}

/**
 * Normalize output for comparison
 * (비교를 위해 출력 정규화)
 */
function normalizeOutput(output: string): string {
  return output
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
}

/**
 * Get hint for common errors
 * (일반적인 오류에 대한 힌트 제공)
 *
 * @param error - Error message
 * @returns Hint message in Korean
 */
export function getErrorHint(error: string): string {
  const errorLower = error.toLowerCase();

  if (errorLower.includes('syntaxerror')) {
    if (errorLower.includes('eol')) {
      return "문자열의 따옴표가 제대로 닫히지 않았어요. ' 또는 \" 를 확인하세요!";
    }
    if (errorLower.includes('unexpected indent')) {
      return '들여쓰기가 잘못되었어요. 스페이스 4칸을 사용하세요!';
    }
    if (errorLower.includes('expected')) {
      return '문법 오류가 있어요. 괄호, 콜론(:), 따옴표를 확인하세요!';
    }
    return '코드 문법에 문제가 있어요. 오타를 확인해보세요!';
  }

  if (errorLower.includes('nameerror')) {
    return '정의되지 않은 변수나 함수를 사용했어요. 이름 철자를 확인하세요!';
  }

  if (errorLower.includes('typeerror')) {
    return '잘못된 타입의 값을 사용했어요. 숫자와 문자열을 확인하세요!';
  }

  if (errorLower.includes('indexerror')) {
    return '리스트 인덱스가 범위를 벗어났어요. 인덱스는 0부터 시작해요!';
  }

  if (errorLower.includes('keyerror')) {
    return '딕셔너리에 없는 키를 사용했어요. 키 이름을 확인하세요!';
  }

  if (errorLower.includes('indentationerror')) {
    return '들여쓰기가 잘못되었어요. 모든 블록은 스페이스 4칸으로 들여쓰세요!';
  }

  if (errorLower.includes('timeout')) {
    return '코드 실행 시간이 너무 오래 걸렸어요. 무한 반복이 없는지 확인하세요!';
  }

  return '오류가 발생했어요. 코드를 다시 확인해보세요!';
}
