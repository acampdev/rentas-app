/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  important: '#root', // Prioridad sobre estilos base pero permite que MUI gane si es necesario
  theme: {
    extend: {
      colors: {
        // Mapeo de tokens a clases de Tailwind
        primary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      spacing: {
        // Sincronizado con el factor 6 de MUI (1 = 6px, 2 = 12px...)
        '1.5': '6px',
        '3': '12px',
        '4.5': '18px',
        '6': '24px',
      },
      borderRadius: {
        'custom': '6px',
      }
    },
  },
  plugins: [],
}
