import type { Metadata } from 'next';
import { DM_Mono, Inter, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import '../globals.css';

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: {
    default: 'DiagZen — AI-Powered OBD-II Diagnostic Tool',
    template: '%s | DiagZen',
  },
  description: 'AI-powered OBD-II fault code lookup. Get instant diagnosis, causes, and repair guides for any DTC code.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diagzen.com'),
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === 'ar';
  const fontClass = locale === 'ar' ? cairo.variable : '';

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${dmMono.variable} ${inter.variable} ${fontClass}`}
    >
      <body className={`bg-navy-950 text-white ${locale === 'ar' ? 'font-cairo' : 'font-sans'} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
