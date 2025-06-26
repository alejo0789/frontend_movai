/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',       
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',         
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',  
    './src/**/*.{js,ts,jsx,tsx,mdx}',             
    './app/**/*.{js,ts,jsx,tsx,mdx}',             
    './pages/**/*.{js,ts,jsx,tsx,mdx}',           
    './components/**/*.{js,ts,jsx,tsx,mdx}',      
  ],
  theme: {
    extend: {
      colors: {
        // Aquí referenciamos las variables CSS definidas en globals.css
        primary: {
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary-DEFAULT)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        gray: { // Importante para que puedas usar clases como 'bg-gray-50' con tus tonos
          '50': 'var(--color-gray-50)',
          '100': 'var(--color-gray-100)',
          '200': 'var(--color-gray-200)',
          '300': 'var(--color-gray-300)',
          '400': 'var(--color-gray-400)',
          '500': 'var(--color-gray-500)',
          '600': 'var(--color-gray-600)',
          '700': 'var(--color-gray-700)',
          '800': 'var(--color-gray-800)',
          '900': 'var(--color-gray-900)',
        },
      },
      fontFamily: {
        // Ejemplo de cómo usar una fuente personalizada con next/font/google
        // 'sans': ['var(--font-inter)'], 
      },
    },
  },
  plugins: [],
}