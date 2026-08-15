// src/pages/predio/transferencia/TransferenciaAlcabalaPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Container,
  Breadcrumbs,
  Link,
  Chip,
  Stack,
  alpha,
  useTheme,
  GlobalStyles
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  NavigateNext as NavigateNextIcon,
  Domain as DomainIcon,
  SwapHoriz as SwapHorizIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import MainLayout from '../../../layout/MainLayout';
import RegistroTransferencia from '../../../components/predio/transferencia/RegistroTransferencia';
import ConsultaTransferencia from '../../../components/predio/transferencia/ConsultaTransferencia';
import type { TransferenciaPredioData } from '../../../services/transferenciaService';

const TransferenciaAlcabalaPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [transferenciaEditar, setTransferenciaEditar] = useState<TransferenciaPredioData | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      setTransferenciaEditar(null);
    }
    setActiveTab(newValue);
  };

  const handleEditarTransferencia = (transferencia: TransferenciaPredioData) => {
    setTransferenciaEditar(transferencia);
    setActiveTab(0);
  };

  // Breadcrumbs con iconos
  const breadcrumbItems = [
    { label: 'Modulo', path: '/', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { label: 'Predio', path: '/predio', icon: <DomainIcon sx={{ fontSize: 20 }} /> },
    { label: 'Transferencia', path: '/predio/transferencia', icon: <SwapHorizIcon sx={{ fontSize: 20 }} /> },
    { label: 'Alcabala', active: true, icon: <ReceiptIcon sx={{ fontSize: 20 }} /> }
  ];

  return (
    <MainLayout title="Impuesto de Alcabala - Transferencia">
      <Container maxWidth="xl">
        <Box sx={{ py: 2 }}>
          {/* Breadcrumb mejorado */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
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
                  <ReceiptIcon sx={{ fontSize: 32 }} />
                </Box>

                {/* Titulo y descripcion */}
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                    Impuesto de Alcabala - Transferencia
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                      Gestione el registro y consulta de transferencias de predios para el impuesto de alcabala
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
                    Transferencias
                  </Typography>
                </Paper>
              </Stack>
            </Stack>
          </Paper>

          {/* Tabs principales: Registro y Consulta */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem'
                }
              }}
            >
              <Tab
                label={transferenciaEditar ? 'Editar Transferencia' : 'Registro Transferencia'}
                icon={<ReceiptIcon />}
                iconPosition="start"
              />
              <Tab label="Consulta Transferencia" icon={<SearchIcon />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Panel de Registro Transferencia */}
          {activeTab === 0 && (
            <Box>
              <RegistroTransferencia
                transferenciaEditar={transferenciaEditar}
                onGuardado={() => setTransferenciaEditar(null)}
                onCancelarEdicion={() => setTransferenciaEditar(null)}
              />
            </Box>
          )}

          {/* Panel de Consulta Transferencia */}
          {activeTab === 1 && (
            <Box>
              <ConsultaTransferencia onEditar={handleEditarTransferencia} />
            </Box>
          )}
        </Box>
      </Container>

      {/* Estilos globales para animacion */}
      <GlobalStyles
        styles={{
          '@keyframes pulse': {
            '0%': {
              opacity: 1
            },
            '50%': {
              opacity: 0.5
            },
            '100%': {
              opacity: 1
            }
          }
        }}
      />
    </MainLayout>
  );
};

export default TransferenciaAlcabalaPage;
