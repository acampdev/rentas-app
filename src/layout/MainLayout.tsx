// src/layout/MainLayout.tsx 
import React, { FC, ReactNode, memo, useEffect } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AppSidebar from './AppSidebar';
import Header from './Header';
import { useAuthContext } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';


interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disablePadding?: boolean;
  containerProps?: any;
}

// Styled component para la pantalla de carga
const _LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  zIndex: theme.zIndex.modal + 1,
}));

const MainLayout: FC<MainLayoutProps> = memo(({ 
  children, 
  title = 'Sistema de Gestión Tributaria',
  maxWidth = 'xl',
  disablePadding: _disablePadding = false,
  containerProps: _containerProps = {}
}) => {
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading, isAuthenticated } = useAuthContext();
  const { isExpanded } = useSidebar();
  
  // Calcular el ancho del drawer
  const drawerWidth = isExpanded ? 280 : 72;

  // Para depuración
  useEffect(() => {
    console.log('MainLayout rendered', { loading, isAuthenticated });
  }, [loading, isAuthenticated]);

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: theme.palette.grey[50]
    }}>
      {/* Barra lateral */}
      <AppSidebar />

      {/* Header - ajustado para dejar espacio al sidebar */}
      <Header title={title} />

      {/* Contenido principal - ajustado para el sidebar */}
      <Box
        component="main"
        sx={{
          position: 'fixed',
          top: 64, // Altura del header actualizada
          left: drawerWidth, // Dejar espacio para el sidebar
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.default} 100%)`,
          overflow: 'auto',
          transition: theme.transitions.create(['left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          padding: theme.spacing(3),
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.grey[200],
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
            borderRadius: 4,
            '&:hover': {
              backgroundColor: theme.palette.grey[500],
            },
          },
        }}
      >
        <Box sx={{ 
          maxWidth: maxWidth || '100%',
          margin: '0 auto',
          animation: 'fadeIn 0.3s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
});

// Nombre para DevTools
MainLayout.displayName = 'MainLayout';

export default MainLayout;