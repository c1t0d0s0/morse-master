export type MorseCategory = 'alphabet' | 'number' | 'wabun' | 'symbol';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type QuizMode = 'listening' | 'tapping' | 'reference' | 'translator' | 'free-keyer';
export type TargetCharset = 'all' | 'alphabet' | 'number' | 'wabun';
export type KeyingMode = 'paddle' | 'straight';

export interface MorseItem {
  char: string;
  code: string; // e.g. ".-", "-...", "..-." using '.' for dot and '-' for dash
  category: MorseCategory;
  nameJa: string;
  mnemonic?: string; // 覚え方 / 語呂合わせ (例: "A: アメー", "B: ビートたけし", etc.)
  soundDisplay?: string; // 視覚表示用 (例: "・－")
}

export interface QuizQuestion {
  id: string;
  targetText: string;
  morseCode: string; // e.g. ".- -... -.-."
  category: TargetCharset;
  level: DifficultyLevel;
  items: MorseItem[];
  hint?: string;
}

export interface AudioEngineSettings {
  wpm: number;          // Words Per Minute (default: 15)
  frequency: number;    // Hz (default: 650)
  volume: number;       // 0.0 to 1.0 (default: 0.8)
  visualOnly: boolean;  // 音を出さず視覚のみで練習 (default: false)
  farnsworthWpm?: number; // Farnsworth spacing
}

export interface QuizStats {
  total: number;
  correct: number;
  streak: number;
  bestStreak: number;
  history: Array<{
    targetText: string;
    userInput: string;
    isCorrect: boolean;
    timestamp: number;
  }>;
}
