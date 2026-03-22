'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface WorkflowStep {
  step: number;
  question_en: string;
  question_ar: string;
  question_fr: string;
  yes_next: number | null;
  no_next: number | null;
  yes_action: string;
  no_action: string;
}

interface Props {
  steps: WorkflowStep[];
  locale: 'en' | 'ar' | 'fr';
}

export default function WorkflowTree({ steps, locale }: Props) {
  const t = useTranslations('dtc');
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState<{ step: number; answer: 'yes' | 'no'; action: string }[]>([]);
  const [finalAction, setFinalAction] = useState('');

  const stepMap = Object.fromEntries(steps.map((s) => [s.step, s]));
  const current = stepMap[currentStep];

  function answer(choice: 'yes' | 'no') {
    if (!current) return;
    const action = choice === 'yes' ? current.yes_action : current.no_action;
    const next = choice === 'yes' ? current.yes_next : current.no_next;
    setCompleted((prev) => [...prev, { step: currentStep, answer: choice, action }]);
    if (next === null || !stepMap[next]) {
      setFinalAction(action);
    } else {
      setCurrentStep(next);
    }
  }

  function reset() {
    setCurrentStep(1);
    setCompleted([]);
    setFinalAction('');
  }

  const questionKey = `question_${locale}` as `question_${'en' | 'ar' | 'fr'}`;

  if (!steps || steps.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-white mb-4">{t('workflow_title')}</h3>

      {/* History */}
      {completed.length > 0 && (
        <div className="mb-4 space-y-2">
          {completed.map((c, i) => {
            const s = stepMap[c.step];
            return (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-electric-400 font-mono">Q{c.step}</span>
                <span>{s?.[questionKey]}</span>
                <span className={`ms-auto font-semibold ${c.answer === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                  {c.answer === 'yes' ? t('workflow_yes') : t('workflow_no')}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {finalAction ? (
        <div className="bg-electric-500/10 border border-electric-500/30 rounded-lg p-4">
          <p className="text-electric-400 font-semibold mb-1">✅ Diagnosis Result</p>
          <p className="text-gray-200">{finalAction}</p>
          <button onClick={reset} className="mt-3 text-sm text-gray-400 hover:text-white underline">
            Start over
          </button>
        </div>
      ) : current ? (
        <div>
          <p className="text-white font-medium mb-4">
            <span className="text-electric-400 font-mono me-2">Step {currentStep}:</span>
            {current[questionKey]}
          </p>
          <div className="flex gap-3">
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
