import { MorseItem } from '../types';

// '.' = 短点 (dot / dit), '-' = 長点 (dash / dah)

export const ALPHABET_MORSE: MorseItem[] = [
  { char: 'A', code: '.-', category: 'alphabet', nameJa: 'エー', nameEn: 'Alpha', mnemonic: 'アメー (短・長)', mnemonicEn: 'di-dah (.-)' },
  { char: 'B', code: '-...', category: 'alphabet', nameJa: 'ビー', nameEn: 'Bravo', mnemonic: 'ビートたけし (長・短短短)', mnemonicEn: 'dah-di-di-dit (-...)' },
  { char: 'C', code: '-.-.', category: 'alphabet', nameJa: 'シー', nameEn: 'Charlie', mnemonic: 'コカコーラ (長短長短)', mnemonicEn: 'dah-di-dah-dit (-.-.)' },
  { char: 'D', code: '-..', category: 'alphabet', nameJa: 'ディー', nameEn: 'Delta', mnemonic: 'どら焼き (長短短)', mnemonicEn: 'dah-di-dit (-..)' },
  { char: 'E', code: '.', category: 'alphabet', nameJa: 'イー', nameEn: 'Echo', mnemonic: 'エ (短)', mnemonicEn: 'dit (.)' },
  { char: 'F', code: '..-.', category: 'alphabet', nameJa: 'エフ', nameEn: 'Foxtrot', mnemonic: 'ふりかけ (短短長短)', mnemonicEn: 'di-di-dah-dit (..-.)' },
  { char: 'G', code: '--.', category: 'alphabet', nameJa: 'ジー', nameEn: 'Golf', mnemonic: 'ゴリラ (長長短)', mnemonicEn: 'dah-dah-dit (--.)' },
  { char: 'H', code: '....', category: 'alphabet', nameJa: 'エイチ', nameEn: 'Hotel', mnemonic: 'ヒステリー (短短短短)', mnemonicEn: 'di-di-di-dit (....)' },
  { char: 'I', code: '..', category: 'alphabet', nameJa: 'アイ', nameEn: 'India', mnemonic: 'イト (短短)', mnemonicEn: 'di-dit (..)' },
  { char: 'J', code: '.---', category: 'alphabet', nameJa: 'ジェー', nameEn: 'Juliet', mnemonic: 'じゅうじろう (短長長長)', mnemonicEn: 'di-dah-dah-dah (.---)' },
  { char: 'K', code: '-.-', category: 'alphabet', nameJa: 'ケー', nameEn: 'Kilo', mnemonic: 'カブト (長短長)', mnemonicEn: 'dah-di-dah (-.-)' },
  { char: 'L', code: '.-..', category: 'alphabet', nameJa: 'エル', nameEn: 'Lima', mnemonic: 'ろうそく (短長短短)', mnemonicEn: 'di-dah-di-dit (.-..)' },
  { char: 'M', code: '--', category: 'alphabet', nameJa: 'エム', nameEn: 'Mike', mnemonic: 'ママ (長長)', mnemonicEn: 'dah-dah (--)' },
  { char: 'N', code: '-.', category: 'alphabet', nameJa: 'エヌ', nameEn: 'November', mnemonic: 'ノート (長短)', mnemonicEn: 'dah-dit (-.)' },
  { char: 'O', code: '---', category: 'alphabet', nameJa: 'オー', nameEn: 'Oscar', mnemonic: 'おおかみ (長長長)', mnemonicEn: 'dah-dah-dah (---)' },
  { char: 'P', code: '.--.', category: 'alphabet', nameJa: 'ピー', nameEn: 'Papa', mnemonic: 'ピンポンパン (短長長短)', mnemonicEn: 'di-dah-dah-dit (.--.)' },
  { char: 'Q', code: '--.-', category: 'alphabet', nameJa: 'キュー', nameEn: 'Quebec', mnemonic: 'きゅうきゅうしゃ (長長短長)', mnemonicEn: 'dah-dah-di-dah (--.-)' },
  { char: 'R', code: '.-.', category: 'alphabet', nameJa: 'アール', nameEn: 'Romeo', mnemonic: 'ラジオ (短長短)', mnemonicEn: 'di-dah-dit (.-.)' },
  { char: 'S', code: '...', category: 'alphabet', nameJa: 'エス', nameEn: 'Sierra', mnemonic: 'すずめ (短短短)', mnemonicEn: 'di-di-dit (...)' },
  { char: 'T', code: '-', category: 'alphabet', nameJa: 'ティー', nameEn: 'Tango', mnemonic: 'ト (長)', mnemonicEn: 'dah (-)' },
  { char: 'U', code: '..-', category: 'alphabet', nameJa: 'ユー', nameEn: 'Uniform', mnemonic: 'うなぎ (短短長)', mnemonicEn: 'di-di-dah (..-)' },
  { char: 'V', code: '...-', category: 'alphabet', nameJa: 'ブイ', nameEn: 'Victor', mnemonic: 'ビクトリー (短短短長)', mnemonicEn: 'di-di-di-dah (...-)' },
  { char: 'W', code: '.--', category: 'alphabet', nameJa: 'ダブリュー', nameEn: 'Whiskey', mnemonic: 'わらそう (短長長)', mnemonicEn: 'di-dah-dah (.--)' },
  { char: 'X', code: '-..-', category: 'alphabet', nameJa: 'エックス', nameEn: 'X-ray', mnemonic: 'たいこたたき (長短短長)', mnemonicEn: 'dah-di-di-dah (-..-)' },
  { char: 'Y', code: '-.--', category: 'alphabet', nameJa: 'ワイ', nameEn: 'Yankee', mnemonic: 'やきゅうじょう (長短長長)', mnemonicEn: 'dah-di-dah-dah (-.--)' },
  { char: 'Z', code: '--..', category: 'alphabet', nameJa: 'ゼット', nameEn: 'Zulu', mnemonic: 'ぞうきばやし (長長短短)', mnemonicEn: 'dah-dah-di-dit (--..)' },
];

