import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/components/ui";
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Professional Portfolio - Full Stack Developer",
  description: "Professional portfolio showcasing full-stack development expertise with modern technologies",
  keywords: ["portfolio", "full-stack developer", "React", "Next.js", "Node.js", "TypeScript"],
  authors: [{ name: "Portfolio Owner" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Professional Portfolio - Full Stack Developer",
    description: "Professional portfolio showcasing full-stack development expertise",
    siteName: "Professional Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Portfolio - Full Stack Developer",
    description: "Professional portfolio showcasing full-stack development expertise",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <CustomThemeProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                  },
                }}
              />
            </CustomThemeProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

