'use client';

import { useState, useCallback } from 'react';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DictionaryWord, EnglishDictionaryWord } from '@/types';

// Text-to-Speech hook
function useSpeech() {
  const speak = useCallback((word: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      const voices = window.speechSynthesis.getVoices();

      const preferredVoices = ['Google US English', 'Samantha', 'Karen', 'Microsoft Zira'];
      let selectedVoice = null;

      for (const voiceName of preferredVoices) {
        selectedVoice = voices.find(v => v.name.includes(voiceName));
        if (selectedVoice) break;
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
}

// Korean Dictionary Section Props
export interface KoreanDictionarySectionProps {
  words: DictionaryWord[];
  defaultOpen?: boolean;
}

// Korean Dictionary Section
export function KoreanDictionarySection({
  words,
  defaultOpen = false,
}: KoreanDictionarySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl overflow-hidden transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="korean-dict-content"
      >
        <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <span aria-hidden="true">📖</span>
          국어 사전
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div id="korean-dict-content" className="p-4 pt-0 space-y-2">
          {words.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-700 p-3 rounded-lg border border-blue-100 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-blue-700 dark:text-blue-300">{item.word}</span>
                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  {item.pos}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-300 text-sm">{item.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// English Dictionary Section Props
export interface EnglishDictionarySectionProps {
  words: EnglishDictionaryWord[];
  defaultOpen?: boolean;
}

// English Dictionary Section
export function EnglishDictionarySection({
  words,
  defaultOpen = false,
}: EnglishDictionarySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { speak } = useSpeech();

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl overflow-hidden transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="english-dict-content"
      >
        <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <span aria-hidden="true">🔤</span>
          영어 사전
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div id="english-dict-content" className="p-4 pt-0 space-y-2">
          {words.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
            >
              {/* Word header */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                  {item.word}
                </span>
                <button
                  onClick={() => speak(item.word)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors"
                  title="발음 듣기"
                  aria-label={`${item.word} 발음 듣기`}
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-blue-600 dark:text-blue-400 text-sm">[{item.phonetic}]</span>
                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  {item.pos}
                </span>
              </div>

              {/* Full form for abbreviations */}
              {item.fullForm && (
                <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/50 rounded text-sm">
                  <span className="text-gray-500 dark:text-gray-400">원래 형태: </span>
                  <span className="font-medium text-blue-700 dark:text-blue-300">{item.fullForm}</span>
                  <button
                    onClick={() => speak(item.fullForm!)}
                    className="ml-2 bg-blue-400 hover:bg-blue-500 text-white p-0.5 rounded-full"
                    aria-label={`${item.fullForm} 발음 듣기`}
                  >
                    <Volume2 className="w-3 h-3" aria-hidden="true" />
                  </button>
                  {item.fullFormPhonetic && (
                    <span className="text-blue-600 dark:text-blue-400 ml-1">[{item.fullFormPhonetic}]</span>
                  )}
                </div>
              )}

              {/* Singular form */}
              {item.singular && (
                <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/50 rounded text-sm">
                  <span className="text-gray-500 dark:text-gray-400">단수형: </span>
                  <span className="font-medium text-green-700 dark:text-green-300">{item.singular}</span>
                  <button
                    onClick={() => speak(item.singular!)}
                    className="ml-2 bg-green-500 hover:bg-green-600 text-white p-0.5 rounded-full"
                    aria-label={`${item.singular} 발음 듣기`}
                  >
                    <Volume2 className="w-3 h-3" aria-hidden="true" />
                  </button>
                  {item.singularPhonetic && (
                    <span className="text-green-600 dark:text-green-400 ml-1">[{item.singularPhonetic}]</span>
                  )}
                </div>
              )}

              {/* Plural form */}
              {item.plural && (
                <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-900/50 rounded text-sm">
                  <span className="text-gray-500 dark:text-gray-400">복수형: </span>
                  <span className="font-medium text-amber-700 dark:text-amber-300">{item.plural}</span>
                  <button
                    onClick={() => speak(item.plural!)}
                    className="ml-2 bg-amber-500 hover:bg-amber-600 text-white p-0.5 rounded-full"
                    aria-label={`${item.plural} 발음 듣기`}
                  >
                    <Volume2 className="w-3 h-3" aria-hidden="true" />
                  </button>
                  {item.pluralPhonetic && (
                    <span className="text-amber-600 dark:text-amber-400 ml-1">[{item.pluralPhonetic}]</span>
                  )}
                </div>
              )}

              {/* Meaning and coding use */}
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500 dark:text-gray-400">뜻:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">{item.meaning}</span>
                </p>
                <p>
                  <span className="text-gray-500 dark:text-gray-400">코딩에서:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">{item.codingUse}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Combined Dictionary Component Props
export interface DictionarySectionProps {
  koreanDict: DictionaryWord[];
  englishDict: EnglishDictionaryWord[];
  showKorean?: boolean;
  showEnglish?: boolean;
  onToggleKorean?: () => void;
  onToggleEnglish?: () => void;
  className?: string;
}

// Combined Dictionary Component
export function DictionarySection({
  koreanDict,
  englishDict,
  showKorean = false,
  showEnglish = false,
  onToggleKorean,
  onToggleEnglish,
  className,
}: DictionarySectionProps) {
  const [internalShowKorean, setInternalShowKorean] = useState(showKorean);
  const [internalShowEnglish, setInternalShowEnglish] = useState(showEnglish);

  const handleToggleKorean = () => {
    if (onToggleKorean) {
      onToggleKorean();
    } else {
      setInternalShowKorean(!internalShowKorean);
    }
  };

  const handleToggleEnglish = () => {
    if (onToggleEnglish) {
      onToggleEnglish();
    } else {
      setInternalShowEnglish(!internalShowEnglish);
    }
  };

  const isKoreanOpen = onToggleKorean ? showKorean : internalShowKorean;
  const isEnglishOpen = onToggleEnglish ? showEnglish : internalShowEnglish;

  return (
    <div className={cn('space-y-4', className)}>
      <KoreanDictionarySection words={koreanDict} defaultOpen={isKoreanOpen} />
      <EnglishDictionarySection words={englishDict} defaultOpen={isEnglishOpen} />
    </div>
  );
}
