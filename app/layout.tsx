// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { getTranslations } from './lib/i18n/locales';

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
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}