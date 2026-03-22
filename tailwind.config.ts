import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A0E1A',
          900: '#0D1220',
          800: '#111827',
          700: '#1a2235',
        },
        electric: {
          500: '#3B82F6',
          600: '#2563EB',
          400: '#60A5FA',
        },
      },
      fontFamily: {
        mono: ['var(--font-dm-mono)', 'monospace'],
        cairo: ['var(--font-cairo)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
