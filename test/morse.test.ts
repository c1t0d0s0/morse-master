import { describe, it, expect } from 'vitest';
import {
  textToMorse,
  morseToText,
  decomposeWabunText,
  morseToDotsAndDashes,
  dotsAndDashesToMorse,
  hiraganaToKatakana,
  ALPHABET_MORSE,
  NUMBER_MORSE,
  WABUN_MORSE,
} from '../src/data/morseData';
import { MorseAudioEngine } from '../src/audio/morseAudioEngine';

describe('Morse Code Converter & Data Tests', () => {
  it('should convert alphabet to morse code accurately', () => {
    const res = textToMorse('SOS');
    expect(res.code).toBe('... --- ...');
    expect(res.items.map(i => i.char)).toEqual(['S', 'O', 'S']);
  });

  it('should decode morse code back to alphabet', () => {
    const decoded = morseToText('... --- ...');
    expect(decoded).toBe('SOS');
  });

  it('should handle numbers in morse code', () => {
    const res = textToMorse('123');
    expect(res.code).toBe('.---- ..--- ...--');
    expect(morseToText('.---- ..--- ...--')).toBe('123');
  });

  it('should decompose Japanese dakuten and handakuten characters properly', () => {
    const decomposed = decomposeWabunText('ガッコー');
    expect(decomposed).toEqual(['カ', '゛', 'ツ', 'コ', 'ー']);
  });

  it('should convert Japanese text (hiragana and katakana) to Wabun Morse', () => {
    const res = textToMorse('コンニチハ', true);
    // コ: '----', ン: '.-.-.', ニ: '-.-.', チ: '..-.', ハ: '-...'
    expect(res.code).toBe('---- .-.-. -.-. ..-. -...');
  });

  it('should decode Wabun Morse back to Japanese with dakuten combining', () => {
    // カ: '.-..', 濁点: '..' -> ガ
    const decoded = morseToText('.-.. ..', true);
    expect(decoded).toBe('ガ');
  });

  it('should convert between dots/dashes symbols and raw morse code', () => {
    const raw = '... --- ...';
    const visual = morseToDotsAndDashes(raw);
    expect(visual).toBe('・・・ －－－ ・・・');
    expect(dotsAndDashesToMorse(visual)).toBe(raw);
  });

  it('should convert hiragana to katakana', () => {
    expect(hiraganaToKatakana('あいうえお')).toBe('アイウエオ');
  });

  it('should calculate accurate PARIS dot duration for different WPM settings', () => {
    const engine = new MorseAudioEngine();
    // At 15 WPM, 1 dot = 1200 / 15 = 80ms
    expect(engine.getDotDurationMs(15)).toBe(80);
    // At 20 WPM, 1 dot = 1200 / 20 = 60ms
    expect(engine.getDotDurationMs(20)).toBe(60);
    // At 10 WPM, 1 dot = 1200 / 10 = 120ms
    expect(engine.getDotDurationMs(10)).toBe(120);
  });
});
