import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en", "fr"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
