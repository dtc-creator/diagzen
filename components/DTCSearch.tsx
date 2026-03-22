'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { isValidDTC } from '@/lib/dtc-codes';

const ROTATING_PLACEHOLDERS = ['P0087', 'P0300', 'B0001', 'P0171', 'P0420'];

export default function DTCSearch({ initialCode = '' }: { initialCode?: string }) {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState('');
  const [placeholder, setPlaceholder] = useState(ROTATING_PLACEHOLDERS[0]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  let idx = useRef(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      idx.current = (idx.current + 1) % ROTATING_PLACEHOLDERS.length;
      setPlaceholder(ROTATING_PLACEHOLDERS[idx.current]);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  function handleSearch() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    if (!isValidDTC(trimmed)) {
      setError(t('error_format'));
      return;
    }
    setError('');
    setLoading(true);
    router.push(`/${locale}/dtc/${trimmed}`);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('placeholder', { fallback: `Enter DTC code (e.g. ${placeholder})` })}
            className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-500 font-mono text-lg focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all"
            maxLength={6}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn-primary text-lg px-8 py-4 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed animate-glow"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              ...
            </span>
          ) : t('button')}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
