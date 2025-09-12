import { LocalizedText } from "@/types";

/**
 * Get localized text based on current language
 */
export function getLocalizedText(
  text: LocalizedText | string | undefined,
  language: "en" | "fr" = "en",
  fallback?: string
): string {
  if (!text) return fallback || "";

  if (typeof text === "string") return text;

  if (typeof text === "object" && text !== null) {
    const localizedText = text as LocalizedText;
    return localizedText[language] || localizedText.en || fallback || "";
  }

  return fallback || "";
}

/**
 * Get localized array of texts
 */
export function getLocalizedArray(
  texts: LocalizedText[] | string[] | undefined,
  language: "en" | "fr" = "en"
): string[] {
  if (!texts || !Array.isArray(texts)) return [];

  return texts.map((text) => getLocalizedText(text, language));
}

/**
 * Create localized text object
 */
export function createLocalizedText(
  en: string,
  fr: string = ""
): LocalizedText {
  return { en, fr };
}

/**
 * Check if localized text has content in a specific language
 */
export function hasLocalizedContent(
  text: LocalizedText | string | undefined,
  language: "en" | "fr" = "en"
): boolean {
  if (!text) return false;

  if (typeof text === "string") return text.trim() !== "";

  if (typeof text === "object" && text !== null) {
    const localizedText = text as LocalizedText;
    const content = localizedText[language] || localizedText.en;
    return Boolean(content && content.trim() !== "");
  }

  return false;
}

/**
 * Get available languages for a localized text
 */
export function getAvailableLanguages(
  text: LocalizedText | string | undefined
): ("en" | "fr")[] {
  if (!text) return [];

  if (typeof text === "string") return ["en"];

  if (typeof text === "object" && text !== null) {
    const localizedText = text as LocalizedText;
    const languages: ("en" | "fr")[] = [];

    if (localizedText.en && localizedText.en.trim() !== "") {
      languages.push("en");
    }

    if (localizedText.fr && localizedText.fr.trim() !== "") {
      languages.push("fr");
    }

    return languages;
  }

  return [];
}

/**
 * Merge two localized texts
 */
export function mergeLocalizedTexts(
  text1: LocalizedText | string | undefined,
  text2: LocalizedText | string | undefined
): LocalizedText {
  const result: LocalizedText = { en: "", fr: "" };

  if (text1) {
    if (typeof text1 === "string") {
      result.en = text1;
    } else {
      result.en = text1.en || "";
      result.fr = text1.fr || "";
    }
  }

  if (text2) {
    if (typeof text2 === "string") {
      if (!result.en) result.en = text2;
    } else {
      if (!result.en) result.en = text2.en || "";
      if (!result.fr) result.fr = text2.fr || "";
    }
  }

  return result;
}

/**
 * Convert string to localized text (for backward compatibility)
 */
export function stringToLocalized(text: string): LocalizedText {
  return { en: text, fr: "" };
}

/**
 * Convert localized text to string (for display)
 */
export function localizedToString(
  text: LocalizedText | string | undefined,
  language: "en" | "fr" = "en"
): string {
  return getLocalizedText(text, language);
}
