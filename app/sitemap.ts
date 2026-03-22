import { MetadataRoute } from 'next';
import { TOP_100_DTC_CODES, BRANDS } from '@/lib/dtc-codes';

const LOCALES = ['en', 'ar', 'fr'];
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diagzen.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Homepages
  for (const locale of LOCALES) {
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  }

  // DTC pages
  for (const locale of LOCALES) {
    for (const code of TOP_100_DTC_CODES) {
      routes.push({
        url: `${BASE_URL}/${locale}/dtc/${code}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  // Make pages
  for (const locale of LOCALES) {
    for (const brand of BRANDS) {
      routes.push({
        url: `${BASE_URL}/${locale}/makes/${brand}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // Symptoms
  for (const locale of LOCALES) {
    routes.push({
      url: `${BASE_URL}/${locale}/symptoms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return routes;
}
