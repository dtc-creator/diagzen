'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DTC_STATIC_DATA, getSeverityColor } from '@/lib/dtc-codes';

const SYMPTOMS = [
  { key: 'engine_wont_start', icon: '🔴' },
  { key: 'poor_fuel_economy', icon: '⛽' },
  { key: 'engine_misfiring', icon: '⚡' },
  { key: 'check_engine_light', icon: '🔶' },
  { key: 'car_stalling', icon: '🚗' },
  { key: 'rough_idle', icon: '📳' },
  { key: 'loss_of_power', icon: '📉' },
  { key: 'strange_noise', icon: '🔊' },
] as const;

interface SymptomResult {
  codes: string[];
  descriptions: Record<string, string>;
}

export default function SymptomsPage() {
  const locale = useLocale();
  const t = useTranslations('symptoms');
  const [loading, setLoading] = useState(false);
  const [activeSymptom, setActiveSymptom] = useState('');
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [error, setError] = useState('');

  async function diagnose(symptomKey: string) {
    const label = t(symptomKey as keyof typeof SYMPTOMS[number]);
    setActiveSymptom(symptomKey);
    setResult(null);
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: label, locale }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to analyze symptom. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400 mb-10">{t('subtitle')}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {SYMPTOMS.map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => diagnose(key)}
              className={`glass-card p-5 text-start hover:border-electric-500/30 transition-all group ${
                activeSymptom === key ? 'border-electric-500/50 bg-electric-500/5' : ''
              }`}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {t(key as any)}
              </p>
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-electric-400">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('loading')}
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-center">{error}</p>}

        {result && !loading && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t('results_title')}</h2>
            <div className="space-y-3">
              {result.codes.map((code) => {
                const data = DTC_STATIC_DATA[code];
                const nameKey = `name_${locale}` as `name_${'en' | 'ar' | 'fr'}`;
                return (
                  <Link
                    key={code}
                    href={`/${locale}/dtc/${code}`}
                    className="flex items-center gap-4 p-4 rounded-lg bg-navy-900/50 border border-white/5 hover:border-electric-500/30 transition-all group"
                  >
                    <span className="font-mono text-electric-400 font-bold min-w-[80px] group-hover:text-electric-300">
                      {code}
                    </span>
                    <div className="flex-1">
                      {data ? (
                        <span className="text-gray-200 text-sm">{data[nameKey]}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">{result.descriptions[code]}</span>
                      )}
                    </div>
                    {data && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(data.severity)}`}>
                        {data.severity}
                      </span>
                    )}
                    <span className="text-gray-600 group-hover:text-electric-400">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer locale={locale} />
    </>
  );
}
