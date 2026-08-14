// src/pages/predio/transferencia/ReporteAlcabalaPage.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Breadcrumbs,
  Link,
  Chip,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Domain as DomainIcon,
  SwapHoriz as SwapHorizIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import MainLayout from '../../../layout/MainLayout';
import ReporteAlcabala from '../../../components/predio/transferencia/ReporteAlcabala';

const ReporteAlcabalaPage: React.FC = () => {
  const theme = useTheme();

  // Breadcrumbs con iconos
  const breadcrumbItems = [
    { label: 'Modulo', path: '/', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { label: 'Predio', path: '/predio', icon: <DomainIcon sx={{ fontSize: 20 }} /> },
    { label: 'Transferencia', path: '/predio/transferencia', icon: <SwapHorizIcon sx={{ fontSize: 20 }} /> },
    { label: 'Reporte Alcabala', active: true, icon: <AssessmentIcon sx={{ fontSize: 20 }} /> }
  ];

  return (
    <MainLayout title="Reporte de Alcabala">
      <Container maxWidth="xl">
        <Box sx={{ py: 2 }}>
          {/* Breadcrumb mejorado */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                if (isLast || item.active) {
                  return (
                    <Chip
                      key={item.label}
                      label={item.label}
                      size="small"
                      icon={item.icon}
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          fontSize: 18
                        }
                      }}
                    />
                  );
                }

                return (
                  <Link
                    key={item.label}
                    component={RouterLink}
                    to={item.path || '/'}
                    underline="hover"
                    color="inherit"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>

          {/* Header mejorado con Material UI */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg,
                  ${theme.palette.primary.main} 0%,
                  ${theme.palette.secondary.main} 50%,
                  ${theme.palette.primary.dark} 100%)`
              }
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={3}>
                {/* Icono principal */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                    color: 'white'
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 32 }} />
                </Box>

                {/* Titulo y descripcion */}
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{ mb: 1 }}
                  >
                    Reporte de Alcabala
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                      Genere y visualice reportes de alcabala por predio y rango de fechas
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Informacion adicional */}
              <Stack direction="row" spacing={2}>
                <Paper
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Estado
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        animation: 'pulse 2s infinite'
                      }}
                    />
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      Activo
                    </Typography>
                  </Stack>
                </Paper>

                <Paper
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Modulo
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="info.main">
                    Reportes
                  </Typography>
                </Paper>
              </Stack>
            </Stack>
          </Paper>

          {/* Componente de Reporte Alcabala */}
          <ReporteAlcabala />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ReporteAlcabalaPage;
