'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { DiagnosisResult as DiagnosisData } from '@/lib/claude';
import { getSeverityColor } from '@/lib/dtc-codes';
import WorkflowTree from './WorkflowTree';
import AffiliateCard from './AffiliateCard';

interface Props {
  code: string;
}

export default function DiagnosisResult({ code }: Props) {
  const t = useTranslations('dtc');
  const locale = useLocale() as 'en' | 'ar' | 'fr';
  const [result, setResult] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');

  async function handleDiagnose() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, locale, carMake, carModel, year }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to get diagnosis. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const langKey: '_en' | '_ar' | '_fr' = locale === 'ar' ? '_ar' : locale === 'fr' ? '_fr' : '_en';

  if (!result) {
    return (
      <div className="mt-8">
        <div className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Car Make (optional)"
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-500"
            />
            <input
              type="text"
              placeholder="Model (optional)"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-500"
            />
            <input
              type="text"
              placeholder="Year (optional)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-500"
            />
          </div>
          <button
            onClick={handleDiagnose}
            disabled={loading}
            className="w-full btn-primary py-4 text-lg disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('loading')}
              </span>
            ) : t('ai_cta')}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      </div>
    );
  }

  const severityClass = getSeverityColor(result.severity);
  const title = locale === 'ar' ? result.title_ar : locale === 'fr' ? result.title_fr : result.title_en;
  const description = locale === 'ar' ? result.description_ar : locale === 'fr' ? result.description_fr : result.description_en;

  return (
    <div className="mt-8 space-y-6">
      {/* Severity + Header */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${severityClass}`}>
            {t(`severity_${result.severity}`)}
          </span>
          {result.diy_possible ? (
            <span className="px-3 py-1 rounded-full text-sm font-semibold border text-green-400 bg-green-900/30 border-green-700/50">
              {t('diy_yes')}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-sm font-semibold border text-orange-400 bg-orange-900/30 border-orange-700/50">
              {t('diy_no')}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300 leading-relaxed">{description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-navy-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{t('cost_label')}</p>
            <p className="text-electric-400 font-semibold">{result.estimated_cost_usd}</p>
          </div>
          <div className="bg-navy-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{t('time_label')}</p>
            <p className="text-electric-400 font-semibold">{result.repair_time_hours}</p>
          </div>
        </div>
      </div>

      {/* Causes */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4">{t('causes_label')}</h3>
        <ul className="space-y-3">
          {result.causes.map((cause, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-electric-500" />
              </div>
              <div className="flex-1">
                <span className="text-gray-200">{cause[locale]}</span>
                <span className="ms-2 text-xs text-gray-500">({cause.probability}%)</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Symptoms */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4">{t('symptoms_label')}</h3>
        <ul className="space-y-2">
          {result.symptoms.map((symptom, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-300">
              <span className="text-yellow-400">⚠</span>
              {symptom[locale]}
            </li>
          ))}
        </ul>
      </div>

      {/* Workflow */}
      <WorkflowTree steps={result.workflow} locale={locale} />

      {/* Parts */}
      {result.parts_needed.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">{t('parts_title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.parts_needed.map((part, i) => (
              <AffiliateCard
                key={i}
                nameEn={part.name_en}
                nameAr={part.name_ar}
                nameFr={part.name_fr}
                searchQuery={part.search_query}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4">{t('testimonials_title')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Ahmed K.', text: 'Saved me $400 by diagnosing the issue myself!' },
            { name: 'Marie D.', text: 'Très utile! Le diagnostic était précis.' },
            { name: 'Carlos M.', text: "Best OBD tool I've used. Fast and accurate." },
          ].map((review, i) => (
            <div key={i} className="bg-navy-900/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-2">"{review.text}"</p>
              <p className="text-electric-400 text-xs font-semibold">— {review.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="#" className="text-electric-400 text-sm hover:underline">{t('share_link')}</a>
        </div>
      </div>
    </div>
  );
}
