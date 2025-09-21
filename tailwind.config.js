/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#f1f5f9',
        'brand-surface': '#ffffff',
        'brand-primary': '#6366f1',
        'brand-secondary': '#a78bfa',
        'brand-text-primary': '#1e293b',
        'brand-text-secondary': '#475569',
        'brand-accent': '#f43f5e',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideInUp: 'slideInUp 0.5s ease-out',
      }
    }
  },
  plugins: [],
}
