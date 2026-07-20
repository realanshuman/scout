import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Same editorial grotesk, used at heavier weights for headings.
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#111614', // primary text
        mist: '#5f6b66', // secondary text
        paper: '#f7f6f1', // page background
        card: '#ffffff',
        signal: '#22c55e', // WhatsApp-ish green (buttons)
        moss: '#0e7a5f', // accent / links (AA on paper)
        night: '#0c1512', // dark sections
        bubble: '#d9fdd3', // outgoing WhatsApp bubble
        chatbg: '#ece5dd', // WhatsApp chat background
      },
      boxShadow: {
        soft: '0 1px 2px rgb(17 22 20 / 0.04), 0 10px 30px rgb(17 22 20 / 0.06)',
        lift: '0 2px 6px rgb(17 22 20 / 0.06), 0 24px 60px rgb(17 22 20 / 0.12)',
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
