"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import vi, { type Dictionary } from "./vi";
import en from "./en";

type Lang = "vi" | "en";

const DICTIONARIES: Record<Lang, Dictionary> = { vi, en };
const LS_KEY = "poseidon_lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dictionary) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) as Lang | null;
    if (stored === "vi" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LS_KEY, l);
  }, []);

  const t = useCallback(
    (key: keyof Dictionary): string => DICTIONARIES[lang][key],
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}
