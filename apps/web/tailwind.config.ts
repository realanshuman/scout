import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Inter for body/UI, an editorial high-contrast serif for display.
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        // Semantic colors driven by CSS variables so day/night both work
        // without touching component classes.
        paper: 'rgb(var(--paper) / <alpha-value>)', // page background
        card: 'rgb(var(--card) / <alpha-value>)', // raised surfaces
        ink: 'rgb(var(--ink) / <alpha-value>)', // primary text
        mist: 'rgb(var(--mist) / <alpha-value>)', // secondary text
        moss: 'rgb(var(--moss) / <alpha-value>)', // accent / links
        // Fixed in both modes:
        signal: '#22c55e', // green CTAs
        night: '#0c1512', // dark panels
        bubble: '#d9fdd3', // outgoing WhatsApp bubble
        chatbg: '#ece5dd', // WhatsApp chat background
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 10px 30px rgb(0 0 0 / 0.06)',
        lift: '0 2px 6px rgb(0 0 0 / 0.06), 0 24px 60px rgb(0 0 0 / 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
