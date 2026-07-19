import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0f14',
        mist: '#8b97a5',
        signal: '#25d366', // WhatsApp green
      },
    },
  },
  plugins: [],
};

export default config;