export const NUMBER_MORSE: MorseItem[] = [
  { char: '1', code: '.----', category: 'number', nameJa: 'いち', nameEn: 'One', mnemonic: '1つだけ短い (短長長長長)', mnemonicEn: 'di-dah-dah-dah-dah (.----)' },
  { char: '2', code: '..---', category: 'number', nameJa: 'に', nameEn: 'Two', mnemonic: '2つ短い (短短長長長)', mnemonicEn: 'di-di-dah-dah-dah (..---)' },
  { char: '3', code: '...--', category: 'number', nameJa: 'さん', nameEn: 'Three', mnemonic: '3つ短い (短短短長長)', mnemonicEn: 'di-di-di-dah-dah (...--)' },
  { char: '4', code: '....-', category: 'number', nameJa: 'よん', nameEn: 'Four', mnemonic: '4つ短い (短短短短長)', mnemonicEn: 'di-di-di-di-dah (....-)' },
  { char: '5', code: '.....', category: 'number', nameJa: 'ご', nameEn: 'Five', mnemonic: '全部短い (短短短短短)', mnemonicEn: 'di-di-di-di-dit (.....)' },
  { char: '6', code: '-....', category: 'number', nameJa: 'ろく', nameEn: 'Six', mnemonic: '1つだけ長い (長短短短短)', mnemonicEn: 'dah-di-di-di-dit (-....)' },
  { char: '7', code: '--...', category: 'number', nameJa: 'なな', nameEn: 'Seven', mnemonic: '2つ長い (長長短短短)', mnemonicEn: 'dah-dah-di-di-dit (--...)' },
  { char: '8', code: '---..', category: 'number', nameJa: 'はち', nameEn: 'Eight', mnemonic: '3つ長い (長長長短短)', mnemonicEn: 'dah-dah-dah-di-dit (---..)' },
  { char: '9', code: '----.', category: 'number', nameJa: 'きゅう', nameEn: 'Nine', mnemonic: '4つ長い (長長長長短)', mnemonicEn: 'dah-dah-dah-dah-dit (----.)' },
  { char: '0', code: '-----', category: 'number', nameJa: 'ぜろ', nameEn: 'Zero', mnemonic: '全部長い (長長長長長)', mnemonicEn: 'dah-dah-dah-dah-dah (-----)' },
];

