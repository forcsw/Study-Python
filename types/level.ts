// Korean dictionary word type (국어 사전 단어 타입)
export interface DictionaryWord {
  word: string;
  pos: string; // Part of speech (품사)
  meaning: string;
}

// English dictionary word type (영어 사전 단어 타입)
export interface EnglishDictionaryWord {
  word: string;
  phonetic: string; // Korean phonetic (한글 발음)
  pos: string;
  plural?: string | null;
  pluralPhonetic?: string;
  singular?: string | null;
  singularPhonetic?: string;
  fullForm?: string; // For abbreviations (줄임말의 원래 형태)
  fullFormPhonetic?: string;
  meaning: string;
  codingUse: string; // Usage in coding context (코딩에서의 활용)
}

// Execution step in detailed explanation (상세 설명의 실행 단계)
export interface ExecutionStep {
  round: string;
  desc: string;
  result: string | null;
}

// Detailed explanation structure (상세 설명 구조)
export interface DetailedExplanation {
  title: string;
  steps: ExecutionStep[];
  summary: string;
}

// Level definition (레벨 정의)
export interface Level {
  id: number;
  title: string;
  description: string;
  easyExplain: string[];
  koreanDict: DictionaryWord[];
  englishDict: EnglishDictionaryWord[];
  detailedExplain: DetailedExplanation;
  task: string;
  starterCode: string;
  expectedOutput: string;
  hint: string;
  hintExplain: string;
  solution: string;
}

// Level completion status (레벨 완료 상태)
export interface LevelStatus {
  levelId: number;
  completed: boolean;
  attempts: number;
  completedAt?: Date;
  timeSpent?: number; // in seconds
}
