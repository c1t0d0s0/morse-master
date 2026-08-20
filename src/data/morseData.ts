import { MorseItem } from '../types';

// '.' = 短点 (dot / dit), '-' = 長点 (dash / dah)

export const ALPHABET_MORSE: MorseItem[] = [
  { char: 'A', code: '.-', category: 'alphabet', nameJa: 'エー', mnemonic: 'アメー (短・長)' },
  { char: 'B', code: '-...', category: 'alphabet', nameJa: 'ビー', mnemonic: 'ビートたけし (長・短短短)' },
  { char: 'C', code: '-.-.', category: 'alphabet', nameJa: 'シー', mnemonic: 'コカコーラ (長短長短)' },
  { char: 'D', code: '-..', category: 'alphabet', nameJa: 'ディー', mnemonic: 'どら焼き (長短短)' },
  { char: 'E', code: '.', category: 'alphabet', nameJa: 'イー', mnemonic: 'エ (短)' },
  { char: 'F', code: '..-.', category: 'alphabet', nameJa: 'エフ', mnemonic: 'ふりかけ (短短長短)' },
  { char: 'G', code: '--.', category: 'alphabet', nameJa: 'ジー', mnemonic: 'ゴリラ (長長短)' },
  { char: 'H', code: '....', category: 'alphabet', nameJa: 'エイチ', mnemonic: 'ヒステリー (短短短短)' },
  { char: 'I', code: '..', category: 'alphabet', nameJa: 'アイ', mnemonic: 'イト (短短)' },
  { char: 'J', code: '.---', category: 'alphabet', nameJa: 'ジェー', mnemonic: 'じゅうじろう (短長長長)' },
  { char: 'K', code: '-.-', category: 'alphabet', nameJa: 'ケー', mnemonic: 'カブト (長短長)' },
  { char: 'L', code: '.-..', category: 'alphabet', nameJa: 'エル', mnemonic: 'ろうそく (短長短短)' },
  { char: 'M', code: '--', category: 'alphabet', nameJa: 'エム', mnemonic: 'ママ (長長)' },
  { char: 'N', code: '-.', category: 'alphabet', nameJa: 'エヌ', mnemonic: 'ノート (長短)' },
  { char: 'O', code: '---', category: 'alphabet', nameJa: 'オー', mnemonic: 'おおかみ (長長長)' },
  { char: 'P', code: '.--.', category: 'alphabet', nameJa: 'ピー', mnemonic: 'ピンポンパン (短長長短)' },
  { char: 'Q', code: '--.-', category: 'alphabet', nameJa: 'キュー', mnemonic: 'きゅうきゅうしゃ (長長短長)' },
  { char: 'R', code: '.-.', category: 'alphabet', nameJa: 'アール', mnemonic: 'ラジオ (短長短)' },
  { char: 'S', code: '...', category: 'alphabet', nameJa: 'エス', mnemonic: 'すずめ (短短短)' },
  { char: 'T', code: '-', category: 'alphabet', nameJa: 'ティー', mnemonic: 'ト (長)' },
  { char: 'U', code: '..-', category: 'alphabet', nameJa: 'ユー', mnemonic: 'うなぎ (短短長)' },
  { char: 'V', code: '...-', category: 'alphabet', nameJa: 'ブイ', mnemonic: 'ビクトリー (短短短長)' },
  { char: 'W', code: '.--', category: 'alphabet', nameJa: 'ダブリュー', mnemonic: 'わらそう (短長長)' },
  { char: 'X', code: '-..-', category: 'alphabet', nameJa: 'エックス', mnemonic: 'たいこたたき (長短短長)' },
  { char: 'Y', code: '-.--', category: 'alphabet', nameJa: 'ワイ', mnemonic: 'やきゅうじょう (長短長長)' },
  { char: 'Z', code: '--..', category: 'alphabet', nameJa: 'ゼット', mnemonic: 'ぞうきばやし (長長短短)' },
];

