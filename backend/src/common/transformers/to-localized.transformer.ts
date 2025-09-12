import { TransformFnParams } from 'class-transformer';

// Normalize input to { en: string; fr: string }
export function toLocalized({ value }: TransformFnParams) {
  if (value == null)
    return undefined as unknown as { en?: string; fr?: string };
  if (typeof value === 'string') {
    return { en: value, fr: '' };
  }
  if (typeof value === 'object') {
    const en = typeof value.en === 'string' ? value.en : '';
    const fr = typeof value.fr === 'string' ? value.fr : '';
    // If the object carried a plain value, map it to en
    if (!en && typeof (value as any).value === 'string') {
      return { en: (value as any).value, fr };
    }
    return { en, fr };
  }
  return { en: String(value), fr: '' };
}
