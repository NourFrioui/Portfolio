"use client";

import { useTranslations, useLocale } from '@/hooks/useTranslations';
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function LanguageSwitcher() {
  const t = useTranslations("Language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
        aria-label={t("switch")}
      >
        <span className="text-lg">🌐</span>
        <span className="uppercase">{locale}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
          <button
            onClick={() => switchLanguage("en")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors ${
              locale === "en" ? "text-blue-600 font-medium" : "text-slate-700"
            }`}
          >
            🇺🇸 {t("english")}
          </button>
          <button
            onClick={() => switchLanguage("fr")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors ${
              locale === "fr" ? "text-blue-600 font-medium" : "text-slate-700"
            }`}
          >
            🇫🇷 {t("french")}
          </button>
        </div>
      )}
    </div>
  );
}