export const NUMBER_MORSE: MorseItem[] = [
  { char: '1', code: '.----', category: 'number', nameJa: 'いち', mnemonic: '1つだけ短い (短長長長長)' },
  { char: '2', code: '..---', category: 'number', nameJa: 'に', mnemonic: '2つ短い (短短長長長)' },
  { char: '3', code: '...--', category: 'number', nameJa: 'さん', mnemonic: '3つ短い (短短短長長)' },
  { char: '4', code: '....-', category: 'number', nameJa: 'よん', mnemonic: '4つ短い (短短短短長)' },
  { char: '5', code: '.....', category: 'number', nameJa: 'ご', mnemonic: '全部短い (短短短短短)' },
  { char: '6', code: '-....', category: 'number', nameJa: 'ろく', mnemonic: '1つだけ長い (長短短短短)' },
  { char: '7', code: '--...', category: 'number', nameJa: 'なな', mnemonic: '2つ長い (長長短短短)' },
  { char: '8', code: '---..', category: 'number', nameJa: 'はち', mnemonic: '3つ長い (長長長短短)' },
  { char: '9', code: '----.', category: 'number', nameJa: 'きゅう', mnemonic: '4つ長い (長長長長短)' },
  { char: '0', code: '-----', category: 'number', nameJa: 'ぜろ', mnemonic: '全部長い (長長長長長)' },
];

