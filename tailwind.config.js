/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#111827',
        slate: '#233044',
        cloud: '#f7f9fc',
        mist: '#e8edf5',
        steel: '#617089',
        cert: '#2563eb',
        signal: '#14b8a6',
        amber: '#d9911f',
        coral: '#dc6b55',
        violet: '#7057d2',
      },
      fontFamily: {
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 24px 80px rgba(17, 24, 39, 0.12)',
        glow: '0 24px 90px rgba(37, 99, 235, 0.22)',
      },
    },
  },
  plugins: [],
};
