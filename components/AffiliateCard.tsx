'use client';

import { useTranslations } from 'next-intl';

interface Props {
  nameEn: string;
  nameAr: string;
  nameFr: string;
  searchQuery: string;
  locale: 'en' | 'ar' | 'fr';
}

const AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG ?? 'diagzen-20';

export default function AffiliateCard({ nameEn, nameAr, nameFr, searchQuery, locale }: Props) {
  const t = useTranslations('dtc');
  const name = locale === 'ar' ? nameAr : locale === 'fr' ? nameFr : nameEn;
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&tag=${AFFILIATE_TAG}`;

  return (
    <div className="bg-navy-900/50 border border-white/10 rounded-lg p-4 flex flex-col gap-3">
      {/* Part image placeholder */}
      <div className="w-full h-24 bg-navy-800 rounded-lg flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p className="text-white text-sm font-medium leading-snug">{name}</p>
      <a
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-auto block text-center text-sm bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {t('amazon_button')}
      </a>
    </div>
  );
}
