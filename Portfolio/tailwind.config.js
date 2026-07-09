/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#08090d',
        surface: 'rgba(255, 255, 255, 0.04)',
        'surface-border': 'rgba(255, 255, 255, 0.1)',
        primary: '#f1f5f9',
        secondary: '#94a3b8',
        accent: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7e22ce',
        },
        indigo: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'massive': 'clamp(4rem, 15vw, 12rem)',
        'hero-tag': 'clamp(1rem, 3vw, 1.5rem)',
        'h1': 'clamp(2.5rem, 6vw, 5rem)',
        'h2': 'clamp(2rem, 5vw, 4rem)',
        'h3': 'clamp(1.5rem, 4vw, 2.5rem)',
        'body-lg': '1.125rem',
        'body-md': '1rem',
        'body-sm': '0.875rem',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.02em',
        'widest': '0.1em',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
