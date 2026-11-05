import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectBrowserLanguage } from '../src/i18n/LanguageContext';
import { translations } from '../src/i18n/translations';
import { WORD_COLLECTIONS } from '../src/data/wordLists';
import { ALPHABET_MORSE, NUMBER_MORSE, WABUN_MORSE, SYMBOL_MORSE } from '../src/data/morseData';

describe('i18n Language Detection & Translation Tests', () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  const mockNavigatorLanguages = (languages: string[], language?: string) => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        languages,
        language: language || languages[0],
      },
      configurable: true,
      writable: true,
    });
  };

  it('should detect Japanese when browser language is "ja"', () => {
    mockNavigatorLanguages(['ja']);
    expect(detectBrowserLanguage()).toBe('ja');
  });

  it('should detect Japanese when browser language is "ja-JP"', () => {
    mockNavigatorLanguages(['ja-JP', 'en-US']);
    expect(detectBrowserLanguage()).toBe('ja');
  });

  it('should detect Japanese when browser language array contains "ja-JP"', () => {
    mockNavigatorLanguages(['ja-JP', 'ja', 'en']);
    expect(detectBrowserLanguage()).toBe('ja');
  });

  it('should fallback to English for non-Japanese languages (en, en-US, en-GB)', () => {
    mockNavigatorLanguages(['en-US', 'en']);
    expect(detectBrowserLanguage()).toBe('en');

    mockNavigatorLanguages(['en-GB']);
    expect(detectBrowserLanguage()).toBe('en');

    // 英語が優先で日本語が後順位に含まれている場合も正しく英語を検出すること
    mockNavigatorLanguages(['en-US', 'en', 'ja']);
    expect(detectBrowserLanguage()).toBe('en');

    mockNavigatorLanguages(['en-GB', 'ja-JP']);
    expect(detectBrowserLanguage()).toBe('en');
  });

  it('should fallback to English for other international languages (zh, es, fr, de, ko, etc.)', () => {
    mockNavigatorLanguages(['zh-CN', 'zh']);
    expect(detectBrowserLanguage()).toBe('en');

    mockNavigatorLanguages(['fr-FR', 'fr']);
    expect(detectBrowserLanguage()).toBe('en');

    mockNavigatorLanguages(['de-DE', 'de']);
    expect(detectBrowserLanguage()).toBe('en');

    mockNavigatorLanguages(['ko-KR', 'ko']);
    expect(detectBrowserLanguage()).toBe('en');

    mockNavigatorLanguages(['es-ES', 'es']);
    expect(detectBrowserLanguage()).toBe('en');
  });

  it('should contain all required translation keys in both JA and EN dictionaries', () => {
    expect(translations.ja.appName).toBe('モールスマスター');
    expect(translations.en.appName).toBe('Morse Master');

    expect(translations.ja.nav.listening).toBe('聞き取り練習');
    expect(translations.en.nav.listening).toBe('Listening');

    expect(translations.ja.nav.tapping).toBe('タップ送信練習');
    expect(translations.en.nav.tapping).toBe('Tapping');

    expect(translations.ja.nav.reference).toBe('符号一覧表');
    expect(translations.en.nav.reference).toBe('Reference Chart');

    expect(translations.ja.nav.translator).toBe('翻訳＆再生');
    expect(translations.en.nav.translator).toBe('Translator');

    expect(translations.ja.nav.freeKeyer).toBe('フリー電信機');
    expect(translations.en.nav.freeKeyer).toBe('Free Keyer');

    expect(translations.ja.freeKeyer.focusMode).toBe('集中モード');
    expect(translations.en.freeKeyer.focusMode).toBe('Focus Mode');
    expect(translations.ja.freeKeyer.focusExit).toBeTruthy();
    expect(translations.en.freeKeyer.focusExit).toBeTruthy();
  });

  it('should have English names / mnemonics for Morse items', () => {
    const itemA = ALPHABET_MORSE.find(i => i.char === 'A');
    expect(itemA?.nameEn).toBe('Alpha');
    expect(itemA?.mnemonicEn).toBe('di-dah (.-)');

    const item1 = NUMBER_MORSE.find(i => i.char === '1');
    expect(item1?.nameEn).toBe('One');
    expect(item1?.mnemonicEn).toBe('di-dah-dah-dah-dah (.----)');

    const itemQuestion = SYMBOL_MORSE.find(i => i.char === '?');
    expect(itemQuestion?.nameEn).toContain('Question Mark');
  });

  it('should have English hints or meanings in word collections', () => {
    const sos = WORD_COLLECTIONS.find(w => w.text === 'SOS');
    expect(sos?.meaningJa).toBeDefined();
    expect(sos?.meaningEn).toBeDefined();
    expect(sos?.hintEn).toBeDefined();

    const cq = WORD_COLLECTIONS.find(w => w.text === 'CQ');
    expect(cq?.meaningEn).toBeDefined();
  });
});
