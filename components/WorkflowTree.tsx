'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface WorkflowStep {
  step: number;
  question_en: string;
  question_ar: string;
  question_fr: string;
  yes_next: number | 'result';
  no_next: number | 'result';
  yes_result?: string;
  no_result?: string;
  // Legacy fields for backwards compatibility
  yes_action?: string;
  no_action?: string;
}

interface Props {
  steps: WorkflowStep[];
  locale: 'en' | 'ar' | 'fr';
}

export default function WorkflowTree({ steps, locale }: Props) {
  const t = useTranslations('dtc');
  const [currentStep, setCurrentStep] = useState(1);
  const [history, setHistory] = useState<{ step: number; answer: 'yes' | 'no' }[]>([]);
  const [finalResult, setFinalResult] = useState('');

  const stepMap = Object.fromEntries(steps.map((s) => [s.step, s]));
  const current = stepMap[currentStep];
  const isRtl = locale === 'ar';
  const questionKey = `question_${locale}` as `question_${'en' | 'ar' | 'fr'}`;

  function answer(choice: 'yes' | 'no') {
    if (!current) return;
    const next = choice === 'yes' ? current.yes_next : current.no_next;
    setHistory((prev) => [...prev, { step: currentStep, answer: choice }]);

    if (next === 'result' || next === null) {
      const result =
        choice === 'yes'
          ? (current.yes_result ?? current.yes_action ?? 'Diagnostic complete.')
          : (current.no_result ?? current.no_action ?? 'Diagnostic complete.');
      setFinalResult(result);
    } else {
      if (!stepMap[next as number]) {
        // next step doesn't exist — treat as leaf
        const result =
          choice === 'yes'
            ? (current.yes_result ?? current.yes_action ?? 'Diagnostic complete.')
            : (current.no_result ?? current.no_action ?? 'Diagnostic complete.');
        setFinalResult(result);
      } else {
        setCurrentStep(next as number);
      }
    }
  }

  function reset() {
    setCurrentStep(1);
    setHistory([]);
    setFinalResult('');
  }

  if (!steps || steps.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-white mb-4">{t('workflow_title')}</h3>

      {/* History */}
      {history.length > 0 && (
        <div className="mb-4 space-y-2">
          {history.map((h, i) => {
            const s = stepMap[h.step];
            return (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-gray-400"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <span className="text-electric-400 font-mono shrink-0">Q{h.step}</span>
                <span className="flex-1">{s?.[questionKey]}</span>
                <span
                  className={`shrink-0 font-semibold ${
                    h.answer === 'yes' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {h.answer === 'yes' ? t('workflow_yes') : t('workflow_no')}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Final result */}
      {finalResult ? (
        <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-4">
          <p className="text-green-400 font-semibold mb-2">✅ Diagnosis Result</p>
          <p className="text-gray-200">{finalResult}</p>
          <button
            onClick={reset}
            className="mt-4 text-sm text-gray-400 hover:text-white underline"
          >
            Start Over
          </button>
        </div>
      ) : current ? (
        <div>
          {/* Step counter */}
          <p className="text-xs text-gray-500 mb-3">
            Step {history.length + 1} of {steps.length}
          </p>

          <p className="text-white font-medium mb-5" dir={isRtl ? 'rtl' : 'ltr'}>
            <span className="text-electric-400 font-mono me-2">Step {currentStep}:</span>
            {current[questionKey]}
          </p>

          <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => answer('yes')}
              className="flex-1 py-3 rounded-lg bg-green-900/30 border border-green-700/50 text-green-400 hover:bg-green-900/50 font-semibold transition-colors"
            >
              {t('workflow_yes')}
            </button>
            <button
              onClick={() => answer('no')}
              className="flex-1 py-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-400 hover:bg-red-900/50 font-semibold transition-colors"
            >
              {t('workflow_no')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
