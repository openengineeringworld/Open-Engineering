/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9333ea',
          dark: '#7e22ce',
          light: '#a855f7',
          soft: '#f3e8ff',
        },
        secondary: {
          DEFAULT: '#c084fc',
          dark: '#a855f7',
          light: '#e9d5ff',
        },
        accent: '#9333ea',
        surface: {
          DEFAULT: '#eef0f8',
          light: '#ffffff',
          dark: '#e2e4f0',
        },
        background: {
          DEFAULT: '#eef0f8',
          light: '#f5f6fe',
        },
        text: {
          DEFAULT: '#0f172a',
          muted: '#475569',
          dim: '#64748b',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        border: 'rgba(147, 51, 234, 0.12)',
      },
      boxShadow: {
        'neu-flat': '7px 7px 18px rgba(120, 80, 180, 0.16), -7px -7px 18px #ffffff',
        'neu-pressed': 'inset 5px 5px 10px rgba(120, 80, 180, 0.16), inset -5px -5px 10px #ffffff',
        'neu-convex': '6px 6px 16px rgba(120, 80, 180, 0.14), -6px -6px 16px #ffffff, inset 1px 1px 2px #ffffff',
        'neu-sm': '4px 4px 10px rgba(120, 80, 180, 0.12), -4px -4px 10px #ffffff',
        'glow': '0 0 25px rgba(147, 51, 234, 0.3)',
        'glow-lg': '0 0 50px rgba(147, 51, 234, 0.25), 0 0 100px rgba(147, 51, 234, 0.12)',
      },
    },
  },
  plugins: [],
};