export const WABUN_MORSE: MorseItem[] = [
  { char: 'ア', code: '--.--', category: 'wabun', nameJa: 'ア', mnemonic: 'ア・イ・ス (長長短長長)' },
  { char: 'イ', code: '.-', category: 'wabun', nameJa: 'イ', mnemonic: 'イ・ト (短長)' },
  { char: 'ウ', code: '..-', category: 'wabun', nameJa: 'ウ', mnemonic: 'ウ・シ (短短長)' },
  { char: 'エ', code: '-.---', category: 'wabun', nameJa: 'エ', mnemonic: 'エ・ン・ト・ツ (長短長長長)' },
  { char: 'オ', code: '.-...', category: 'wabun', nameJa: 'オ', mnemonic: 'オ・バ・ケ (短長短短短)' },
  
  { char: 'カ', code: '.-..', category: 'wabun', nameJa: 'カ', mnemonic: 'カ・ガ・ミ (短長短短)' },
  { char: 'キ', code: '-.-..', category: 'wabun', nameJa: 'キ', mnemonic: 'キ・ツ・ネ (長短長短短)' },
  { char: 'ク', code: '...-', category: 'wabun', nameJa: 'ク', mnemonic: 'ク・シ (短短短長)' },
  { char: 'ケ', code: '-.--', category: 'wabun', nameJa: 'ケ', mnemonic: 'ケ・ー・キ (長短長長)' },
  { char: 'コ', code: '----', category: 'wabun', nameJa: 'コ', mnemonic: 'コ・ド・モ (長長長長)' },

  { char: 'サ', code: '-.-.-', category: 'wabun', nameJa: 'サ', mnemonic: 'サ・カ・ナ (長短長短長)' },
  { char: 'シ', code: '--.-.', category: 'wabun', nameJa: 'シ', mnemonic: 'シ・ン・ブ・ン (長長短長短)' },
  { char: 'ス', code: '---.-', category: 'wabun', nameJa: 'ス', mnemonic: 'ス・ズ・メ (長長長短長)' },
  { char: 'セ', code: '.---.', category: 'wabun', nameJa: 'セ', mnemonic: 'セ・ン・ロ (短長長長短)' },
  { char: 'ソ', code: '---.', category: 'wabun', nameJa: 'ソ', mnemonic: 'ソ・ウ・シ・キ (長長長短)' },

  { char: 'タ', code: '-.', category: 'wabun', nameJa: 'タ', mnemonic: 'タ・イ・コ (長短)' },
  { char: 'チ', code: '..-.', category: 'wabun', nameJa: 'チ', mnemonic: 'チ・リ・ト・リ (短短長短)' },
  { char: 'ツ', code: '.--.', category: 'wabun', nameJa: 'ツ', mnemonic: 'ツ・ル・ハ・シ (短長長短)' },
  { char: 'テ', code: '.-.--', category: 'wabun', nameJa: 'テ', mnemonic: 'テ・イ・シ・ャ (短長短長長)' },
  { char: 'ト', code: '..-..', category: 'wabun', nameJa: 'ト', mnemonic: 'ト・ク・ガ・ワ (短短長短短)' },

  { char: 'ナ', code: '.-.', category: 'wabun', nameJa: 'ナ', mnemonic: 'ナ・ツ (短長短)' },
  { char: 'ニ', code: '-.-.', category: 'wabun', nameJa: 'ニ', mnemonic: 'ニ・ホ・ン・バ・シ (長短長短)' },
  { char: 'ヌ', code: '....', category: 'wabun', nameJa: 'ヌ', mnemonic: 'ヌ・マ (短短短短)' },
  { char: 'ネ', code: '--.-', category: 'wabun', nameJa: 'ネ', mnemonic: 'ネ・ン・ネ・コ (長長短長)' },
  { char: 'ノ', code: '..--', category: 'wabun', nameJa: 'ノ', mnemonic: 'ノ・ー・ト (短短長長)' },

  { char: 'ハ', code: '-...', category: 'wabun', nameJa: 'ハ', mnemonic: 'ハ・ー・モ・ニ・カ (長短短短)' },
  { char: 'ヒ', code: '--..-', category: 'wabun', nameJa: 'ヒ', mnemonic: 'ヒ・コ・ー・キ (長長短短長)' },
  { char: 'フ', code: '--..', category: 'wabun', nameJa: 'フ', mnemonic: 'フ・ジ・サ・ン (長長短短)' },
  { char: 'ヘ', code: '.', category: 'wabun', nameJa: 'ヘ', mnemonic: 'ヘ (短)' },
  { char: 'ホ', code: '-..', category: 'wabun', nameJa: 'ホ', mnemonic: 'ホ・タ・ル (長短短)' },

  { char: 'マ', code: '-..-', category: 'wabun', nameJa: 'マ', mnemonic: 'マ・ツ (長短短長)' },
  { char: 'ミ', code: '..-.-', category: 'wabun', nameJa: 'ミ', mnemonic: 'ミ・カ・ン (短短長短長)' },
  { char: 'ム', code: '-', category: 'wabun', nameJa: 'ム', mnemonic: 'ム・シ (長)' },
  { char: 'メ', code: '-...-', category: 'wabun', nameJa: 'メ', mnemonic: 'メ・ガ・ホ・ン (長短短短長)' },
  { char: 'モ', code: '-..-.', category: 'wabun', nameJa: 'モ', mnemonic: 'モ・グ・ラ (長短短長短)' },

  { char: 'ヤ', code: '.--', category: 'wabun', nameJa: 'ヤ', mnemonic: 'ヤ・ス (短長長)' },
  { char: 'ユ', code: '-..--', category: 'wabun', nameJa: 'ユ', mnemonic: 'ユ・ミ (長短短長長)' },
  { char: 'ヨ', code: '--', category: 'wabun', nameJa: 'ヨ', mnemonic: 'ヨ・ー・ヨ・ー (長長)' },

  { char: 'ラ', code: '...', category: 'wabun', nameJa: 'ラ', mnemonic: 'ラ・ッ・パ (短短短)' },
  { char: 'リ', code: '--.', category: 'wabun', nameJa: 'リ', mnemonic: 'リ・ン・ゴ (長長短)' },
  { char: 'ル', code: '-.--.', category: 'wabun', nameJa: 'ル', mnemonic: 'ル・ビ・ー (長短長長短)' },
  { char: 'レ', code: '---', category: 'wabun', nameJa: 'レ', mnemonic: 'レ・モ・ン (長長長)' },
  { char: 'ロ', code: '.-.-', category: 'wabun', nameJa: 'ロ', mnemonic: 'ロ・ー・ソ・ク (短長短長)' },

  { char: 'ワ', code: '-.-', category: 'wabun', nameJa: 'ワ', mnemonic: 'ワ・ラ (長短長)' },
  { char: 'ヰ', code: '.-..-', category: 'wabun', nameJa: 'ヰ', mnemonic: 'イ（ヰ）ド (短長短短長)' },
  { char: 'ヱ', code: '.--..', category: 'wabun', nameJa: 'ヱ', mnemonic: 'エ（ヱ）ビ (短長長短短)' },
  { char: 'ヲ', code: '.---', category: 'wabun', nameJa: 'ヲ', mnemonic: 'ヲ・ス (短長長長)' },
  { char: 'ン', code: '.-.-.', category: 'wabun', nameJa: 'ン', mnemonic: 'オ・ワ・リ (短長短長短)' },

  // 特殊符号（和文）
  { char: '゛', code: '..', category: 'wabun', nameJa: '濁点', mnemonic: 'ダクテン (短短)' },
  { char: '゜', code: '..--.', category: 'wabun', nameJa: '半濁点', mnemonic: 'ハンダク (短短長長短)' },
  { char: 'ー', code: '.--.-', category: 'wabun', nameJa: '長音', mnemonic: 'チョウオン (短長長短長)' },
  { char: '、', code: '.-.-.-', category: 'wabun', nameJa: '読点', mnemonic: 'トウテン (短長短長短長)' },
  { char: '。', code: '.-.-..', category: 'wabun', nameJa: '句点', mnemonic: 'クテン (短長短長短短)' },
];

