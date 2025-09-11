'use client';

import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../../messages/en.json';

interface AdminLayoutProps {
  children: ReactNode;
}

// Create a client-only wrapper to prevent SSR issues
const ClientOnlyWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        {children}
      </Suspense>
    </NextIntlClientProvider>
  );
};

// Make the wrapper dynamic with no SSR
const DynamicClientWrapper = dynamic(() => Promise.resolve(ClientOnlyWrapper), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <DynamicClientWrapper>{children}</DynamicClientWrapper>;
}
