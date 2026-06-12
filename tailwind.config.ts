import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#f5ece7',
        pearl: '#fdf8f4',
        ink: '#2d1f1b',
        gold: '#c4a46b',
        rose: '#d8b0a2',
        sand: '#ddc6b6',
      },
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        luxe: '0 24px 80px rgba(96, 60, 35, 0.14)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top, rgba(216, 176, 162, 0.38), transparent 34%), linear-gradient(135deg, #fdf8f4 0%, #f5ece7 52%, #f7f0ea 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
