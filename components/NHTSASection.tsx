'use client';
import { useState } from 'react';

interface Props {
  code: string;
  locale: string;
}

const LABELS = {
  en: {
    title: '🏛️ Official Safety Data',
    subtitle: 'From NHTSA — U.S. National Highway Traffic Safety Administration',
    load: 'Load Official Reports',
    complaints: 'Official Complaints',
    recalls: 'Safety Recalls',
    loading: 'Fetching official data...',
    noData: 'No official data found',
    verified: '✅ Government Verified Data',
  },
  ar: {
    title: '🏛️ بيانات السلامة الرسمية',
    subtitle: 'من NHTSA — إدارة سلامة الطرق الأمريكية',
    load: 'تحميل التقارير الرسمية',
    complaints: 'شكاوى رسمية',
    recalls: 'استدعاءات السلامة',
    loading: 'جاري جلب البيانات الرسمية...',
    noData: 'لا توجد بيانات رسمية',
    verified: '✅ بيانات حكومية موثقة',
  },
  fr: {
    title: '🏛️ Données de Sécurité Officielles',
    subtitle: 'De la NHTSA — Administration nationale de la sécurité routière',
    load: 'Charger les rapports officiels',
    complaints: 'Plaintes officielles',
    recalls: 'Rappels de sécurité',
    loading: 'Récupération des données officielles...',
    noData: 'Aucune donnée officielle trouvée',
    verified: '✅ Données gouvernementales vérifiées',
  },
};

export default function NHTSASection({ code, locale }: Props) {
  const [data, setData] = useState<{
    complaints_count: number;
    complaints: { description: string; component: string }[];
    recalls_count: number;
    recalls: { component: string; summary: string; remedy: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nhtsa?code=${code}&locale=${locale}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1e3a5f',
      borderRadius: 12,
      padding: 24,
      marginTop: 16,
    }}>
      <h3 style={{ margin: '0 0 4px', color: '#e2e8f0', fontSize: 18 }}>
        {labels.title}
      </h3>
      <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 12 }}>
        {labels.subtitle}
      </p>

      {!data && !loading && (
        <button onClick={load} style={{
          background: 'linear-gradient(135deg, #059669, #0d9488)',
          border: 'none', borderRadius: 8,
          padding: '10px 20px', color: 'white',
          cursor: 'pointer', fontSize: 14, width: '100%',
        }}>
          {labels.load}
        </button>
      )}

      {loading && (
        <p style={{ color: '#60a5fa', textAlign: 'center', fontSize: 14 }}>
          ⏳ {labels.loading}
        </p>
      )}

      {data && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{
              background: '#0a0e1a', border: '1px solid #ef444440',
              borderRadius: 8, padding: '10px 16px', flex: 1,
            }}>
              <div style={{ color: '#ef4444', fontSize: 22, fontWeight: 700 }}>
                {data.complaints_count.toLocaleString()}
              </div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>{labels.complaints}</div>
            </div>
            <div style={{
              background: '#0a0e1a', border: '1px solid #f59e0b40',
              borderRadius: 8, padding: '10px 16px', flex: 1,
            }}>
              <div style={{ color: '#f59e0b', fontSize: 22, fontWeight: 700 }}>
                {data.recalls_count.toLocaleString()}
              </div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>{labels.recalls}</div>
            </div>
          </div>

          {data.recalls.slice(0, 2).map((r, i) => (
            <div key={i} style={{
              background: '#0a0e1a', border: '1px solid #f59e0b30',
              borderRadius: 8, padding: 12, marginBottom: 8,
            }}>
              <div style={{ color: '#f59e0b', fontSize: 12, marginBottom: 4 }}>
                🔔 {r.component}
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 13, margin: '0 0 4px' }}>
                {r.summary}
              </p>
              {r.remedy && (
                <p style={{ color: '#34d399', fontSize: 12, margin: 0 }}>
                  ✅ {r.remedy}
                </p>
              )}
            </div>
          ))}

          <p style={{ color: '#374151', fontSize: 11, textAlign: 'center', margin: '8px 0 0' }}>
            {labels.verified}
          </p>
        </div>
      )}
    </div>
  );
}
