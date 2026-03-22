import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 300,
  experimental: {
    workerThreads: true,
    cpus: 4,
  },
  images: {
    domains: ['m.media-amazon.com', 'images-na.ssl-images-amazon.com'],
  },
};

export default withNextIntl(nextConfig);
