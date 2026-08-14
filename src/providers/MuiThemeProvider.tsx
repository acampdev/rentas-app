// src/providers/MuiThemeProvider.tsx
import React, { FC, ReactNode, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, StyledEngineProvider } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../config/theme.config';

interface MuiThemeProviderWrapperProps {
  children: ReactNode;
}

export const MuiThemeProviderWrapper: FC<MuiThemeProviderWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  
  // Seleccionar el tema según el contexto
  const muiTheme = useMemo(() => {
    return theme === 'dark' ? darkTheme : lightTheme;
  }, [theme]);

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export default MuiThemeProviderWrapper;