export const SYMBOL_MORSE: MorseItem[] = [
  { char: '?', code: '..--..', category: 'symbol', nameJa: '疑問符', mnemonic: 'クエスチョン (短短長長短短)' },
  { char: '!', code: '-.-.--', category: 'symbol', nameJa: '感嘆符', mnemonic: 'エクスクラメーション' },
  { char: '/', code: '-..-.', category: 'symbol', nameJa: 'スラッシュ', mnemonic: 'スラッシュ (長短短長短)' },
  { char: '@', code: '.--.-.', category: 'symbol', nameJa: 'アットマーク', mnemonic: 'アットマーク' },
  { char: '=', code: '-...-', category: 'symbol', nameJa: '等号 (イコール)', mnemonic: 'イコール' },
  { char: '+', code: '.-.-.', category: 'symbol', nameJa: 'プラス', mnemonic: 'プラス' },
  { char: '-', code: '-....-', category: 'symbol', nameJa: 'ハイフン', mnemonic: 'ハイフン' },
  { char: '(', code: '-.--.', category: 'symbol', nameJa: '開き括弧', mnemonic: 'カッコ' },
  { char: ')', code: '-.--.-', category: 'symbol', nameJa: '閉じ括弧', mnemonic: 'カッコ' },
];

export const ALL_MORSE_ITEMS: MorseItem[] = [
  ...ALPHABET_MORSE,
  ...NUMBER_MORSE,
  ...WABUN_MORSE,
  ...SYMBOL_MORSE,
];

// Map lookup tables
export const CHAR_TO_MORSE_MAP = new Map<string, MorseItem>();
export const MORSE_TO_CHAR_ALPHABET_MAP = new Map<string, MorseItem>();
export const MORSE_TO_CHAR_WABUN_MAP = new Map<string, MorseItem>();

ALL_MORSE_ITEMS.forEach(item => {
  CHAR_TO_MORSE_MAP.set(item.char.toUpperCase(), item);
  if (item.category === 'wabun') {
    MORSE_TO_CHAR_WABUN_MAP.set(item.code, item);
  } else {
    if (!MORSE_TO_CHAR_ALPHABET_MAP.has(item.code)) {
      MORSE_TO_CHAR_ALPHABET_MAP.set(item.code, item);
    }
  }
});

// 和文濁点・半濁点分解マッピング
const DAKUTEN_MAP: Record<string, { base: string; mark: string }> = {
  'ガ': { base: 'カ', mark: '゛' }, 'ギ': { base: 'キ', mark: '゛' }, 'グ': { base: 'ク', mark: '゛' }, 'ゲ': { base: 'ケ', mark: '゛' }, 'ゴ': { base: 'コ', mark: '゛' },
  'ザ': { base: 'サ', mark: '゛' }, 'ジ': { base: 'シ', mark: '゛' }, 'ズ': { base: 'ス', mark: '゛' }, 'ゼ': { base: 'セ', mark: '゛' }, 'ゾ': { base: 'ソ', mark: '゛' },
  'ダ': { base: 'タ', mark: '゛' }, 'ヂ': { base: 'チ', mark: '゛' }, 'ヅ': { base: 'ツ', mark: '゛' }, 'デ': { base: 'テ', mark: '゛' }, 'ド': { base: 'ト', mark: '゛' },
  'バ': { base: 'ハ', mark: '゛' }, 'ビ': { base: 'ヒ', mark: '゛' }, 'ブ': { base: 'フ', mark: '゛' }, 'ベ': { base: 'ヘ', mark: '゛' }, 'ボ': { base: 'ホ', mark: '゛' },
  'パ': { base: 'ハ', mark: '゜' }, 'ピ': { base: 'ヒ', mark: '゜' }, 'プ': { base: 'フ', mark: '゜' }, 'ペ': { base: 'ヘ', mark: '゜' }, 'ポ': { base: 'ホ', mark: '゜' },
  'ヴ': { base: 'ウ', mark: '゛' },
};

// 小文字カナ正規化
const SMALL_KANA_MAP: Record<string, string> = {
  'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ',
  'ッ': 'ツ', 'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ', 'ヮ': 'ワ',
};

// ひらがなをカタカナに変換
export function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, match =>
    String.fromCharCode(match.charCodeAt(0) + 0x60)
  );
}

// 符号 (.-) を 視覚表記 (・－) に変換
export function morseToDotsAndDashes(code: string): string {
  return code.replace(/\./g, '・').replace(/-/g, '－');
}

// 視覚表記 (・－) を 符号 (.-) に変換
export function dotsAndDashesToMorse(str: string): string {
  return str.replace(/[・･\.]/g, '.').replace(/[－ー\-—_]/g, '-');
}

