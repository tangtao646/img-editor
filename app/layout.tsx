// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { getTranslations } from './lib/i18n/locales';
import Script from 'next/script';
import { AD_CLIENT_ID } from './lib/adConfig';

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_LOCALE || 'zh-CN';

export async function generateMetadata(): Promise<Metadata> {
  const t = getTranslations(DEFAULT_LOCALE);
  return {
    title: t.title,
    description: t.description,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = DEFAULT_LOCALE;
  return (
    <html lang={locale}>
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}