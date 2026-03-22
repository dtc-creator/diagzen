import type { Metadata } from 'next';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DTCSearch from '@/components/DTCSearch';
import { MOST_SEARCHED_CODES, BRANDS, DTC_STATIC_DATA, getSeverityColor } from '@/lib/dtc-codes';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'DiagZen — AI-Powered OBD-II Diagnostic Tool',
    description: 'Free AI-powered OBD-II fault code lookup. Get instant diagnosis for any DTC code in English, Arabic, and French.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar`,
        fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr`,
      },
    },
    openGraph: {
      title: 'DiagZen — AI-Powered OBD-II Diagnostic',
      description: 'Free AI-powered OBD-II fault code lookup in 3 languages.',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      siteName: 'DiagZen',
      type: 'website',
    },
  };
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  const SEVERITY_LABELS: Record<string, { en: string; ar: string; fr: string }> = {
    'P0300': { en: 'Random Misfire', ar: 'إطلاق خاطئ', fr: 'Raté aléatoire' },
    'P0171': { en: 'System Too Lean B1', ar: 'مزيج فقير', fr: 'Mélange pauvre' },
    'P0128': { en: 'Low Coolant Temp', ar: 'درجة حرارة منخفضة', fr: 'Temp. faible' },
    'P0420': { en: 'Catalyst Efficiency', ar: 'كفاءة المحول', fr: 'Efficacité catalyseur' },
    'P0401': { en: 'EGR Flow Low', ar: 'تدفق EGR منخفض', fr: 'Débit EGR faible' },
    'P0087': { en: 'Fuel Pressure Low', ar: 'ضغط وقود منخفض', fr: 'Pression carburant faible' },
    'P0335': { en: 'Crankshaft Sensor', ar: 'حساس عمود المرفق', fr: 'Capteur vilebrequin' },
    'P0113': { en: 'IAT Sensor High', ar: 'حساس هواء مرتفع', fr: 'Capteur IAT élevé' },
    'P0011': { en: 'Camshaft Advanced', ar: 'عمود كامة متقدم', fr: 'Arbre à cames avancé' },
    'B0001': { en: 'Airbag Circuit', ar: 'دائرة الوسادة', fr: 'Circuit airbag' },
  };

  return (
    <>
      <Navbar locale={locale} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-24 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
              AI-Powered Diagnosis
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <DTCSearch />
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">{t('howItWorks.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🔌', title: t('howItWorks.step1_title'), desc: t('howItWorks.step1_desc'), num: '01' },
                { icon: '🤖', title: t('howItWorks.step2_title'), desc: t('howItWorks.step2_desc'), num: '02' },
                { icon: '✅', title: t('howItWorks.step3_title'), desc: t('howItWorks.step3_desc'), num: '03' },
              ].map((step) => (
                <div key={step.num} className="glass-card p-8 text-center relative overflow-hidden group">
                  <span className="absolute top-4 end-4 font-mono text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                    {step.num}
                  </span>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Most searched */}
        <section className="py-20 px-4 bg-navy-900/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-10">{t('mostSearched.title')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {MOST_SEARCHED_CODES.map((code) => {
                const data = DTC_STATIC_DATA[code];
                const severity = data?.severity ?? 'minor';
                const label = SEVERITY_LABELS[code];
                const name = locale === 'ar' ? label?.ar : locale === 'fr' ? label?.fr : label?.en;
                return (
                  <Link
                    key={code}
                    href={`/${locale}/dtc/${code}`}
                    className="glass-card p-4 hover:border-electric-500/30 transition-all group"
                  >
                    <span className="font-mono text-electric-400 font-bold text-sm group-hover:text-electric-300">{code}</span>
                    <p className="text-gray-400 text-xs mt-1 leading-snug">{name}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(severity)}`}>
                      {severity}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Browse by brand */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-10">{t('makes.title')}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {BRANDS.map((brand) => (
                <Link
                  key={brand}
                  href={`/${locale}/makes/${brand}`}
                  className="glass-card px-6 py-3 capitalize font-medium text-gray-300 hover:text-white hover:border-electric-500/30 transition-all"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why DiagZen */}
        <section className="py-20 px-4 bg-navy-900/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">{t('whyDiagzen.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🧠', title: t('whyDiagzen.ai_title'), desc: t('whyDiagzen.ai_desc') },
                { icon: '🌍', title: t('whyDiagzen.multilingual_title'), desc: t('whyDiagzen.multilingual_desc') },
                { icon: '🆓', title: t('whyDiagzen.free_title'), desc: t('whyDiagzen.free_desc') },
              ].map((feat) => (
                <div key={feat.title} className="glass-card p-8 text-center">
                  <div className="text-4xl mb-4">{feat.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-sm">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
