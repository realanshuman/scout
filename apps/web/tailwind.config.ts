import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111614', // primary text
        mist: '#5f6b66', // secondary text
        paper: '#faf9f6', // page background
        signal: '#25d366', // WhatsApp green (buttons)
        moss: '#0e7a5f', // darker green for accents/links (AA on paper)
        bubble: '#d9fdd3', // outgoing WhatsApp bubble
        chatbg: '#efeae2', // WhatsApp chat background
      },
      boxShadow: {
        soft: '0 1px 2px rgb(17 22 20 / 0.04), 0 8px 24px rgb(17 22 20 / 0.06)',
        lift: '0 2px 4px rgb(17 22 20 / 0.06), 0 16px 40px rgb(17 22 20 / 0.10)',
      },
    },
  },
  plugins: [],
};

export default config;
