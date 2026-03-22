import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

interface Props {
  locale: string;
}

export default function Footer({ locale }: Props) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');

  return (
    <footer className="border-t border-white/5 bg-navy-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href={`/${locale}`} className="hover:text-white">{tn('home')}</Link>
            <Link href={`/${locale}/about`} className="hover:text-white">{tn('about')}</Link>
            <Link href={`/${locale}/contact`} className="hover:text-white">{tn('contact')}</Link>
          </div>
          <LanguageSwitcher />
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">{t('copyright')}</p>
      </div>
    </footer>
  );
}
