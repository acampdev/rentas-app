// src/config/theme.config.ts - Configuración de tema para Material-UI
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { designTokens } from './design-tokens';

// Colores sincronizados con designTokens
const customColors = {
  primary: designTokens.colors.primary,
  secondary: designTokens.colors.secondary,
  success: designTokens.colors.success,
  error: designTokens.colors.error,
  warning: designTokens.colors.warning,
  info: designTokens.colors.info,
};

// Configuración base compartida - TAMAÑOS REDUCIDOS Y MÁS COMPACTOS
const baseThemeConfig: ThemeOptions = {
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Reducir todos los tamaños de fuente
    fontSize: 12, // Base font size reducida
    h1: {
      fontSize: '1.75rem', // De 2.5rem a 1.75rem
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem', // De 2rem a 1.5rem
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem', // De 1.75rem a 1.25rem
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.125rem', // De 1.5rem a 1.125rem
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem', // De 1.25rem a 1rem
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem', // De 1.125rem a 0.875rem
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.813rem', // De 1rem a 0.813rem (13px)
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem', // De 0.875rem a 0.75rem (12px)
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.688rem', // 11px
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.813rem', // 13px
    },
  },
  spacing: 6, // Reducir el espaciado base de 8px a 6px
  shape: {
    borderRadius: 6, // Reducir border radius
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small', // Tamaño pequeño por defecto
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '4px 12px', // Reducir padding
          fontSize: '0.75rem', // Reducir tamaño de fuente
          fontWeight: 500,
          boxShadow: 'none',
          minHeight: '32px', // Altura mínima más pequeña
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeSmall: {
          padding: '3px 10px',
          fontSize: '0.688rem',
          minHeight: '28px',
        },
        sizeMedium: {
          padding: '5px 14px',
          fontSize: '0.75rem',
          minHeight: '32px',
        },
        sizeLarge: {
          padding: '6px 16px',
          fontSize: '0.813rem',
          minHeight: '36px',
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        },
        elevation3: {
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          // Ajustes globales para Grid
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        margin: 'dense',
      },
      styleOverrides: {
        root: {
          marginTop: '4px',
          marginBottom: '4px',
          '& .MuiOutlinedInput-root': {
            fontSize: '0.75rem',
            '&:hover fieldset': {
              borderColor: customColors.primary.main,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            transform: 'translate(14px, 10px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
              fontSize: '0.75rem',
            },
          },
          '& .MuiInputBase-input': {
            padding: '8px 12px',
            fontSize: '0.75rem',
            height: 'auto',
            minHeight: '20px',
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense', // Márgenes más densos por defecto
        size: 'small',
      },
      styleOverrides: {
        root: {
          marginBottom: '8px', // Espaciado consistente entre campos
          marginTop: '8px',
        },
        marginDense: {
          marginTop: '4px',
          marginBottom: '4px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
        input: {
          fontSize: '0.75rem',
          '&::placeholder': {
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        select: {
          padding: '6px 10px',
          fontSize: '0.75rem',
          minHeight: '20px',
        },
        icon: {
          fontSize: '1.125rem', // Icono más pequeño
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          minHeight: '32px',
          padding: '4px 12px',
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        input: {
          fontSize: '0.75rem',
          padding: '2px 4px !important',
        },
        option: {
          fontSize: '0.75rem',
          padding: '4px 8px',
          minHeight: '32px',
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.688rem',
          height: '24px',
        },
        sizeSmall: {
          fontSize: '0.625rem',
          height: '20px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.688rem',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '4px 8px',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          padding: '6px 12px',
        },
        sizeSmall: {
          padding: '4px 8px',
          fontSize: '0.688rem',
        },
        head: {
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '8px 12px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.125rem',
          padding: '12px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '12px',
          '&:last-child': {
            paddingBottom: '12px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
};

// Tema claro
export const lightTheme = createTheme({
  ...baseThemeConfig,
  palette: {
    mode: 'light',
    ...customColors,
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: '#E5E7EB',
    action: {
      active: '#6B7280',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: '#9CA3AF',
      disabledBackground: '#F3F4F6',
    },
  },
});

// Tema oscuro
export const darkTheme = createTheme({
  ...baseThemeConfig,
  palette: {
    mode: 'dark',
    ...customColors,
    primary: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
      contrastText: '#000000',
    },
    secondary: {
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
      contrastText: '#000000',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      disabled: '#6B7280',
    },
    divider: '#334155',
    action: {
      active: '#D1D5DB',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: '#6B7280',
      disabledBackground: '#1E293B',
    },
  },
  components: {
    ...baseThemeConfig.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1E293B',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E293B',
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Helper para obtener el tema según el modo
export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};