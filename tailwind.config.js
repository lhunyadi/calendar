/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#36C5F0',
        'brand-yellow': '#ECB22E',
        'brand-green': '#2EB67D',
        'brand-red': '#E01E5A',
        'brand-aubergine': '#7C3085',
        'brand-white': '#ffffff',
        'brand-black': '#000000',

        'brand-dark': '#1A1D21',
        'brand-medium': '#222529',

        'brand-light': '#fafafa',
        'brand-gray': '#e6e6e6',

      },
    },
  },
  plugins: [],
}
