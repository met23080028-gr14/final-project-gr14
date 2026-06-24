"use client";

import { useTranslation } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/30 bg-white/10 p-0.5">
      <button
        onClick={() => setLang("vi")}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
          lang === "vi"
            ? "bg-white text-brand-red shadow-sm"
            : "text-white/80 hover:text-white"
        }`}
        aria-label="Tiếng Việt"
        aria-pressed={lang === "vi"}
      >
        <span className="text-sm leading-none">🇻🇳</span>
        <span>VN</span>
      </button>
      <button
        onClick={() => setLang("en")}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
          lang === "en"
            ? "bg-white text-brand-red shadow-sm"
            : "text-white/80 hover:text-white"
        }`}
        aria-label="English"
        aria-pressed={lang === "en"}
      >
        <span className="text-sm leading-none">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
