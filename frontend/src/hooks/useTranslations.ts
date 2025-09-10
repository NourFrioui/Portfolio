"use client";

import { useParams } from 'next/navigation';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';

const messages = {
  en: enMessages,
  fr: frMessages,
};

export function useTranslations(namespace?: string) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  
  const currentMessages = messages[locale as keyof typeof messages] || messages.en;
  
  return (key: string) => {
    const keys = namespace ? `${namespace}.${key}` : key;
    const keyPath = keys.split('.');
    
    let value: any = currentMessages;
    for (const k of keyPath) {
      value = value?.[k];
    }
    
    return value || key;
  };
}

export function useLocale() {
  const params = useParams();
  return (params?.locale as string) || 'en';
}
