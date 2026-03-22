'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {LANGS.map((lang, i) => (
        <span key={lang.code} className="flex items-center">
          <button
            onClick={() => switchLocale(lang.code)}
            className={`px-2 py-1 rounded transition-colors ${
              locale === lang.code
                ? 'text-electric-400 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang.label}
          </button>
          {i < LANGS.length - 1 && <span className="text-gray-600">|</span>}
        </span>
      ))}
    </div>
  );
}
