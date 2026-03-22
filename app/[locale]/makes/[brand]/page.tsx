import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BRANDS, BRAND_CODES, DTC_STATIC_DATA, getSeverityColor } from '@/lib/dtc-codes';

interface Props {
  params: { locale: string; brand: string };
}

const LOCALES = ['en', 'ar', 'fr'] as const;

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) => BRANDS.map((brand) => ({ locale, brand })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand } = params;
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diagzen.com';

  const titles: Record<string, string> = {
    en: `Common ${brandName} Fault Codes | DiagZen`,
    ar: `أكثر أكواد الأعطال شيوعاً في سيارات ${brandName} | DiagZen`,
    fr: `Codes de panne courants ${brandName} | DiagZen`,
  };

  return {
    title: titles[locale] ?? titles.en,
    description: `Find the most common OBD-II fault codes for ${brandName} vehicles with AI-powered diagnosis.`,
    alternates: {
      canonical: `${siteUrl}/${locale}/makes/${brand}`,
      languages: {
        en: `${siteUrl}/en/makes/${brand}`,
        ar: `${siteUrl}/ar/makes/${brand}`,
        fr: `${siteUrl}/fr/makes/${brand}`,
      },
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { locale, brand } = params;
  if (!BRANDS.includes(brand as typeof BRANDS[number])) notFound();

  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'makes_page' });
  const codes = BRAND_CODES[brand] ?? [];
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  const nameKey = `name_${locale}` as `name_${'en' | 'ar' | 'fr'}`;

  return (
    <>
      <Navbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white capitalize">{brandName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-2">
          {t('title_prefix')} {brandName} {t('title_suffix')}
        </h1>
        <p className="text-gray-400 mb-10">
          {locale === 'ar'
            ? `أكثر رموز OBD-II شيوعاً في سيارات ${brandName}`
            : locale === 'fr'
            ? `Les codes OBD-II les plus courants pour ${brandName}`
            : `Most common OBD-II codes reported for ${brandName} vehicles`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {codes.map((code) => {
            const data = DTC_STATIC_DATA[code];
            return (
              <Link
                key={code}
                href={`/${locale}/dtc/${code}`}
                className="glass-card p-5 hover:border-electric-500/30 transition-all flex items-start gap-4 group"
              >
                <span className="font-mono text-electric-400 font-bold text-lg group-hover:text-electric-300 min-w-[80px]">
                  {code}
                </span>
                <div className="flex-1">
                  {data ? (
                    <>
                      <p className="text-white text-sm font-medium">{data[nameKey]}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(data.severity)}`}>
                        {data.severity}
                      </span>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">AI diagnosis available</p>
                  )}
                </div>
                <span className="text-gray-600 group-hover:text-electric-400 transition-colors">→</span>
              </Link>
            );
          })}
        </div>

        {/* All brands */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-white mb-4">Browse All Brands</h2>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <Link
                key={b}
                href={`/${locale}/makes/${b}`}
                className={`px-4 py-2 rounded-lg capitalize text-sm border transition-colors ${
                  b === brand
                    ? 'bg-electric-500/20 border-electric-500/40 text-electric-400'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {b}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
