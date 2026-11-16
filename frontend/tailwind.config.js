/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F7F3EB',
          50: '#FBF9F5',
          100: '#F7F3EB',
          200: '#EFE7D7',
          300: '#E5DEC9',
        },
        cream: {
          DEFAULT: '#FCFBF8',
          surface: '#FCFBF8',
          hover: '#F8F5EE',
        },
        espresso: {
          DEFAULT: '#1E1916',
          900: '#1E1916',
          800: '#2C2521',
          700: '#3D342E',
        },
        taupe: {
          DEFAULT: '#6B6259',
          light: '#8E857C',
          muted: '#A59D94',
        },
        terracotta: {
          DEFAULT: '#9E331E',
          hover: '#842917',
          active: '#6E2012',
          light: '#F9EFEB',
          border: '#D8988B',
        },
        sage: {
          DEFAULT: '#3D5A3C',
          light: '#EBF2EB',
          border: '#C3D6C2',
          dark: '#2E442D',
        },
        borderWarm: '#E5DEC9',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(30, 25, 22, 0.05)',
        'card': '0 4px 12px -2px rgba(30, 25, 22, 0.06)',
        'modal': '0 20px 40px -10px rgba(30, 25, 22, 0.15)',
      },
      borderRadius: {
        'crisp': '6px',
      },
    },
  },
  plugins: [],
};