export const WABUN_MORSE: MorseItem[] = [
  { char: 'ア', code: '--.--', category: 'wabun', nameJa: 'ア', nameEn: 'A (Wabun)', mnemonic: 'ア・イ・ス (長長短長長)', mnemonicEn: 'dah-dah-di-dah-dah' },
  { char: 'イ', code: '.-', category: 'wabun', nameJa: 'イ', nameEn: 'I (Wabun)', mnemonic: 'イ・ト (短長)', mnemonicEn: 'di-dah' },
  { char: 'ウ', code: '..-', category: 'wabun', nameJa: 'ウ', nameEn: 'U (Wabun)', mnemonic: 'ウ・シ (短短長)', mnemonicEn: 'di-di-dah' },
  { char: 'エ', code: '-.---', category: 'wabun', nameJa: 'エ', nameEn: 'E (Wabun)', mnemonic: 'エ・ン・ト・ツ (長短長長長)', mnemonicEn: 'dah-di-dah-dah-dah' },
  { char: 'オ', code: '.-...', category: 'wabun', nameJa: 'オ', nameEn: 'O (Wabun)', mnemonic: 'オ・バ・ケ (短長短短短)', mnemonicEn: 'di-dah-di-di-dit' },
  
  { char: 'カ', code: '.-..', category: 'wabun', nameJa: 'カ', nameEn: 'Ka', mnemonic: 'カ・ガ・ミ (短長短短)', mnemonicEn: 'di-dah-di-dit' },
  { char: 'キ', code: '-.-..', category: 'wabun', nameJa: 'キ', nameEn: 'Ki', mnemonic: 'キ・ツ・ネ (長短長短短)', mnemonicEn: 'dah-di-dah-di-dit' },
  { char: 'ク', code: '...-', category: 'wabun', nameJa: 'ク', nameEn: 'Ku', mnemonic: 'ク・シ (短短短長)', mnemonicEn: 'di-di-di-dah' },
  { char: 'ケ', code: '-.--', category: 'wabun', nameJa: 'ケ', nameEn: 'Ke', mnemonic: 'ケ・ー・キ (長短長長)', mnemonicEn: 'dah-di-dah-dah' },
  { char: 'コ', code: '----', category: 'wabun', nameJa: 'コ', nameEn: 'Ko', mnemonic: 'コ・ド・モ (長長長長)', mnemonicEn: 'dah-dah-dah-dah' },

  { char: 'サ', code: '-.-.-', category: 'wabun', nameJa: 'サ', nameEn: 'Sa', mnemonic: 'サ・カ・ナ (長短長短長)', mnemonicEn: 'dah-di-dah-di-dah' },
  { char: 'シ', code: '--.-.', category: 'wabun', nameJa: 'シ', nameEn: 'Shi', mnemonic: 'シ・ン・ブ・ン (長長短長短)', mnemonicEn: 'dah-dah-di-dah-dit' },
  { char: 'ス', code: '---.-', category: 'wabun', nameJa: 'ス', nameEn: 'Su', mnemonic: 'ス・ズ・メ (長長長短長)', mnemonicEn: 'dah-dah-dah-di-dah' },
  { char: 'セ', code: '.---.', category: 'wabun', nameJa: 'セ', nameEn: 'Se', mnemonic: 'セ・ン・ロ (短長長長短)', mnemonicEn: 'di-dah-dah-dah-dit' },
  { char: 'ソ', code: '---.', category: 'wabun', nameJa: 'ソ', nameEn: 'So', mnemonic: 'ソ・ウ・シ・キ (長長長短)', mnemonicEn: 'dah-dah-dah-dit' },

  { char: 'タ', code: '-.', category: 'wabun', nameJa: 'タ', nameEn: 'Ta', mnemonic: 'タ・イ・コ (長短)', mnemonicEn: 'dah-dit' },
  { char: 'チ', code: '..-.', category: 'wabun', nameJa: 'チ', nameEn: 'Chi', mnemonic: 'チ・リ・ト・リ (短短長短)', mnemonicEn: 'di-di-dah-dit' },
  { char: 'ツ', code: '.--.', category: 'wabun', nameJa: 'ツ', nameEn: 'Tsu', mnemonic: 'ツ・ル・ハ・シ (短長長短)', mnemonicEn: 'di-dah-dah-dit' },
  { char: 'テ', code: '.-.--', category: 'wabun', nameJa: 'テ', nameEn: 'Te', mnemonic: 'テ・イ・シ・ャ (短長短長長)', mnemonicEn: 'di-dah-di-dah-dah' },
  { char: 'ト', code: '..-..', category: 'wabun', nameJa: 'ト', nameEn: 'To', mnemonic: 'ト・ク・ガ・ワ (短短長短短)', mnemonicEn: 'di-di-dah-di-dit' },

  { char: 'ナ', code: '.-.', category: 'wabun', nameJa: 'ナ', nameEn: 'Na', mnemonic: 'ナ・ツ (短長短)', mnemonicEn: 'di-dah-dit' },
  { char: 'ニ', code: '-.-.', category: 'wabun', nameJa: 'ニ', nameEn: 'Ni', mnemonic: 'ニ・ホ・ン・バ・シ (長短長短)', mnemonicEn: 'dah-di-dah-dit' },
  { char: 'ヌ', code: '....', category: 'wabun', nameJa: 'ヌ', nameEn: 'Nu', mnemonic: 'ヌ・マ (短短短短)', mnemonicEn: 'di-di-di-dit' },
  { char: 'ネ', code: '--.-', category: 'wabun', nameJa: 'ネ', nameEn: 'Ne', mnemonic: 'ネ・ン・ネ・コ (長長短長)', mnemonicEn: 'dah-dah-di-dah' },
  { char: 'ノ', code: '..--', category: 'wabun', nameJa: 'ノ', nameEn: 'No', mnemonic: 'ノ・ー・ト (短短長長)', mnemonicEn: 'di-di-dah-dah' },

  { char: 'ハ', code: '-...', category: 'wabun', nameJa: 'ハ', nameEn: 'Ha', mnemonic: 'ハ・ー・モ・ニ・カ (長短短短)', mnemonicEn: 'dah-di-di-dit' },
  { char: 'ヒ', code: '--..-', category: 'wabun', nameJa: 'ヒ', nameEn: 'Hi', mnemonic: 'ヒ・コ・ー・キ (長長短短長)', mnemonicEn: 'dah-dah-di-di-dah' },
  { char: 'フ', code: '--..', category: 'wabun', nameJa: 'フ', nameEn: 'Fu', mnemonic: 'フ・ジ・サ・ン (長長短短)', mnemonicEn: 'dah-dah-di-dit' },
  { char: 'ヘ', code: '.', category: 'wabun', nameJa: 'ヘ', nameEn: 'He', mnemonic: 'ヘ (短)', mnemonicEn: 'dit' },
  { char: 'ホ', code: '-..', category: 'wabun', nameJa: 'ホ', nameEn: 'Ho', mnemonic: 'ホ・タ・ル (長短短)', mnemonicEn: 'dah-di-dit' },

  { char: 'マ', code: '-..-', category: 'wabun', nameJa: 'マ', nameEn: 'Ma', mnemonic: 'マ・ツ (長短短長)', mnemonicEn: 'dah-di-di-dah' },
  { char: 'ミ', code: '..-.-', category: 'wabun', nameJa: 'ミ', nameEn: 'Mi', mnemonic: 'ミ・カ・ン (短短長短長)', mnemonicEn: 'di-di-dah-di-dah' },
  { char: 'ム', code: '-', category: 'wabun', nameJa: 'ム', nameEn: 'Mu', mnemonic: 'ム・シ (長)', mnemonicEn: 'dah' },
  { char: 'メ', code: '-...-', category: 'wabun', nameJa: 'メ', nameEn: 'Me', mnemonic: 'メ・ガ・ホ・ン (長短短短長)', mnemonicEn: 'dah-di-di-di-dah' },
  { char: 'モ', code: '-..-.', category: 'wabun', nameJa: 'モ', nameEn: 'Mo', mnemonic: 'モ・グ・ラ (長短短長短)', mnemonicEn: 'dah-di-di-dah-dit' },

  { char: 'ヤ', code: '.--', category: 'wabun', nameJa: 'ヤ', nameEn: 'Ya', mnemonic: 'ヤ・ス (短長長)', mnemonicEn: 'di-dah-dah' },
  { char: 'ユ', code: '-..--', category: 'wabun', nameJa: 'ユ', nameEn: 'Yu', mnemonic: 'ユ・ミ (長短短長長)', mnemonicEn: 'dah-di-di-dah-dah' },
  { char: 'ヨ', code: '--', category: 'wabun', nameJa: 'ヨ', nameEn: 'Yo', mnemonic: 'ヨ・ー・ヨ・ー (長長)', mnemonicEn: 'dah-dah' },

  { char: 'ラ', code: '...', category: 'wabun', nameJa: 'ラ', nameEn: 'Ra', mnemonic: 'ラ・ッ・パ (短短短)', mnemonicEn: 'di-di-dit' },
  { char: 'リ', code: '--.', category: 'wabun', nameJa: 'リ', nameEn: 'Ri', mnemonic: 'リ・ン・ゴ (長長短)', mnemonicEn: 'dah-dah-dit' },
  { char: 'ル', code: '-.--.', category: 'wabun', nameJa: 'ル', nameEn: 'Ru', mnemonic: 'ル・ビ・ー (長短長長短)', mnemonicEn: 'dah-di-dah-dah-dit' },
  { char: 'レ', code: '---', category: 'wabun', nameJa: 'レ', nameEn: 'Re', mnemonic: 'レ・モ・ン (長長長)', mnemonicEn: 'dah-dah-dah' },
  { char: 'ロ', code: '.-.-', category: 'wabun', nameJa: 'ロ', nameEn: 'Ro', mnemonic: 'ロ・ー・ソ・ク (短長短長)', mnemonicEn: 'di-dah-di-dah' },

  { char: 'ワ', code: '-.-', category: 'wabun', nameJa: 'ワ', nameEn: 'Wa', mnemonic: 'ワ・ラ (長短長)', mnemonicEn: 'dah-di-dah' },
  { char: 'ヰ', code: '.-..-', category: 'wabun', nameJa: 'ヰ', nameEn: 'Wi', mnemonic: 'イ（ヰ）ド (短長短短長)', mnemonicEn: 'di-dah-di-di-dah' },
  { char: 'ヱ', code: '.--..', category: 'wabun', nameJa: 'ヱ', nameEn: 'We', mnemonic: 'エ（ヱ）ビ (短長長短短)', mnemonicEn: 'di-dah-dah-di-dit' },
  { char: 'ヲ', code: '.---', category: 'wabun', nameJa: 'ヲ', nameEn: 'Wo', mnemonic: 'ヲ・ス (短長長長)', mnemonicEn: 'di-dah-dah-dah' },
  { char: 'ン', code: '.-.-.', category: 'wabun', nameJa: 'ン', nameEn: 'N (Wabun)', mnemonic: 'オ・ワ・リ (短長短長短)', mnemonicEn: 'di-dah-di-dah-dit' },

  // 特殊符号（和文）
  { char: '゛', code: '..', category: 'wabun', nameJa: '濁点', nameEn: 'Dakuten (voiced mark)', mnemonic: 'ダクテン (短短)', mnemonicEn: 'di-dit (..)' },
  { char: '゜', code: '..--.', category: 'wabun', nameJa: '半濁点', nameEn: 'Handakuten (semi-voiced)', mnemonic: 'ハンダク (短短長長短)', mnemonicEn: 'di-di-dah-dah-dit' },
  { char: 'ー', code: '.--.-', category: 'wabun', nameJa: '長音', nameEn: 'Choon (long vowel)', mnemonic: 'チョウオン (短長長短長)', mnemonicEn: 'di-dah-dah-di-dah' },
  { char: '、', code: '.-.-.-', category: 'wabun', nameJa: '読点', nameEn: 'Comma (Japanese)', mnemonic: 'トウテン (短長短長短長)', mnemonicEn: 'di-dah-di-dah-di-dah' },
  { char: '。', code: '.-.-..', category: 'wabun', nameJa: '句点', nameEn: 'Period (Japanese)', mnemonic: 'クテン (短長短長短短)', mnemonicEn: 'di-dah-di-dah-di-dit' },
];

