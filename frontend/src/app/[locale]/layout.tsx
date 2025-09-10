import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/components/ui";
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Professional Portfolio",
  description:
    "Full Stack Developer Portfolio showcasing modern web applications",
  keywords: [
    "portfolio",
    "developer",
    "full stack",
    "react",
    "nextjs",
    "typescript",
  ],
  authors: [{ name: "Portfolio Owner" }],
  creator: "Portfolio Owner",
  publisher: "Portfolio Owner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000"
  ),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Professional Portfolio",
    description:
      "Full Stack Developer Portfolio showcasing modern web applications",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Portfolio",
    description:
      "Full Stack Developer Portfolio showcasing modern web applications",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  const validLocales = ['en', 'fr'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <CustomThemeProvider>
            <ErrorBoundary>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    style: {
                      background: "#10b981",
                    },
                  },
                  error: {
                    duration: 5000,
                    style: {
                      background: "#ef4444",
                    },
                  },
                }}
              />
            </ErrorBoundary>
          </CustomThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
