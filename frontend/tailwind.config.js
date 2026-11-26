/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#0F172A', 900: '#0A192F', 850: '#0a162b', 800: '#0f203d', 700: '#17335d', 600: '#1f467e', 500: '#2b5f9e' },
        oxygen: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7' },
      },
      fontFamily: {
        serif: ['Montserrat', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
