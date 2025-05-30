// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // …
  ],
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
      colors: {
        base: {
          900: '#0f0f0f',
          800: '#1a1a1a',
        },
        accent: {
          600: '#c20e0e',
        },
        light: {
          100: '#f5f5f5',
        },
      },
    },
  },
  plugins: [],
}
