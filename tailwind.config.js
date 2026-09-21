/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alterra: {
          dark: '#07090e',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(56, 189, 248, 0.2)',
          accent: '#00f0ff',
          neonPurple: '#a855f7',
          neonAmber: '#f59e0b',
          neonEmerald: '#10b981',
          crimson: '#ef4444'
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        sans: ['Rajdhani', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.35)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.35)'
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-scroll': 'gridScroll 20s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, filter: 'brightness(1)' },
          '50%': { opacity: 0.4, filter: 'brightness(1.5)' }
        },
        gridScroll: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' }
        }
      }
    },
  },
  plugins: [],
}
