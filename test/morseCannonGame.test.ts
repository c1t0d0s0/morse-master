import { describe, it, expect } from 'vitest';
import {
  createGame,
  startGame,
  step,
  fire,
  calcPoints,
  getFallSpeed,
  getLevel,
  BASE_FALL_MS,
  SHOT_MS,
  INITIAL_LIVES,
  GAME_CHARSET,
  GameState,
} from '../src/game/morseCannonGame';

/** 決定的な乱数 */
const seqRng = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

const run = (state: GameState, totalMs: number, dt = 16, rng = Math.random) => {
  let s = state;
  for (let t = 0; t < totalMs; t += dt) s = step(s, dt, rng);
  return s;
};

describe('Morse Cannon game logic', () => {
  it('starts in ready phase and begins with one card', () => {
    expect(createGame().phase).toBe('ready');
    const s = startGame();
    expect(s.phase).toBe('playing');
    expect(s.card).not.toBeNull();
    expect(s.lives).toBe(INITIAL_LIVES);
  });

  it('loses a life when a card reaches the bottom, and is over after 3 drops', () => {
    let s = startGame();
    s = run(s, BASE_FALL_MS + 100);
    expect(s.lives).toBe(INITIAL_LIVES - 1);
    expect(s.phase).toBe('playing');
    expect(s.card?.y).toBeLessThan(0.1);

    s = run(s, BASE_FALL_MS * 2 + 200);
    expect(s.lives).toBe(0);
    expect(s.phase).toBe('over');
    expect(s.card).toBeNull();
  });

  it('freezes the card while the shot is in flight, then scores and spawns the next card', () => {
    let s = run(startGame(), 1000);
    const card = s.card!;
    s = fire(s);
    expect(s.shot).not.toBeNull();

    s = step(s, SHOT_MS / 2);
    expect(s.card?.id).toBe(card.id);
    expect(s.card?.y).toBe(card.y);
    expect(s.score).toBe(0);

    s = step(s, SHOT_MS / 2);
    expect(s.score).toBe(calcPoints(card.y, 0));
    expect(s.card?.id).not.toBe(card.id);
    expect(s.shot).toBeNull();
    expect(s.effects.some(e => e.kind === 'hit')).toBe(true);
  });

  it('ignores fire while a shot is already in flight or the game is not playing', () => {
    const s = fire(startGame());
    expect(fire(s)).toBe(s);
    const ready = createGame();
    expect(fire(ready)).toBe(ready);
  });

  it('speeds up a little every minute', () => {
    expect(getLevel(59_999)).toBe(0);
    expect(getLevel(60_000)).toBe(1);
    expect(getLevel(125_000)).toBe(2);
    expect(getFallSpeed(1)).toBeGreaterThan(getFallSpeed(0));
    expect(getFallSpeed(1) / getFallSpeed(0)).toBeLessThan(1.2);
  });

  it('gives more points for higher cards and multiplies by level', () => {
    expect(calcPoints(0, 0)).toBe(20);
    expect(calcPoints(1, 0)).toBe(10);
    expect(calcPoints(0.5, 0)).toBe(15);
    expect(calcPoints(0, 2)).toBe(60);
  });

  it('only uses A-Z and 0-9 and never repeats the same character twice in a row', () => {
    expect(GAME_CHARSET).toHaveLength(36);
    expect(GAME_CHARSET.every(c => /^[A-Z0-9]$/.test(c.char))).toBe(true);

    // 毎回同じ乱数でも直前の文字は避ける
    const rng = seqRng([0]);
    let s = startGame(rng);
    let prev = s.card!.char;
    for (let i = 0; i < 5; i++) {
      s = step(fire(s), SHOT_MS, rng);
      expect(s.card!.char).not.toBe(prev);
      prev = s.card!.char;
    }
  });
});
