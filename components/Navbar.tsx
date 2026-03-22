import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

interface Props {
  locale: string;
}

export default function Navbar({ locale }: Props) {
  const t = useTranslations('nav');

  return (
    <nav className="border-b border-white/5 bg-navy-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-white">Diag<span className="text-electric-500">Zen</span></span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">{t('home')}</Link>
            <Link href={`/${locale}/symptoms`} className="hover:text-white transition-colors">{t('symptoms')}</Link>
            <Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('about')}</Link>
          </div>

          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
