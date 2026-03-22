import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { BRANDS } from '@/lib/dtc-codes';

const LOCALES = ['en', 'ar', 'fr'];
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diagzen.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const dtcDir = path.join(process.cwd(), 'data/dtc');
  const codes = fs.readdirSync(dtcDir).map((f) => f.replace('.json', ''));

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

  // All DTC pages (6,000 codes × 3 locales = 18,000)
  for (const code of codes) {
    for (const locale of LOCALES) {
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