export const SYMBOL_MORSE: MorseItem[] = [
  { char: '?', code: '..--..', category: 'symbol', nameJa: '疑問符', nameEn: 'Question Mark (?)', mnemonic: 'クエスチョン (短短長長短短)', mnemonicEn: 'di-di-dah-dah-di-dit (..--..)' },
  { char: '!', code: '-.-.--', category: 'symbol', nameJa: '感嘆符', nameEn: 'Exclamation Mark (!)', mnemonic: 'エクスクラメーション', mnemonicEn: 'dah-di-dah-di-dah-dah (-.-.--)' },
  { char: '/', code: '-..-.', category: 'symbol', nameJa: 'スラッシュ', nameEn: 'Slash (/)', mnemonic: 'スラッシュ (長短短長短)', mnemonicEn: 'dah-di-di-dah-dit (-..-.)' },
  { char: '@', code: '.--.-.', category: 'symbol', nameJa: 'アットマーク', nameEn: 'At Sign (@)', mnemonic: 'アットマーク', mnemonicEn: 'di-dah-dah-di-dah-dit (.--.-.)' },
  { char: '=', code: '-...-', category: 'symbol', nameJa: '等号 (イコール)', nameEn: 'Equals Sign (=)', mnemonic: 'イコール', mnemonicEn: 'dah-di-di-di-dah (-...-)' },
  { char: '+', code: '.-.-.', category: 'symbol', nameJa: 'プラス', nameEn: 'Plus Sign (+)', mnemonic: 'プラス', mnemonicEn: 'di-dah-di-dah-dit (.-.-.)' },
  { char: '-', code: '-....-', category: 'symbol', nameJa: 'ハイフン', nameEn: 'Hyphen / Minus (-)', mnemonic: 'ハイフン', mnemonicEn: 'dah-di-di-di-di-dah (-....-)' },
  { char: '(', code: '-.--.', category: 'symbol', nameJa: '開き括弧', nameEn: 'Open Parenthesis (()', mnemonic: 'カッコ', mnemonicEn: 'dah-di-dah-dah-dit (-.--.)' },
  { char: ')', code: '-.--.-', category: 'symbol', nameJa: '閉じ括弧', nameEn: 'Close Parenthesis ())', mnemonic: 'カッコ', mnemonicEn: 'dah-di-dah-dah-di-dah (-.--.-)' },
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
