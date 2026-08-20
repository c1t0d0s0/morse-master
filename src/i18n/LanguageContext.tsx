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
 * 日本語版のWebブラウザでアクセスしたときは日本語('ja')、
 * それ以外の言語のときは英語('en')を判定して返す
 */
export function detectBrowserLanguage(): Language {
  const nav = typeof navigator !== 'undefined' ? navigator : (typeof window !== 'undefined' ? window.navigator : undefined);
  if (!nav) {
    return 'ja';
  }

  const browserLanguages = (nav.languages && nav.languages.length > 0)
    ? nav.languages
    : (nav.language ? [nav.language] : []);

  if (browserLanguages.length === 0) {
    return 'ja';
  }

  for (const lang of browserLanguages) {
    if (lang && typeof lang === 'string' && lang.toLowerCase().startsWith('ja')) {
      return 'ja';
    }
  }

  // 日本語以外はすべて英語
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
