import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DiagnosisResult from '@/components/DiagnosisResult';
import {
  DTC_STATIC_DATA,
  isValidDTC,
  getSeverityColor,
} from '@/lib/dtc-codes';

interface Props {
  params: { locale: string; code: string };
}

interface JsonDTCData {
  code: string;
  system: string;
  category: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
  severity: string;
  common_causes_en: string[];
  common_causes_ar: string[];
  common_causes_fr: string[];
}

const LOCALES = ['en', 'ar', 'fr'] as const;

export async function generateStaticParams() {
  const dtcDir = path.join(process.cwd(), 'data/dtc');
  const files = fs.readdirSync(dtcDir);
  const codes = files.map((f) => f.replace('.json', ''));
  return LOCALES.flatMap((locale) =>
    codes.map((code) => ({ locale, code }))
  );
}

export const revalidate = 2592000; // 30 days

function getStaticDTCData(code: string): JsonDTCData | null {
  try {
    const filePath = path.join(process.cwd(), 'data/dtc', `${code}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch {}
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, code } = params;
  const upperCode = code.toUpperCase();
  const richData = DTC_STATIC_DATA[upperCode];
  const jsonData = richData ? null : getStaticDTCData(upperCode);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diagzen.com';

  const nameEn = richData?.name_en ?? jsonData?.system ?? '';
  const nameAr = richData?.name_ar ?? jsonData?.system ?? '';
  const nameFr = richData?.name_fr ?? jsonData?.system ?? '';

  const titles: Record<string, string> = {
    en: `${upperCode} Code${nameEn ? ` — ${nameEn}` : ''} | DiagZen`,
    ar: `كود ${upperCode}${nameAr ? ` — ${nameAr}` : ''} | DiagZen`,
    fr: `Code ${upperCode}${nameFr ? ` — ${nameFr}` : ''} | DiagZen`,
  };

  const descEn =
    richData?.description_en ??
    jsonData?.description_en ??
    `Full AI diagnosis for OBD-II code ${upperCode}. Get causes, symptoms, repair cost, and step-by-step fix guide.`;
  const descAr =
    richData?.description_ar ??
    jsonData?.description_ar ??
    `تشخيص شامل بالذكاء الاصطناعي لكود OBD-II ${upperCode}. الأسباب والأعراض وتكلفة الإصلاح.`;
  const descFr =
    richData?.description_fr ??
    jsonData?.description_fr ??
    `Diagnostic IA complet pour le code OBD-II ${upperCode}. Causes, symptômes, coût de réparation.`;

  const descs: Record<string, string> = { en: descEn, ar: descAr, fr: descFr };

  const causesText = richData?.causes_en.join(', ') ?? jsonData?.common_causes_en.join(', ') ?? '';

  const faqSchema = (richData || jsonData)
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What does ${upperCode} mean?`,
            acceptedAnswer: { '@type': 'Answer', text: descEn },
          },
          {
            '@type': 'Question',
            name: `What causes ${upperCode}?`,
            acceptedAnswer: { '@type': 'Answer', text: causesText },
          },
        ],
      }
    : null;

  return {
    title: titles[locale] ?? titles.en,
    description: descs[locale] ?? descs.en,
    alternates: {
      canonical: `${siteUrl}/${locale}/dtc/${upperCode}`,
      languages: {
        en: `${siteUrl}/en/dtc/${upperCode}`,
        ar: `${siteUrl}/ar/dtc/${upperCode}`,
        fr: `${siteUrl}/fr/dtc/${upperCode}`,
      },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descs[locale] ?? descs.en,
      url: `${siteUrl}/${locale}/dtc/${upperCode}`,
      siteName: 'DiagZen',
      type: 'website',
    },
    other: faqSchema
      ? { 'application/ld+json': JSON.stringify(faqSchema) }
      : {},
  };
}

export default async function DTCPage({ params }: Props) {
  const { locale, code } = params;
  const upperCode = code.toUpperCase();

  if (!isValidDTC(upperCode)) notFound();

  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dtc' });

  const richData = DTC_STATIC_DATA[upperCode];
  const jsonData = richData ? null : getStaticDTCData(upperCode);

  const nameKey = `name_${locale}` as `name_${'en' | 'ar' | 'fr'}`;
  const descKey = `description_${locale}` as `description_${'en' | 'ar' | 'fr'}`;
  const causesKey = `causes_${locale}` as `causes_${'en' | 'ar' | 'fr'}`;
  const jsonDescKey = `description_${locale}` as `description_${'en' | 'ar' | 'fr'}`;
  const jsonCausesKey = `common_causes_${locale}` as `common_causes_${'en' | 'ar' | 'fr'}`;

  const severity = richData?.severity ?? jsonData?.severity ?? 'moderate';
  const system = jsonData?.system ?? jsonData?.category ?? '';

  const faqSchema = (richData || jsonData)
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What does ${upperCode} mean?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: richData?.description_en ?? jsonData?.description_en ?? '',
            },
          },
          {
            '@type': 'Question',
            name: `What causes ${upperCode}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: richData
                ? richData.causes_en.join(', ')
                : jsonData?.common_causes_en.join(', ') ?? '',
            },
          },
        ],
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Navbar locale={locale} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href={`/${locale}`} className="hover:text-white">DTC Codes</Link>
          <span>/</span>
          <span className="text-electric-400 font-mono">{upperCode}</span>
        </nav>

        {/* Static section */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-wrap items-start gap-4 mb-6">
            <span className="font-mono text-3xl font-bold text-electric-400">{upperCode}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border self-center ${getSeverityColor(severity)}`}>
              {t(`severity_${severity}`)}
            </span>
            {system && (
              <span className="px-3 py-1 rounded-full text-sm border border-white/10 text-gray-400 self-center">
                {system}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('title_prefix')} {upperCode}
            {richData && ` — ${richData[nameKey]}`}
            {!richData && jsonData && ` — ${jsonData.system}`}
          </h1>

          {richData ? (
            <>
              <p className="text-gray-300 leading-relaxed mb-6">{richData[descKey]}</p>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">{t('common_causes')}</h2>
                <ul className="space-y-2">
                  {richData[causesKey].map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-electric-400 mt-1">▸</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">{t('related_codes')}</h2>
                <div className="flex flex-wrap gap-2">
                  {richData.related.map((rel) => (
                    <Link
                      key={rel}
                      href={`/${locale}/dtc/${rel}`}
                      className="font-mono text-sm px-3 py-1 rounded bg-navy-900/50 border border-white/10 text-electric-400 hover:border-electric-500/50 transition-colors"
                    >
                      {rel}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : jsonData ? (
            <>
              <p className="text-gray-300 leading-relaxed mb-6">{jsonData[jsonDescKey]}</p>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">{t('common_causes')}</h2>
                <ul className="space-y-2">
                  {jsonData[jsonCausesKey].map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-electric-400 mt-1">▸</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-400">
              {locale === 'ar'
                ? `الكود ${upperCode} لم يتم العثور عليه في قاعدة بياناتنا. استخدم الذكاء الاصطناعي للحصول على تشخيص مفصل.`
                : locale === 'fr'
                ? `Le code ${upperCode} n&apos;est pas dans notre base de données statique. Utilisez l&apos;IA pour un diagnostic complet.`
                : `Code ${upperCode} is not in our static database. Use AI diagnosis below for a full analysis.`}
            </p>
          )}
        </div>

        {/* Dynamic AI section */}
        <DiagnosisResult code={upperCode} />
      </main>

      <Footer locale={locale} />
    </>
  );
}
