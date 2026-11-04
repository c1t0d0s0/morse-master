import { ALPHABET_MORSE } from './morseData';

/**
 * モールス・ツリー盤のレイアウト定義
 * 長音(-)側は左、短音(.)側は右に広がる二分木。
 * 座標は格子単位 (x: 0〜8.5, y: 0〜6)。ルート(アンテナ)は ROOT_POSITION。
 */
export interface MorseTreeNode {
  code: string;
  char: string;
  x: number;
  y: number;
  /** 長音ノード(■)の向き。'v' は縦長 */
  orientation: 'h' | 'v';
  /** 文字ラベルを置く方向 */
  labelSide: 'top' | 'bottom' | 'left' | 'right';
}

export const ROOT_POSITION = { x: 4.5, y: 0 };

type Layout = [string, number, number, MorseTreeNode['orientation'], MorseTreeNode['labelSide']];

const LAYOUT: Layout[] = [
  // 長音側（左）
  ['-', 3.5, 0, 'h', 'top'],      // T
  ['--', 2, 0, 'h', 'top'],       // M
  ['---', 0.5, 0, 'h', 'top'],    // O
  ['--.', 2, 1, 'h', 'right'],    // G
  ['--.-', 0.5, 1, 'h', 'bottom'],// Q
  ['--..', 2, 2, 'h', 'right'],   // Z
  ['-.', 3.5, 3, 'h', 'right'],   // N
  ['-.-', 2, 3, 'h', 'top'],      // K
  ['-.--', 0.5, 3, 'h', 'top'],   // Y
  ['-.-.', 2, 4, 'h', 'right'],   // C
  ['-..', 3.5, 5, 'h', 'right'],  // D
  ['-..-', 2, 5, 'h', 'left'],    // X
  ['-...', 3.5, 6, 'h', 'left'],  // B
  // 短音側（右）
  ['.', 5.5, 0, 'h', 'top'],        // E
  ['..', 6.5, 0, 'h', 'top'],       // I
  ['...', 7.5, 0, 'h', 'top'],      // S
  ['....', 8.5, 0, 'h', 'top'],     // H
  ['..-', 6.5, 1, 'v', 'left'],     // U
  ['...-', 7.5, 1, 'v', 'right'],   // V
  ['..-.', 6.5, 2, 'h', 'right'],   // F
  ['.-', 5.5, 3, 'v', 'left'],      // A
  ['.-.', 6.5, 3, 'h', 'bottom'],   // R
  ['.-..', 7.5, 3, 'h', 'right'],   // L
  ['.--', 5.5, 5, 'v', 'left'],     // W
  ['.--.', 6.5, 5, 'h', 'right'],   // P
  ['.---', 5.5, 6, 'v', 'right'],   // J
];

const charByCode = new Map(ALPHABET_MORSE.map(item => [item.code, item.char]));

export const MORSE_TREE_NODES: MorseTreeNode[] = LAYOUT.map(([code, x, y, orientation, labelSide]) => {
  const char = charByCode.get(code);
  if (!char) throw new Error(`Unknown morse code in tree layout: ${code}`);
  return { code, char, x, y, orientation, labelSide };
});

const nodeByCode = new Map(MORSE_TREE_NODES.map(node => [node.code, node]));

export const getTreeNode = (code: string): MorseTreeNode | undefined => nodeByCode.get(code);

/** 親ノードの座標（ルートの場合は ROOT_POSITION） */
export const getParentPosition = (code: string): { x: number; y: number } => {
  const parent = nodeByCode.get(code.slice(0, -1));
  return parent ? { x: parent.x, y: parent.y } : ROOT_POSITION;
};

/** バッファの各プレフィックスのうちツリーに存在する符号（経路）を返す */
export const getTreePath = (buffer: string): string[] => {
  const path: string[] = [];
  for (let i = 1; i <= buffer.length; i++) {
    const prefix = buffer.slice(0, i);
    if (!nodeByCode.has(prefix)) break;
    path.push(prefix);
  }
  return path;
};

/** バッファ全体がツリー上の文字に一致するか */
export const isInTree = (buffer: string): boolean => nodeByCode.has(buffer);
