/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void:  { DEFAULT: '#080c10', 2: '#0d1117', 3: '#141b24' },
        blue:  { DEFAULT: '#2563eb', lt: '#3b82f6', dim: '#1d4ed8', glow: '#60a5fa' },
        green: { DEFAULT: '#10b981', lt: '#34d399', dim: '#059669' },
        red:   { DEFAULT: '#ef4444', lt: '#f87171' },
        slate: { DEFAULT: '#94a3b8', dim: '#64748b', bright: '#cbd5e1' },
        gold:  { DEFAULT: '#f59e0b', lt: '#fbbf24' },
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
