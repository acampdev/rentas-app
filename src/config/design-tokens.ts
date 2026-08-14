// src/config/design-tokens.ts

/**
 * Design Tokens compartidos entre MUI y Tailwind.
 * Actúa como la única fuente de verdad para el sistema de diseño.
 */

export const designTokens = {
  colors: {
    // Colores de Marca
    primary: {
      main: '#10B981', // Verde esmeralda (Emerald 500)
      light: '#34D399', // Emerald 400
      dark: '#059669',  // Emerald 600
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6366F1', // Índigo (Indigo 500)
      light: '#818CF8', // Indigo 400
      dark: '#4F46E5',  // Indigo 600
      contrastText: '#FFFFFF',
    },
    // Colores de Estado
    success: {
      main: '#22C55E', // Green 500
      light: '#4ADE80',
      dark: '#16A34A',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444', // Red 500
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B', // Amber 500
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#3B82F6', // Blue 500
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    // Grises y Fondos
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  },
  spacing: {
    base: 6, // 6px (MUI spacing factor)
  },
  borderRadius: {
    base: 6, // 6px
  }
};
