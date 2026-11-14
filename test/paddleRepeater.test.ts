import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PaddleRepeater, PaddleSymbol } from '../src/hooks/paddleRepeater';

const DOT = 100;

const setup = () => {
  const sent: Array<{ symbol: PaddleSymbol; at: number }> = [];
  const held: Array<PaddleSymbol | null> = [];
  const start = Date.now();
  const repeater = new PaddleRepeater({
    onSymbol: symbol => sent.push({ symbol, at: Date.now() - start }),
    getDotMs: () => DOT,
    onHeldChange: h => held.push(h),
  });
  return { repeater, sent, held };
};

describe('PaddleRepeater (paddle auto-repeat)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('sends one dot on a quick tap', () => {
    const { repeater, sent } = setup();
    repeater.press('.');
    vi.advanceTimersByTime(50);
    repeater.release('.');
    vi.advanceTimersByTime(1000);
    expect(sent.map(s => s.symbol)).toEqual(['.']);
  });

  it('repeats dots every 2 units while held (トン・トン・トン)', () => {
    const { repeater, sent } = setup();
    repeater.press('.');
    vi.advanceTimersByTime(DOT * 2 * 2 + 10); // 送出: 0, 200, 400
    repeater.release('.');
    vi.advanceTimersByTime(1000);
    expect(sent.map(s => s.at)).toEqual([0, 200, 400]);
    expect(sent.every(s => s.symbol === '.')).toBe(true);
  });

  it('repeats dashes every 4 units while held (ツー・ツー・ツー)', () => {
    const { repeater, sent } = setup();
    repeater.press('-');
    vi.advanceTimersByTime(DOT * 4 * 2 + 10); // 送出: 0, 400, 800
    repeater.release('-');
    vi.advanceTimersByTime(1000);
    expect(sent.map(s => s.at)).toEqual([0, 400, 800]);
    expect(sent.every(s => s.symbol === '-')).toBe(true);
  });

  it('does not drop a quick tap made while the previous element is still sounding', () => {
    const { repeater, sent } = setup();
    repeater.press('-');
    repeater.release('-');
    vi.advanceTimersByTime(50);
    repeater.press('.');
    repeater.release('.');
    vi.advanceTimersByTime(1000);
    expect(sent.map(s => `${s.symbol}@${s.at}`)).toEqual(['-@0', '.@400']);
  });

  it('repeats the most recently pressed paddle when both are held', () => {
    const { repeater, sent } = setup();
    repeater.press('.');
    vi.advanceTimersByTime(50);
    repeater.press('-'); // 送出中に押された → 次は長点
    vi.advanceTimersByTime(200 - 50 + 400 + 10); // 200: '-', 600: '-'
    repeater.release('-'); // 短点はまだ押下中 → 短点に戻る
    vi.advanceTimersByTime(400);  // 1000: '.'
    repeater.release('.');
    vi.advanceTimersByTime(1000);
    expect(sent.map(s => `${s.symbol}@${s.at}`)).toEqual(['.@0', '-@200', '-@600', '.@1000']);
  });

  it('stops repeating after releaseAll and reports held state', () => {
    const { repeater, sent, held } = setup();
    repeater.press('.');
    vi.advanceTimersByTime(250);
    repeater.releaseAll();
    vi.advanceTimersByTime(1000);
    expect(sent).toHaveLength(2);
    expect(held).toEqual(['.', null]);
  });
});
