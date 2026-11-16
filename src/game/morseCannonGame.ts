import { ALPHABET_MORSE, NUMBER_MORSE } from '../data/morseData';

/**
 * モールス・キャノン（ゲームタブ）のロジック。React 非依存の純粋関数。
 * 座標: x は 0〜1（フィールド幅に対する割合）、y は 0=上端 〜 1=大砲ライン。
 */

export type GamePhase = 'ready' | 'playing' | 'over';
export type Rng = () => number;

export interface GameCard {
  id: number;
  char: string;
  code: string;
  x: number;
  y: number;
}

export interface GameShot {
  cardId: number;
  elapsedMs: number;
  points: number;
}

export interface GameEffect {
  id: number;
  kind: 'hit' | 'drop';
  x: number;
  y: number;
  points: number;
  ageMs: number;
}

export interface GameState {
  phase: GamePhase;
  card: GameCard | null;
  shot: GameShot | null;
  effects: GameEffect[];
  score: number;
  lives: number;
  elapsedMs: number;
  nextId: number;
}

// ---- 調整用の定数 ----
export const INITIAL_LIVES = 3;
/** レベル0でカードが上端から大砲ラインまで落ちる時間 */
export const BASE_FALL_MS = 10_000;
/** 1分ごとの落下速度の増加率 */
export const SPEED_UP_PER_LEVEL = 0.08;
export const LEVEL_DURATION_MS = 60_000;
/** 砲弾が発射されてから命中するまでの時間 */
export const SHOT_MS = 250;
export const EFFECT_MS = 700;
/** カードの出現位置 x の範囲 */
const MIN_X = 0.15;
const MAX_X = 0.85;

export const GAME_CHARSET = [...ALPHABET_MORSE, ...NUMBER_MORSE].map(item => ({
  char: item.char,
  code: item.code,
}));

export const getLevel = (elapsedMs: number) => Math.floor(elapsedMs / LEVEL_DURATION_MS);

/** 1ms あたりの落下量 */
export const getFallSpeed = (level: number) => (1 / BASE_FALL_MS) * (1 + SPEED_UP_PER_LEVEL * level);

/** 撃ち落としたときの得点。高い位置で消すほどボーナス、レベルで倍率 */
export const calcPoints = (y: number, level: number) =>
  (10 + Math.round((1 - Math.min(Math.max(y, 0), 1)) * 10)) * (1 + level);

const spawnCard = (id: number, previousChar: string | null, rng: Rng): GameCard => {
  const candidates = previousChar ? GAME_CHARSET.filter(c => c.char !== previousChar) : GAME_CHARSET;
  const pick = candidates[Math.min(Math.floor(rng() * candidates.length), candidates.length - 1)];
  return {
    id,
    char: pick.char,
    code: pick.code,
    x: MIN_X + rng() * (MAX_X - MIN_X),
    y: 0,
  };
};

export const createGame = (): GameState => ({
  phase: 'ready',
  card: null,
  shot: null,
  effects: [],
  score: 0,
  lives: INITIAL_LIVES,
  elapsedMs: 0,
  nextId: 1,
});

export const startGame = (rng: Rng = Math.random): GameState => ({
  ...createGame(),
  phase: 'playing',
  card: spawnCard(1, null, rng),
  nextId: 2,
});

/** 現在のカードに向けて砲弾を発射（命中までカードは停止） */
export const fire = (state: GameState): GameState => {
  if (state.phase !== 'playing' || !state.card || state.shot) return state;
  return {
    ...state,
    shot: {
      cardId: state.card.id,
      elapsedMs: 0,
      points: calcPoints(state.card.y, getLevel(state.elapsedMs)),
    },
  };
};

/** 時間を dtMs 進める */
export const step = (state: GameState, dtMs: number, rng: Rng = Math.random): GameState => {
  const effects = state.effects
    .map(e => ({ ...e, ageMs: e.ageMs + dtMs }))
    .filter(e => e.ageMs < EFFECT_MS);

  if (state.phase !== 'playing' || !state.card) {
    return { ...state, effects };
  }

  const elapsedMs = state.elapsedMs + dtMs;
  let { score, lives, nextId } = state;
  let card: GameCard | null = state.card;
  let shot = state.shot;
  let phase: GamePhase = state.phase;

  if (shot) {
    // 命中待ち: カードは止めたまま砲弾だけ進める
    shot = { ...shot, elapsedMs: shot.elapsedMs + dtMs };
    if (shot.elapsedMs >= SHOT_MS) {
      score += shot.points;
      effects.push({ id: nextId++, kind: 'hit', x: card.x, y: card.y, points: shot.points, ageMs: 0 });
      card = spawnCard(nextId++, card.char, rng);
      shot = null;
    }
  } else {
    const y = card.y + getFallSpeed(getLevel(elapsedMs)) * dtMs;
    if (y >= 1) {
      lives -= 1;
      effects.push({ id: nextId++, kind: 'drop', x: card.x, y: 1, points: 0, ageMs: 0 });
      if (lives <= 0) {
        phase = 'over';
        card = null;
      } else {
        card = spawnCard(nextId++, card.char, rng);
      }
    } else {
      card = { ...card, y };
    }
  }

  return { ...state, phase, card, shot, effects, score, lives, elapsedMs, nextId };
};
