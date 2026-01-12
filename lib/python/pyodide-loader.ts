/**
 * Pyodide Loader (Pyodide 로더)
 *
 * Handles loading and initializing Pyodide for browser-based Python execution.
 */

// Pyodide types (Pyodide 타입)
interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
}

declare global {
  interface Window {
    loadPyodide?: (options?: { indexURL?: string }) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/';

/**
 * Load the Pyodide script from CDN
 * (CDN에서 Pyodide 스크립트 로드)
 */
async function loadPyodideScript(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only be loaded in browser environment');
  }

  if (window.loadPyodide) {
    return; // Already loaded
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${PYODIDE_CDN}pyodide.js`;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide script'));

    document.head.appendChild(script);
  });
}

/**
 * Initialize Pyodide
 * (Pyodide 초기화)
 *
 * @returns Promise<PyodideInterface>
 */
export async function initPyodide(): Promise<PyodideInterface> {
  // Return existing instance if available
  if (pyodideInstance) {
    return pyodideInstance;
  }

  // Wait for ongoing loading if in progress
  if (pyodideLoading) {
    return pyodideLoading;
  }

  // Start loading
  pyodideLoading = (async () => {
    try {
      // Load the script first
      await loadPyodideScript();

      // Initialize Pyodide
      if (!window.loadPyodide) {
        throw new Error('loadPyodide not available');
      }

      const pyodide = await window.loadPyodide({
        indexURL: PYODIDE_CDN,
      });

      // Set up stdout capture
      await pyodide.runPythonAsync(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.buffer = StringIO()

    def write(self, text):
        self.buffer.write(text)

    def flush(self):
        pass

    def get_output(self):
        return self.buffer.getvalue()

    def clear(self):
        self.buffer = StringIO()

__output_capture__ = OutputCapture()
sys.stdout = __output_capture__
sys.stderr = __output_capture__
      `);

      pyodideInstance = pyodide;
      return pyodide;
    } catch (error) {
      pyodideLoading = null;
      throw error;
    }
  })();

  return pyodideLoading;
}

/**
 * Check if Pyodide is loaded
 * (Pyodide가 로드되었는지 확인)
 */
export function isPyodideLoaded(): boolean {
  return pyodideInstance !== null;
}

/**
 * Check if Pyodide is currently loading
 * (Pyodide가 현재 로딩 중인지 확인)
 */
export function isPyodideLoading(): boolean {
  return pyodideLoading !== null && pyodideInstance === null;
}

/**
 * Get Pyodide instance
 * (Pyodide 인스턴스 가져오기)
 */
export function getPyodide(): PyodideInterface | null {
  return pyodideInstance;
}

export interface PyodideExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

/**
 * Execute Python code using Pyodide
 * (Pyodide를 사용하여 Python 코드 실행)
 *
 * @param code - Python code to execute
 * @param timeout - Timeout in milliseconds (default: 5000)
 * @returns Execution result
 */
export async function executePythonWithPyodide(
  code: string,
  timeout: number = 5000
): Promise<PyodideExecutionResult> {
  const startTime = performance.now();

  try {
    const pyodide = await initPyodide();

    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Execution timeout')), timeout);
    });

    // Execute with timeout
    const executionPromise = (async () => {
      // Clear previous output
      await pyodide.runPythonAsync('__output_capture__.clear()');

      // Run the user code
      await pyodide.runPythonAsync(code);

      // Get the captured output
      const output = await pyodide.runPythonAsync('__output_capture__.get_output()');

      return String(output).trim();
    })();

    const output = await Promise.race([executionPromise, timeoutPromise]);
    const executionTime = performance.now() - startTime;

    return {
      success: true,
      output,
      executionTime,
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;

    // Parse Python errors for better messages
    let errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Clean up common Python error patterns
    if (errorMessage.includes('Traceback')) {
      const lines = errorMessage.split('\n');
      const lastLine = lines[lines.length - 1] || lines[lines.length - 2];
      if (lastLine && !lastLine.startsWith(' ')) {
        errorMessage = lastLine;
      }
    }

    return {
      success: false,
      output: '',
      error: errorMessage,
      executionTime,
    };
  }
}

/**
 * Reset Pyodide state
 * (Pyodide 상태 초기화)
 */
export async function resetPyodideState(): Promise<void> {
  if (pyodideInstance) {
    await pyodideInstance.runPythonAsync(`
# Clear all user-defined variables
for name in list(globals().keys()):
    if not name.startswith('_') and name not in ['__output_capture__', 'sys', 'StringIO', 'OutputCapture']:
        del globals()[name]

__output_capture__.clear()
    `);
  }
}

/**
 * Check if code is safe to execute
 * (코드가 실행해도 안전한지 확인)
 */
export function isCodeSafe(code: string): boolean {
  // Dangerous patterns to block
  const dangerousPatterns = [
    /import\s+os/,
    /import\s+subprocess/,
    /import\s+sys\s*(?:[^t]|$)/, // Allow 'import sys' for stdout
    /exec\s*\(/,
    /eval\s*\(/,
    /__import__/,
    /open\s*\(/,
    /file\s*\(/,
    /compile\s*\(/,
    /globals\s*\(\s*\)\s*\[/,
    /locals\s*\(\s*\)\s*\[/,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(code));
}
