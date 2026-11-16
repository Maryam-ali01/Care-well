/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#effafa',
          100: '#d5f0f1',
          200: '#aee0e2',
          400: '#3fb4b8',
          500: '#1a9ca0',
          600: '#0f8185',
          700: '#0d676b',
          800: '#0e5256',
          900: '#0c3d41',
        },
        ink: '#12303a',
        mist: '#f3f8fa',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18, 48, 58, 0.04), 0 8px 24px rgba(18, 48, 58, 0.06)',
      },
    },
  },
  plugins: [],
};
