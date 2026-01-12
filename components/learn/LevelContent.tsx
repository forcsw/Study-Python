'use client';

import { useState, useEffect, useCallback } from 'react';
import { Level } from '@/types';
import { CodeEditor } from './CodeEditor';
import { FeedbackDisplay } from './FeedbackDisplay';
import { EasyExplain } from './EasyExplain';
import { DictionarySection } from './DictionarySection';
import { DetailedExplain } from './DetailedExplain';
import { HintSection } from './HintSection';
import { TaskDescription } from './TaskDescription';
import { LevelNavigation } from './LevelNavigation';
import { usePyodide } from '@/lib/hooks/usePyodide';
import { TOTAL_LEVELS } from '@/data/levels';

export interface LevelContentProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onNavigate: (levelId: number) => void;
  isCompleted?: boolean;
}

export function LevelContent({
  level,
  onComplete,
  onNavigate,
  isCompleted = false,
}: LevelContentProps) {
  const [userCode, setUserCode] = useState(level.starterCode);
  const [showHint, setShowHint] = useState(false);
  const [showDetailedExplain, setShowDetailedExplain] = useState(false);
  const [showKoreanDict, setShowKoreanDict] = useState(false);
  const [showEnglishDict, setShowEnglishDict] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    output: string;
    expected?: string;
  } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const { execute, getHint, loadPyodide, isLoading: isPyodideLoading } = usePyodide({
    autoLoad: true,
  });

  // Reset state when level changes
  useEffect(() => {
    setUserCode(level.starterCode);
    setShowHint(false);
    setShowDetailedExplain(false);
    setShowKoreanDict(false);
    setShowEnglishDict(false);
    setFeedback(null);
  }, [level.id, level.starterCode]);

  const handleSubmit = useCallback(async () => {
    setIsExecuting(true);
    setFeedback(null);

    try {
      const result = await execute(userCode);

      if (result.success) {
        const output = result.output.trim();
        const expected = level.expectedOutput.trim();

        if (output === expected) {
          setFeedback({
            type: 'success',
            message: '🎉 정답이에요! 아주 잘했어요!',
            output,
          });
          onComplete(level.id);
        } else {
          setFeedback({
            type: 'error',
            message: '아쉬워요, 다시 한번 해볼까요?',
            output: output || '(출력 없음)',
            expected,
          });
        }
      } else {
        const errorHint = result.error ? getHint(result.error) : undefined;
        setFeedback({
          type: 'error',
          message: errorHint || '코드에 오류가 있어요. 다시 확인해볼까요?',
          output: result.error || '오류 발생',
          expected: level.expectedOutput,
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: '코드 실행 중 오류가 발생했습니다.',
        output: error instanceof Error ? error.message : '알 수 없는 오류',
        expected: level.expectedOutput,
      });
    } finally {
      setIsExecuting(false);
    }
  }, [userCode, level.expectedOutput, level.id, execute, getHint, onComplete]);

  const handleReset = () => {
    setUserCode(level.starterCode);
    setFeedback(null);
    setShowHint(false);
  };

  const handlePrevious = () => {
    if (level.id > 1) {
      onNavigate(level.id - 1);
    }
  };

  const handleNext = () => {
    if (level.id < TOTAL_LEVELS) {
      onNavigate(level.id + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Learning Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 max-h-[75vh] overflow-y-auto transition-colors duration-300">
          {/* Level Title */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              단계 {level.id}: {level.title}
              {isCompleted && (
                <span className="ml-2 text-emerald-500" aria-label="완료됨">
                  ✓
                </span>
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{level.description}</p>
          </div>

          {/* All sections with consistent spacing */}
          <div className="space-y-4">
            {/* Easy Explain */}
            <EasyExplain explanations={level.easyExplain} />

            {/* Dictionary Section */}
            <DictionarySection
              koreanDict={level.koreanDict}
              englishDict={level.englishDict}
              showKorean={showKoreanDict}
              showEnglish={showEnglishDict}
              onToggleKorean={() => setShowKoreanDict(!showKoreanDict)}
              onToggleEnglish={() => setShowEnglishDict(!showEnglishDict)}
            />

            {/* Detailed Explain */}
            {level.detailedExplain && (
              <DetailedExplain
                detailedExplain={level.detailedExplain}
                isOpen={showDetailedExplain}
                onToggle={() => setShowDetailedExplain(!showDetailedExplain)}
              />
            )}

            {/* Task Description */}
            <TaskDescription task={level.task} />

            {/* Hint Section */}
            <HintSection
              hint={level.hint}
              hintExplain={level.hintExplain}
              showHint={showHint}
              onToggle={() => setShowHint(!showHint)}
            />

            {/* Feedback */}
            {feedback && (
              <FeedbackDisplay feedback={feedback} />
            )}
          </div>
        </div>

        {/* Right Column - Code Editor */}
        <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden">
          <CodeEditor
            code={userCode}
            onChange={setUserCode}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isExecuting={isExecuting}
            isPyodideLoading={isPyodideLoading}
          />
        </div>
      </div>

      {/* Navigation */}
      <LevelNavigation
        currentLevel={level.id}
        totalLevels={TOTAL_LEVELS}
        onPrevious={handlePrevious}
        onNext={handleNext}
        className="mt-4"
      />
    </div>
  );
}