/**
 * 日本語文字列を和文モールス用の一連の文字（濁点・半濁点分解後）に分解
 */
export function decomposeWabunText(text: string): string[] {
  const katakana = hiraganaToKatakana(text);
  const result: string[] = [];

  for (const char of katakana) {
    const normalized = SMALL_KANA_MAP[char] || char;
    if (DAKUTEN_MAP[normalized]) {
      result.push(DAKUTEN_MAP[normalized].base);
      result.push(DAKUTEN_MAP[normalized].mark);
    } else {
      result.push(normalized);
    }
  }
  return result;
}

/**
 * 文字列をモールス符号列に変換
 * @param text 変換対象テキスト
 * @param isWabun 和文として優先変換するか
 * @returns { code: string (空白区切り), items: MorseItem[], unmapped: string[] }
 */
export function textToMorse(text: string, isWabun = false): {
  code: string;
  items: MorseItem[];
  unmapped: string[];
} {
  const items: MorseItem[] = [];
  const unmapped: string[] = [];
  const codeParts: string[] = [];

  // 和文判定（ひらがな・カタカナが含まれている、またはisWabunフラグ）
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF]/.test(text) || isWabun;

  if (hasJapanese) {
    const chars = decomposeWabunText(text);
    for (const char of chars) {
      if (char === ' ' || char === '　') {
        codeParts.push('/');
        continue;
      }
      const item = CHAR_TO_MORSE_MAP.get(char) || CHAR_TO_MORSE_MAP.get(char.toUpperCase());
      if (item) {
        items.push(item);
        codeParts.push(item.code);
      } else {
        unmapped.push(char);
      }
    }
  } else {
    const upper = text.toUpperCase();
    for (let i = 0; i < upper.length; i++) {
      const char = upper[i];
      if (char === ' ') {
        codeParts.push('/');
        continue;
      }
      const item = CHAR_TO_MORSE_MAP.get(char);
      if (item) {
        items.push(item);
        codeParts.push(item.code);
      } else {
        unmapped.push(char);
      }
    }
  }

  return {
    code: codeParts.join(' '),
    items,
    unmapped,
  };
}

/**
 * モールス符号列を文字列にデコード
 * @param morseCode スペース区切りのモールス符号 ('.- -...')
 * @param preferWabun 和文を優先して復号するか
 */
export function morseToText(morseCode: string, preferWabun = false): string {
  const tokens = morseCode.trim().split(/\s+/);
  const result: string[] = [];

  for (const token of tokens) {
    if (token === '/' || token === '') {
      result.push(' ');
      continue;
    }

    const cleanToken = dotsAndDashesToMorse(token);
    let item: MorseItem | undefined;

    if (preferWabun) {
      item = MORSE_TO_CHAR_WABUN_MAP.get(cleanToken) || MORSE_TO_CHAR_ALPHABET_MAP.get(cleanToken);
    } else {
      item = MORSE_TO_CHAR_ALPHABET_MAP.get(cleanToken) || MORSE_TO_CHAR_WABUN_MAP.get(cleanToken);
    }

    if (item) {
      result.push(item.char);
    } else {
      result.push('?');
    }
  }

  // 和文濁点・半濁点の結合処理（例: カ + ゛ -> ガ）
  return composeWabunDakuten(result.join(''));
}

/**
 * 濁点・半濁点付きカナを結合
 */
function composeWabunDakuten(text: string): string {
  const COMBINE_MAP: Record<string, string> = {
    'カ゛': 'ガ', 'キ゛': 'ギ', 'ク゛': 'グ', 'ケ゛': 'ゲ', 'コ゛': 'ゴ',
    'サ゛': 'ザ', 'シ゛': 'ジ', 'ス゛': 'ズ', 'セ゛': 'ゼ', 'ソ゛': 'ゾ',
    'タ゛': 'ダ', 'チ゛': 'ヂ', 'ツ゛': 'ヅ', 'テ゛': 'デ', 'ト゛': 'ド',
    'ハ゛': 'バ', 'ヒ゛': 'ビ', 'フ゛': 'ブ', 'ヘ゛': 'ベ', 'ホ゛': 'ボ',
    'ハ゜': 'パ', 'ヒ゜': 'ピ', 'フ゜': 'プ', 'ヘ゜': 'ペ', 'ホ゜': 'ポ',
    'ウ゛': 'ヴ',
  };

  let res = text;
  for (const [key, val] of Object.entries(COMBINE_MAP)) {
    res = res.replaceAll(key, val);
  }
  return res;
}
