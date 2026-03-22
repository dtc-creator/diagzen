'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

interface LikelyCode {
  code: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  probability: number;
  severity: 'critical' | 'moderate' | 'minor';
  brief_en: string;
  brief_ar: string;
  brief_fr: string;
}

interface QuickCheck {
  en: string;
  ar: string;
  fr: string;
}

interface SymptomResult {
  symptom_en: string;
  symptom_ar: string;
  symptom_fr: string;
  likely_codes: LikelyCode[];
  quick_checks: QuickCheck[];
}

const SEVERITY_STYLES = {
  critical: 'text-red-400 border-red-700/50 bg-red-900/20',
  moderate: 'text-yellow-400 border-yellow-700/50 bg-yellow-900/20',
  minor: 'text-green-400 border-green-700/50 bg-green-900/20',
};

export default function SymptomsPage() {
  const locale = useLocale() as 'en' | 'ar' | 'fr';
  const t = useTranslations('symptoms');
  const [loading, setLoading] = useState(false);
  const [activeSymptom, setActiveSymptom] = useState('');
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [error, setError] = useState('');

  async function diagnose(symptomKey: string) {
    const label = t(symptomKey as Parameters<typeof t>[0]);
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
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      setError('Failed to analyze symptom. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const isRtl = locale === 'ar';

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
                {t(key as Parameters<typeof t>[0])}
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

        {error && !loading && <p className="text-red-400 text-center">{error}</p>}

        {result && !loading && (
          <div className="space-y-6">
            {/* Likely Codes */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">{t('results_title')}</h2>
              <div className="space-y-3">
                {result.likely_codes.map((item) => {
                  const title = item[`title_${locale}` as keyof LikelyCode] as string;
                  const brief = item[`brief_${locale}` as keyof LikelyCode] as string;
                  const severityStyle = SEVERITY_STYLES[item.severity] ?? SEVERITY_STYLES.minor;
                  return (
                    <Link
                      key={item.code}
                      href={`/${locale}/dtc/${item.code}`}
                      className="block p-4 rounded-lg bg-navy-900/50 border border-white/5 hover:border-electric-500/30 transition-all group"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-electric-400 font-bold group-hover:text-electric-300">
                          {item.code}
                        </span>
                        <span className="text-gray-200 text-sm font-medium flex-1">{title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${severityStyle}`}>
                          {item.severity}
                        </span>
                        <span className="text-gray-600 group-hover:text-electric-400">→</span>
                      </div>

                      {/* Probability bar */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-navy-800 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-electric-500"
                            style={{ width: `${item.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 min-w-[32px] text-right">{item.probability}%</span>
                      </div>

                      <p className="text-gray-400 text-xs">{brief}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Checks */}
            {result.quick_checks && result.quick_checks.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Checks</h2>
                <ul className="space-y-2" dir={isRtl ? 'rtl' : 'ltr'}>
                  {result.quick_checks.map((check, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="text-electric-400 font-mono mt-0.5">{i + 1}.</span>
                      <span>{check[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer locale={locale} />
    </>
  );
}
