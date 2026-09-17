/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#101826',
        slate: '#263447',
        cloud: '#f4f6f8',
        mist: '#dde3e9',
        steel: '#5d6b7d',
        cert: '#2859d8',
        signal: '#109b8b',
        amber: '#b97816',
        coral: '#c85e4d',
        violet: '#6956c7',
      },
      fontFamily: {
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 16px 42px rgba(16, 24, 38, 0.09)',
        glow: '0 22px 64px rgba(40, 89, 216, 0.18)',
      },
    },
  },
  plugins: [],
};
