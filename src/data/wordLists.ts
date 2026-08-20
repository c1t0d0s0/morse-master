import { TargetCharset, DifficultyLevel } from '../types';
import { ALPHABET_MORSE, NUMBER_MORSE, WABUN_MORSE } from './morseData';

export interface QuizWord {
  text: string;
  category: TargetCharset;
  level: DifficultyLevel;
  meaningJa?: string;
  hint?: string;
}

// 初級: 1文字 / 単純な符号
// 中級: 2〜4文字の頻出単語 / 短いコード
// 上級: 5文字以上の単語・熟語・短文 / 濁点交じり

export const WORD_COLLECTIONS: QuizWord[] = [
  // --- 欧文 (Alphabet) ---
  // 初級
  ...ALPHABET_MORSE.map(item => ({
    text: item.char,
    category: 'alphabet' as TargetCharset,
    level: 'beginner' as DifficultyLevel,
    hint: item.mnemonic,
  })),

  // 中級 (2〜4文字)
  { text: 'SOS', category: 'alphabet', level: 'intermediate', meaningJa: '救難信号 (・・・ －－－ ・・・)', hint: '最も有名なモールス信号' },
  { text: 'CQ', category: 'alphabet', level: 'intermediate', meaningJa: '各局呼び出し (無線通信)', hint: '不特定多数への呼びかけ' },
  { text: '73', category: 'alphabet', level: 'intermediate', meaningJa: 'さようなら (Best Regards)', hint: 'アマチュア無線の別れの挨拶' },
  { text: '88', category: 'alphabet', level: 'intermediate', meaningJa: '愛を込めて (Love and kisses)', hint: '親愛を込めた挨拶' },
  { text: 'HI', category: 'alphabet', level: 'intermediate', meaningJa: '笑い・挨拶', hint: '・・・・ ・・' },
  { text: 'OK', category: 'alphabet', level: 'intermediate', meaningJa: '了解', hint: '－－－ －・－' },
  { text: 'NO', category: 'alphabet', level: 'intermediate', meaningJa: '否定', hint: '－・ －－－' },
  { text: 'CAT', category: 'alphabet', level: 'intermediate', meaningJa: '猫', hint: '短い動物名' },
  { text: 'DOG', category: 'alphabet', level: 'intermediate', meaningJa: '犬', hint: '短い動物名' },
  { text: 'SKY', category: 'alphabet', level: 'intermediate', meaningJa: '空', hint: '3文字の英単語' },
  { text: 'SUN', category: 'alphabet', level: 'intermediate', meaningJa: '太陽', hint: '3文字の英単語' },
  { text: 'MOON', category: 'alphabet', level: 'intermediate', meaningJa: '月', hint: '4文字の英単語' },
  { text: 'CODE', category: 'alphabet', level: 'intermediate', meaningJa: '符号・暗号', hint: '4文字の英単語' },
  { text: 'TEST', category: 'alphabet', level: 'intermediate', meaningJa: 'テスト', hint: '4文字の英単語' },

  // 上級 (5文字以上・英文)
  { text: 'RADIO', category: 'alphabet', level: 'advanced', meaningJa: '無線・ラジオ', hint: '5文字の英単語' },
  { text: 'SIGNAL', category: 'alphabet', level: 'advanced', meaningJa: '信号', hint: '6文字の英単語' },
  { text: 'MORSE', category: 'alphabet', level: 'advanced', meaningJa: 'モールス', hint: '考案者サミュエル・モールス' },
  { text: 'HELLO', category: 'alphabet', level: 'advanced', meaningJa: 'こんにちは', hint: '定番の挨拶' },
  { text: 'WIRELESS', category: 'alphabet', level: 'advanced', meaningJa: '無線', hint: '8文字の英単語' },
  { text: 'MAYDAY', category: 'alphabet', level: 'advanced', meaningJa: '国際救難信号', hint: '航空・海上の緊急コール' },
  { text: 'ANTENNA', category: 'alphabet', level: 'advanced', meaningJa: 'アンテナ', hint: '電波の送受信機' },

  // --- 数字 (Number) ---
  ...NUMBER_MORSE.map(item => ({
    text: item.char,
    category: 'number' as TargetCharset,
    level: 'beginner' as DifficultyLevel,
    hint: item.mnemonic,
  })),
  { text: '123', category: 'number', level: 'intermediate', meaningJa: '連番 1-2-3', hint: '短点が増えるリズム' },
  { text: '555', category: 'number', level: 'intermediate', meaningJa: '短い音のみ (・・・・・ x3)', hint: 'オール短点' },
  { text: '000', category: 'number', level: 'intermediate', meaningJa: '長い音のみ (－－－－－ x3)', hint: 'オール長点' },
  { text: '2026', category: 'number', level: 'intermediate', meaningJa: '西暦2026年', hint: '4桁の年号' },
  { text: '119', category: 'number', level: 'intermediate', meaningJa: '緊急通報 (消防・救急)', hint: '日本の緊急電話番号' },
  { text: '110', category: 'number', level: 'intermediate', meaningJa: '緊急通報 (警察)', hint: '日本の警察電話番号' },
  { text: '31415', category: 'number', level: 'advanced', meaningJa: '円周率 (π)', hint: '5桁の連続数字' },
  { text: '99999', category: 'number', level: 'advanced', meaningJa: '9の5連打', hint: '長点4つ+短点1つの反復' },
  { text: '198420', category: 'number', level: 'advanced', meaningJa: '6桁ランダム数字', hint: '長短の切り替わりが多い' },

  // --- 和文 (Wabun) ---
  // 初級: 1文字
  ...WABUN_MORSE.filter(item => !['゛', '゜', '、', '。'].includes(item.char)).map(item => ({
    text: item.char,
    category: 'wabun' as TargetCharset,
    level: 'beginner' as DifficultyLevel,
    hint: item.mnemonic,
  })),

  // 中級 (2〜3文字の単語)
  { text: 'アサ', category: 'wabun', level: 'intermediate', meaningJa: '朝', hint: 'ア(--.--) サ(-.-.-)' },
  { text: 'ネコ', category: 'wabun', level: 'intermediate', meaningJa: '猫', hint: 'ネ(--.-) コ(----)' },
  { text: 'イヌ', category: 'wabun', level: 'intermediate', meaningJa: '犬', hint: 'イ(.-) ヌ(....)' },
  { text: 'ソラ', category: 'wabun', level: 'intermediate', meaningJa: '空', hint: 'ソ(---.) ラ(...)' },
  { text: 'ヤマ', category: 'wabun', level: 'intermediate', meaningJa: '山', hint: 'ヤ(.--) マ(-..-)' },
  { text: 'ウミ', category: 'wabun', level: 'intermediate', meaningJa: '海', hint: 'ウ(..-) ミ(..-.-)' },
  { text: 'トウキョウ', category: 'wabun', level: 'intermediate', meaningJa: '東京', hint: '長音入り' },
  { text: 'フジサン', category: 'wabun', level: 'intermediate', meaningJa: '富士山', hint: 'フ・ジ(シ+゛)・サ・ン' },
  { text: 'ラヂオ', category: 'wabun', level: 'intermediate', meaningJa: 'ラジオ (無線電信)', hint: 'ラ・チ・濁点・オ' },
  { text: 'デンシン', category: 'wabun', level: 'intermediate', meaningJa: '電信 (モールス通信)', hint: 'テ・濁点・ン・シ・ン' },

  // 上級 (長文・濁点/半濁点交じり)
  { text: 'ニホン', category: 'wabun', level: 'advanced', meaningJa: '日本', hint: 'ニ(-.-.) ホ(-..) ン(.-.-.)' },
  { text: 'コンニチハ', category: 'wabun', level: 'advanced', meaningJa: 'こんにちは', hint: '日常の挨拶' },
  { text: 'アリガトウ', category: 'wabun', level: 'advanced', meaningJa: 'ありがとう', hint: 'カ+濁点が含まれる' },
  { text: 'ホンジツセイテンナリ', category: 'wabun', level: 'advanced', meaningJa: '本日晴天ナリ (有名な電文)', hint: '日本の電波実験で使われた有名な文' },
  { text: 'モールスシンゴウ', category: 'wabun', level: 'advanced', meaningJa: 'モールス信号', hint: '長音・濁点を含む重要語' },
  { text: 'ムセンツウシン', category: 'wabun', level: 'advanced', meaningJa: '無線通信', hint: 'ム・セ・ン・ツ・ウ・シ・ン' },
];

/**
 * 難易度と対象カテゴリに基づいてランダムな問題を取得
 */
export function getRandomQuizItem(charset: TargetCharset, level: DifficultyLevel): QuizWord {
  let candidates = WORD_COLLECTIONS.filter(item => {
    const charsetMatch = charset === 'all' || item.category === charset;
    const levelMatch = item.level === level;
    return charsetMatch && levelMatch;
  });

  if (candidates.length === 0) {
    candidates = WORD_COLLECTIONS.filter(item => charset === 'all' || item.category === charset);
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
