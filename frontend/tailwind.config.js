/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F2E8D2',
          300: '#E7D5B0',
          400: '#D5BA7F',
          500: '#C5A059',
          600: '#A9823E',
          700: '#86642E',
          800: '#644823',
          900: '#432F19',
        },
        slate: {
          925: '#0B0F19',
          950: '#070A12',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(197, 160, 89, 0.12), 0 0 15px rgba(0, 0, 0, 0.3)',
        'luxury-hover': '0 25px 50px -12px rgba(197, 160, 89, 0.22), 0 0 20px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
