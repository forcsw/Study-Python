/**
 * Python Execution Module (Python 실행 모듈)
 *
 * Exports all Python execution utilities.
 */

export {
  executeWithPatternMatching,
  checkOutput,
  type PatternMatchResult,
} from './pattern-matcher';

export {
  initPyodide,
  isPyodideLoaded,
  isPyodideLoading,
  getPyodide,
  executePythonWithPyodide,
  resetPyodideState,
  isCodeSafe,
  type PyodideExecutionResult,
} from './pyodide-loader';

export {
  executeCode,
  executeCodeSync,
  checkCodeOutput,
  getErrorHint,
  type ExecutionResult,
  type ExecuteCodeOptions,
} from './code-executor';
