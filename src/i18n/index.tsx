import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

type Dict = Record<string, string>;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const LANG_KEY = 'kmg-hse-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    return saved && ['kz', 'ru', 'en'].includes(saved) ? saved : 'ru';
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === 'kz' ? 'kk' : lang;
  }, [lang]);

  const value = useMemo<I18nCtx>(() => {
    const dict = translations[lang] as Dict;
    const fallback = translations.ru as Dict;
    return {
      lang,
      setLang: setLangState,
      t: (key, vars) => {
        let str = dict[key] ?? fallback[key] ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
          }
        }
        return str;
      },
    };
  }, [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type { Lang };
