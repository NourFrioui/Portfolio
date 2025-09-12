import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalizationService {
  /**
   * Get localized text from a localized field
   * @param field - The localized field object
   * @param language - The language code ('en' or 'fr')
   * @param fallback - Fallback text if field is not available
   * @returns The localized text
   */
  getLocalizedText(
    field: { en?: string; fr?: string } | string | undefined,
    language: 'en' | 'fr' = 'en',
    fallback: string = '',
  ): string {
    if (!field) return fallback;

    if (typeof field === 'string') return field;

    if (typeof field === 'object') {
      const text = field[language];
      if (text && text.trim() !== '') return text;

      // Fallback to English if French is not available
      if (language === 'fr' && field.en && field.en.trim() !== '') {
        return field.en;
      }

      // Fallback to French if English is not available
      if (language === 'en' && field.fr && field.fr.trim() !== '') {
        return field.fr;
      }
    }

    return fallback;
  }

  /**
   * Get localized text from an array of localized fields
   * @param fields - Array of localized field objects
   * @param language - The language code ('en' or 'fr')
   * @returns Array of localized texts
   */
  getLocalizedArray(
    fields: Array<{ en?: string; fr?: string }> | string[] | undefined,
    language: 'en' | 'fr' = 'en',
  ): string[] {
    if (!fields || !Array.isArray(fields)) return [];

    return fields.map((field) =>
      this.getLocalizedText(
        field as { en?: string; fr?: string } | string,
        language,
      ),
    );
  }

  /**
   * Check if a localized field has content
   * @param field - The localized field object
   * @param language - The language code ('en' or 'fr')
   * @returns True if field has content in the specified language
   */
  hasLocalizedContent(
    field: { en?: string; fr?: string } | string | undefined,
    language: 'en' | 'fr' = 'en',
  ): boolean {
    if (!field) return false;

    if (typeof field === 'string') return field.trim() !== '';

    if (typeof field === 'object') {
      const text = field[language];
      return Boolean(text && text.trim() !== '');
    }

    return false;
  }

  /**
   * Get all available languages for a localized field
   * @param field - The localized field object
   * @returns Array of available language codes
   */
  getAvailableLanguages(
    field: { en?: string; fr?: string } | string | undefined,
  ): ('en' | 'fr')[] {
    if (!field) return [];

    if (typeof field === 'string') return ['en'];

    if (typeof field === 'object') {
      const languages: ('en' | 'fr')[] = [];
      if (field.en && field.en.trim() !== '') languages.push('en');
      if (field.fr && field.fr.trim() !== '') languages.push('fr');
      return languages;
    }

    return [];
  }

  /**
   * Create a localized field from a string
   * @param text - The text to localize
   * @param language - The language code ('en' or 'fr')
   * @returns Localized field object
   */
  createLocalizedField(
    text: string,
    language: 'en' | 'fr' = 'en',
  ): { en: string; fr: string } {
    if (language === 'en') {
      return { en: text, fr: '' };
    } else {
      return { en: '', fr: text };
    }
  }

  /**
   * Merge localized fields
   * @param field1 - First localized field
   * @param field2 - Second localized field
   * @returns Merged localized field
   */
  mergeLocalizedFields(
    field1: { en?: string; fr?: string } | string | undefined,
    field2: { en?: string; fr?: string } | string | undefined,
  ): { en: string; fr: string } {
    const result = { en: '', fr: '' };

    // Process first field
    if (field1) {
      if (typeof field1 === 'string') {
        result.en = field1;
      } else if (typeof field1 === 'object') {
        result.en = field1.en || '';
        result.fr = field1.fr || '';
      }
    }

    // Process second field
    if (field2) {
      if (typeof field2 === 'string') {
        if (!result.en) result.en = field2;
      } else if (typeof field2 === 'object') {
        if (!result.en && field2.en) result.en = field2.en;
        if (!result.fr && field2.fr) result.fr = field2.fr;
      }
    }

    return result;
  }
}
