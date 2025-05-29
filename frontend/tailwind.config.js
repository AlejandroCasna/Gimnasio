// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',      // padding horizontal por defecto
      screens: {
        lg: '1200px',       // a partir de lg (1024px) ancho máximo 1200px
      },
    }, 
    extend: {
      
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
