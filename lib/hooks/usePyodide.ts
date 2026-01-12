'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  initPyodide,
  isPyodideLoaded,
  isPyodideLoading,
  executeCode,
  executeCodeSync,
  getErrorHint,
  type ExecutionResult,
  type ExecuteCodeOptions,
} from '@/lib/python';

export interface UsePyodideOptions {
  autoLoad?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface UsePyodideReturn {
  isLoading: boolean;
  isReady: boolean;
  loadError: string | null;
  execute: (code: string, options?: ExecuteCodeOptions) => Promise<ExecutionResult>;
  executeSync: (code: string) => ExecutionResult;
  getHint: (error: string) => string;
  loadPyodide: () => Promise<void>;
}

/**
 * Hook for using Pyodide in components
 * (컴포넌트에서 Pyodide를 사용하기 위한 훅)
 *
 * @param options - Configuration options
 * @returns Pyodide utilities
 *
 * @example
 * ```tsx
 * function CodeEditor() {
 *   const { isReady, execute } = usePyodide({ autoLoad: true });
 *
 *   const handleRun = async () => {
 *     const result = await execute('print("Hello")');
 *     console.log(result.output);
 *   };
 *
 *   return (
 *     <button onClick={handleRun} disabled={!isReady}>
 *       Run Code
 *     </button>
 *   );
 * }
 * ```
 */
export function usePyodide(options: UsePyodideOptions = {}): UsePyodideReturn {
  const { autoLoad = false, onLoad, onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Check initial state
  useEffect(() => {
    if (isPyodideLoaded()) {
      setIsReady(true);
    } else if (isPyodideLoading()) {
      setIsLoading(true);
    }
  }, []);

  // Auto-load Pyodide if enabled
  useEffect(() => {
    if (autoLoad && !isPyodideLoaded() && !isPyodideLoading()) {
      loadPyodideInstance();
    }
  }, [autoLoad]);

  const loadPyodideInstance = useCallback(async () => {
    if (isPyodideLoaded()) {
      setIsReady(true);
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      await initPyodide();
      setIsReady(true);
      onLoad?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Pyodide';
      setLoadError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onLoad, onError]);

  const execute = useCallback(
    async (code: string, execOptions?: ExecuteCodeOptions): Promise<ExecutionResult> => {
      return executeCode(code, execOptions);
    },
    []
  );

  const executeSync = useCallback((code: string): ExecutionResult => {
    return executeCodeSync(code);
  }, []);

  const getHint = useCallback((error: string): string => {
    return getErrorHint(error);
  }, []);

  return {
    isLoading,
    isReady,
    loadError,
    execute,
    executeSync,
    getHint,
    loadPyodide: loadPyodideInstance,
  };
}

/**
 * Hook for speech synthesis (TTS)
 * (음성 합성을 위한 훅)
 *
 * @returns Speech utilities
 */
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      // Load voices
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: 'en-US' | 'ko-KR' = 'en-US') => {
      if (!isSupported) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;
      utterance.pitch = 1.1;

      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices =
        lang === 'en-US'
          ? ['Google US English', 'Samantha', 'Karen', 'Microsoft Zira']
          : ['Google 한국어', 'Yuna'];

      let selectedVoice = null;
      for (const voiceName of preferredVoices) {
        selectedVoice = voices.find((v) => v.name.includes(voiceName));
        if (selectedVoice) break;
      }

      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}
