import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKeys } from './translations';

export type LanguageMode = 'auto' | 'ja' | 'en';

interface LanguageContextType {
  language: Language;
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
  t: TranslationKeys;
}

const STORAGE_KEY = 'morse_master_language_mode';

/**
 * ユーザーのブラウザ言語設定（優先順位順）に基づいて適切な表示言語（'ja' または 'en'）を判定して返す
 */
export function detectBrowserLanguage(): Language {
  const nav = typeof navigator !== 'undefined' ? navigator : (typeof window !== 'undefined' ? window.navigator : undefined);
  if (!nav) {
    return 'en';
  }

  const browserLanguages = (nav.languages && nav.languages.length > 0)
    ? nav.languages
    : (nav.language ? [nav.language] : []);

  if (browserLanguages.length === 0) {
    return 'en';
  }

  // 優先言語リストを先頭（優先度が高い順）から走査
  for (const rawLang of browserLanguages) {
    if (!rawLang || typeof rawLang !== 'string') continue;
    const lang = rawLang.toLowerCase();
    if (lang.startsWith('ja')) {
      return 'ja';
    }
    if (lang.startsWith('en')) {
      return 'en';
    }
  }

  // 対応言語（ja / en）以外の言語環境（例: zh, fr, de, es 等）は国際標準として英語をデフォルトとする
  return 'en';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languageMode, setLanguageModeState] = useState<LanguageMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'auto' || saved === 'ja' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'auto';
  });

  const language: Language = languageMode === 'auto' ? detectBrowserLanguage() : languageMode;

  const setLanguageMode = (mode: LanguageMode) => {
    setLanguageModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // HTML lang 属性およびページの title / description を言語に合わせて更新
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      const currentTranslation = translations[language];
      document.title = currentTranslation.appTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', currentTranslation.appDescription);
      }
    }
  }, [language]);

  const value = {
    language,
    languageMode,
    setLanguageMode,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
