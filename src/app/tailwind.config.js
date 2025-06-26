/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',       // Si usas Pages Router dentro de src/
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',         // Si usas App Router dentro de src/
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',  // Tus componentes dentro de src/components/
    './src/**/*.{js,ts,jsx,tsx,mdx}',             // Un comodín general para cualquier otra cosa en src/
    './app/**/*.{js,ts,jsx,tsx,mdx}',             // Si usas App Router en la raíz del proyecto
    './pages/**/*.{js,ts,jsx,tsx,mdx}',           // Si usas Pages Router en la raíz del proyecto
    './components/**/*.{js,ts,jsx,tsx,mdx}',      // Si usas componentes en la raíz del proyecto
  ],
  theme: {
    extend: {
      // Dejamos esta sección vacía o con tus custom colors si quieres que los pruebe con los custom
      // Pero si quieres ver si CUALQUIER clase de Tailwind funciona, mantenla vacía por ahora.
      // Si los colores de globals.css ya están funcionando, puedes dejarlos en globals.css
      // y probar con bg-red-500 como en la prueba anterior.
    },
  },
  plugins: [],
}