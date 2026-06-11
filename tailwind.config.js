/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        darkCard: '#1e293b',
        lightBg: '#f8fafc',
        lightCard: '#ffffff',
        'purple-450': '#b55fe6',
        'purple-550': '#9d4edd',
        'purple-650': '#8424e4',
        'purple-655': '#7a1cb3',
        'blue-405': '#5390ea',
        'emerald-450': '#2ec490',
        'slate-205': '#eef2f6',
        'slate-250': '#dde3ea',
        'slate-355': '#8b9bb4',
        'slate-450': '#5c6b7f',
        'slate-550': '#3f4c5e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
