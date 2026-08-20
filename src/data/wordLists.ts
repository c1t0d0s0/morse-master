import { TargetCharset, DifficultyLevel } from '../types';
import { ALPHABET_MORSE, NUMBER_MORSE, WABUN_MORSE } from './morseData';

export interface QuizWord {
  text: string;
  category: TargetCharset;
  level: DifficultyLevel;
  meaningJa?: string;
  meaningEn?: string;
  hint?: string;
  hintEn?: string;
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
    hintEn: item.mnemonicEn,
  })),

  // 中級 (2〜4文字)
  { text: 'SOS', category: 'alphabet', level: 'intermediate', meaningJa: '救難信号 (・・・ －－－ ・・・)', meaningEn: 'Distress Signal (・・・ －－－ ・・・)', hint: '最も有名なモールス信号', hintEn: 'Most famous distress signal' },
  { text: 'CQ', category: 'alphabet', level: 'intermediate', meaningJa: '各局呼び出し (無線通信)', meaningEn: 'Calling any station', hint: '不特定多数への呼びかけ', hintEn: 'General call to all stations' },
  { text: '73', category: 'alphabet', level: 'intermediate', meaningJa: 'さようなら (Best Regards)', meaningEn: 'Best Regards (Ham radio)', hint: 'アマチュア無線の別れの挨拶', hintEn: 'Standard ham radio sign-off' },
  { text: '88', category: 'alphabet', level: 'intermediate', meaningJa: '愛を込めて (Love and kisses)', meaningEn: 'Love and kisses', hint: '親愛を込めた挨拶', hintEn: 'Affectionate radio greeting' },
  { text: 'HI', category: 'alphabet', level: 'intermediate', meaningJa: '笑い・挨拶', meaningEn: 'Laughter / Greeting', hint: '・・・・ ・・', hintEn: '・・・・ ・・' },
  { text: 'OK', category: 'alphabet', level: 'intermediate', meaningJa: '了解', meaningEn: 'All correct / OK', hint: '－－－ －・－', hintEn: '－－－ －・－' },
  { text: 'NO', category: 'alphabet', level: 'intermediate', meaningJa: '否定', meaningEn: 'Negative / No', hint: '－・ －－－', hintEn: '－・ －－－' },
  { text: 'CAT', category: 'alphabet', level: 'intermediate', meaningJa: '猫', meaningEn: 'Cat', hint: '短い動物名', hintEn: '3-letter animal name' },
  { text: 'DOG', category: 'alphabet', level: 'intermediate', meaningJa: '犬', meaningEn: 'Dog', hint: '短い動物名', hintEn: '3-letter animal name' },
  { text: 'SKY', category: 'alphabet', level: 'intermediate', meaningJa: '空', meaningEn: 'Sky', hint: '3文字の英単語', hintEn: '3-letter English word' },
  { text: 'SUN', category: 'alphabet', level: 'intermediate', meaningJa: '太陽', meaningEn: 'Sun', hint: '3文字の英単語', hintEn: '3-letter English word' },
  { text: 'MOON', category: 'alphabet', level: 'intermediate', meaningJa: '月', meaningEn: 'Moon', hint: '4文字の英単語', hintEn: '4-letter English word' },
  { text: 'CODE', category: 'alphabet', level: 'intermediate', meaningJa: '符号・暗号', meaningEn: 'Code / Cipher', hint: '4文字の英単語', hintEn: '4-letter English word' },
  { text: 'TEST', category: 'alphabet', level: 'intermediate', meaningJa: 'テスト', meaningEn: 'Test / Practice', hint: '4文字の英単語', hintEn: '4-letter English word' },

  // 上級 (5文字以上・英文)
  { text: 'RADIO', category: 'alphabet', level: 'advanced', meaningJa: '無線・ラジオ', meaningEn: 'Radio / Wireless', hint: '5文字の英単語', hintEn: '5-letter English word' },
  { text: 'SIGNAL', category: 'alphabet', level: 'advanced', meaningJa: '信号', meaningEn: 'Signal', hint: '6文字の英単語', hintEn: '6-letter English word' },
  { text: 'MORSE', category: 'alphabet', level: 'advanced', meaningJa: 'モールス', meaningEn: 'Samuel Morse', hint: '考案者サミュエル・モールス', hintEn: 'Inventor Samuel Morse' },
  { text: 'HELLO', category: 'alphabet', level: 'advanced', meaningJa: 'こんにちは', meaningEn: 'Hello / Greeting', hint: '定番の挨拶', hintEn: 'Common greeting' },
  { text: 'WIRELESS', category: 'alphabet', level: 'advanced', meaningJa: '無線', meaningEn: 'Wireless communication', hint: '8文字の英単語', hintEn: '8-letter English word' },
  { text: 'MAYDAY', category: 'alphabet', level: 'advanced', meaningJa: '国際救難信号', meaningEn: 'International distress call', hint: '航空・海上の緊急コール', hintEn: 'Emergency radiotelephone call' },
  { text: 'ANTENNA', category: 'alphabet', level: 'advanced', meaningJa: 'アンテナ', meaningEn: 'Antenna / Aerial', hint: '電波の送受信機', hintEn: 'Radio transceiver component' },

  // --- 数字 (Number) ---
  ...NUMBER_MORSE.map(item => ({
    text: item.char,
    category: 'number' as TargetCharset,
    level: 'beginner' as DifficultyLevel,
    hint: item.mnemonic,
    hintEn: item.mnemonicEn,
  })),
  { text: '123', category: 'number', level: 'intermediate', meaningJa: '連番 1-2-3', meaningEn: 'Sequence 1-2-3', hint: '短点が増えるリズム', hintEn: 'Increasing dots rhythm' },
  { text: '555', category: 'number', level: 'intermediate', meaningJa: '短い音のみ (・・・・・ x3)', meaningEn: 'All short dots (..... x3)', hint: 'オール短点', hintEn: 'All short dots' },
  { text: '000', category: 'number', level: 'intermediate', meaningJa: '長い音のみ (－－－－－ x3)', meaningEn: 'All long dashes (----- x3)', hint: 'オール長点', hintEn: 'All long dashes' },
  { text: '2026', category: 'number', level: 'intermediate', meaningJa: '西暦2026年', meaningEn: 'Year 2026', hint: '4桁の年号', hintEn: '4-digit year' },
  { text: '119', category: 'number', level: 'intermediate', meaningJa: '緊急通報 (消防・救急)', meaningEn: 'Emergency (Fire/Ambulance JP)', hint: '日本の緊急電話番号', hintEn: 'Emergency dial number' },
  { text: '110', category: 'number', level: 'intermediate', meaningJa: '緊急通報 (警察)', meaningEn: 'Emergency (Police JP)', hint: '日本の警察電話番号', hintEn: 'Police emergency number' },
  { text: '31415', category: 'number', level: 'advanced', meaningJa: '円周率 (π)', meaningEn: 'Pi (3.1415)', hint: '5桁の連続数字', hintEn: 'First 5 digits of Pi' },
  { text: '99999', category: 'number', level: 'advanced', meaningJa: '9の5連打', meaningEn: 'Five nines', hint: '長点4つ+短点1つの反復', hintEn: '4 dashes + 1 dot repeated' },
  { text: '198420', category: 'number', level: 'advanced', meaningJa: '6桁ランダム数字', meaningEn: '6-digit number sequence', hint: '長短の切り替わりが多い', hintEn: 'Mixed dots and dashes' },

  // --- 和文 (Wabun) ---
  // 初級: 1文字
  ...WABUN_MORSE.filter(item => !['゛', '゜', '、', '。'].includes(item.char)).map(item => ({
    text: item.char,
    category: 'wabun' as TargetCharset,
    level: 'beginner' as DifficultyLevel,
    hint: item.mnemonic,
    hintEn: item.mnemonicEn,
  })),

  // 中級 (2〜3文字の単語)
  { text: 'アサ', category: 'wabun', level: 'intermediate', meaningJa: '朝', meaningEn: 'Morning (Asa)', hint: 'ア(--.--) サ(-.-.-)', hintEn: 'A(--.--) Sa(-.-.-)' },
  { text: 'ネコ', category: 'wabun', level: 'intermediate', meaningJa: '猫', meaningEn: 'Cat (Neko)', hint: 'ネ(--.-) コ(----)', hintEn: 'Ne(--.-) Ko(----)' },
  { text: 'イヌ', category: 'wabun', level: 'intermediate', meaningJa: '犬', meaningEn: 'Dog (Inu)', hint: 'イ(.-) ヌ(....)', hintEn: 'I(.-) Nu(....)' },
  { text: 'ソラ', category: 'wabun', level: 'intermediate', meaningJa: '空', meaningEn: 'Sky (Sora)', hint: 'ソ(---.) ラ(...)', hintEn: 'So(---.) Ra(...)' },
  { text: 'ヤマ', category: 'wabun', level: 'intermediate', meaningJa: '山', meaningEn: 'Mountain (Yama)', hint: 'ヤ(.--) マ(-..-)', hintEn: 'Ya(.--) Ma(-..-)' },
  { text: 'ウミ', category: 'wabun', level: 'intermediate', meaningJa: '海', meaningEn: 'Ocean (Umi)', hint: 'ウ(..-) ミ(..-.-)', hintEn: 'U(..-) Mi(..-.-)' },
  { text: 'トウキョウ', category: 'wabun', level: 'intermediate', meaningJa: '東京', meaningEn: 'Tokyo', hint: '長音入り', hintEn: 'With long vowel' },
  { text: 'フジサン', category: 'wabun', level: 'intermediate', meaningJa: '富士山', meaningEn: 'Mt. Fuji', hint: 'フ・ジ(シ+゛)・サ・ン', hintEn: 'Fu / Ji / Sa / N' },
  { text: 'ラヂオ', category: 'wabun', level: 'intermediate', meaningJa: 'ラジオ (無線電信)', meaningEn: 'Radio / Wireless', hint: 'ラ・チ・濁点・オ', hintEn: 'Ra / Chi + Dakuten / O' },
  { text: 'デンシン', category: 'wabun', level: 'intermediate', meaningJa: '電信 (モールス通信)', meaningEn: 'Telegraph / Morse', hint: 'テ・濁点・ン・シ・ン', hintEn: 'Te + Dakuten / N / Shi / N' },

  // 上級 (長文・濁点/半濁点交じり)
  { text: 'ニホン', category: 'wabun', level: 'advanced', meaningJa: '日本', meaningEn: 'Japan (Nihon)', hint: 'ニ(-.-.) ホ(-..) ン(.-.-.)', hintEn: 'Ni(-.-.) Ho(-..) N(.-.-.)' },
  { text: 'コンニチハ', category: 'wabun', level: 'advanced', meaningJa: 'こんにちは', meaningEn: 'Hello (Konnichiwa)', hint: '日常の挨拶', hintEn: 'Common greeting' },
  { text: 'アリガトウ', category: 'wabun', level: 'advanced', meaningJa: 'ありがとう', meaningEn: 'Thank you (Arigatou)', hint: 'カ+濁点が含まれる', hintEn: 'Includes Ka + Dakuten' },
  { text: 'ホンジツセイテンナリ', category: 'wabun', level: 'advanced', meaningJa: '本日晴天ナリ (有名な電文)', meaningEn: 'Fine weather today (historic telegram)', hint: '日本の電波実験で使われた有名な文', hintEn: 'Famous Japanese telegraph test phrase' },
  { text: 'モールスシンゴウ', category: 'wabun', level: 'advanced', meaningJa: 'モールス信号', meaningEn: 'Morse Code', hint: '長音・濁点を含む重要語', hintEn: 'Includes long vowel & dakuten' },
  { text: 'ムセンツウシン', category: 'wabun', level: 'advanced', meaningJa: '無線通信', meaningEn: 'Wireless Communication', hint: 'ム・セ・ン・ツ・ウ・シ・ン', hintEn: 'Mu-Se-N-Tsu-U-Shi-N' },
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
