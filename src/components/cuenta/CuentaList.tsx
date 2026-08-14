// src/components/cuenta/CuentaList.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  useTheme,
  Divider,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssessmentIcon from '@mui/icons-material/Assessment';
const SelectorContribuyente = React.lazy(() => import('../modal/SelectorContribuyente'));
import { useCuentaCorriente } from '../../hooks/useCuentaCorriente';
import { formatearNumero, useCuentaDetalle } from './useCuentaDetalle';

// Interfaces locales para el componente
interface CuentaListProps {
  contribuyenteId?: number;
  predioId?: number;
  loading?: boolean;
  error?: string;
}

const CuentaList: React.FC<CuentaListProps> = ({
  contribuyenteId,
  predioId,
  loading = false,
  error
}) => {
  const theme = useTheme();
  // Hook para gestionar cuenta corriente
  const {
    estadoCuentaAnual,
    loadingEstadoCuenta,
    errorEstadoCuenta,
    estadoCuentaDetalle,
    loadingDetalle,
    errorDetalle,
    seleccionarContribuyente,
    verDetalleAnio,
    limpiarTodo
  } = useCuentaCorriente();

  // Estados locales
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [deudaSeleccionada] = useState<string>('');

  // Estados para búsqueda
  const [contribuyenteSeleccionado, setContribuyenteSeleccionado] = useState<any>(null);
  const [codigoContribuyente, setCodigoContribuyente] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Estado para controlar tributos expandidos
  const [tributosExpandidos, setTributosExpandidos] = useState<Set<string>>(new Set());

  // Función para manejar clic en fila de estado de cuenta
  const handleFilaClick = async (anio: number) => {
    setAnioSeleccionado(anio);
    // Cargar detalle del año seleccionado usando el hook
    verDetalleAnio(anio);
    console.log(`Año seleccionado: ${anio}`);
  };

  // Función para buscar cuenta corriente
  const handleBuscarCuenta = async () => {
    if (!codigoContribuyente) {
      alert('Por favor seleccione un contribuyente');
      return;
    }
    // Establecer el contribuyente en el hook
    seleccionarContribuyente(codigoContribuyente);
    setBusquedaRealizada(true);
    // Limpiar año seleccionado
    setAnioSeleccionado(null);
    console.log('Buscando cuenta corriente para contribuyente código:', codigoContribuyente);
  };

  // Función para abrir selector de contribuyente
  const handleSelectorContribuyente = () => {
    setIsModalOpen(true);
  };

  // Función para manejar la selección del contribuyente
  const handleSelectContribuyente = (contribuyente: any) => {
    setContribuyenteSeleccionado(contribuyente);
    setCodigoContribuyente(contribuyente.codigo.toString());
    setIsModalOpen(false);
    // Limpiar datos anteriores
    limpiarTodo();
    setBusquedaRealizada(false);
    setAnioSeleccionado(null);
  };

  // Función para toggle expansión de tributo
  const handleToggleTributo = (tributo: string) => {
    setTributosExpandidos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tributo)) {
        newSet.delete(tributo);
      } else {
        newSet.add(tributo);
      }
      return newSet;
    });
  };

  const { tributosUnicos } = useCuentaDetalle(estadoCuentaDetalle, anioSeleccionado);

  if (loading || loadingEstadoCuenta) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || errorEstadoCuenta) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || errorEstadoCuenta}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Modal de Selección de Contribuyente */}
      <SelectorContribuyente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectContribuyente={handleSelectContribuyente}
        selectedId={contribuyenteSeleccionado?.codigo}
      />

      {/* Sección de Búsqueda */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontSize: '1.1rem'
              }}
            >
              <PersonSearchIcon color="primary" sx={{ fontSize: '1.5rem' }} /> Búsqueda de Cuenta Corriente
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'center',
              p: 2.5,
              bgcolor: alpha(theme.palette.primary.main, 0.01),
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.05)
            }}
          >
            {/* Seleccionar Contribuyente*/}
            <Box sx={{ flex: '1 1 280px', minWidth: '280px' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PersonSearchIcon sx={{ fontSize: '1.3rem' }} />}
                onClick={handleSelectorContribuyente}
                sx={{
                  height: 56,
                  borderRadius: 2.5,
                  borderWidth: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  background: alpha(theme.palette.primary.main, 0.03),
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderWidth: 1.5,
                    borderColor: 'primary.dark',
                    background: alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                  }
                }}
              >
                Seleccionar Contribuyente
              </Button>
            </Box>

            {/* Información del Contribuyente Seleccionado */}
            <Box
              sx={{
                flex: '1 1 350px',
                minWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              {contribuyenteSeleccionado ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: alpha(theme.palette.success.main, 0.04),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.03)}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'success.main',
                      flexShrink: 0
                    }}
                  >
                    <PersonSearchIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'success.main',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block',
                        mb: 0.2
                      }}
                    >
                      Contribuyente Seleccionado
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Código: ${codigoContribuyente}`}
                        size="small"
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          height: 22,
                          borderRadius: '6px'
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{
                          fontWeight: 700,
                          color: 'success.dark',
                          fontSize: '0.9rem'
                        }}
                      >
                        {contribuyenteSeleccionado.contribuyente || 'Sin nombre'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    background: alpha(theme.palette.action.disabledBackground, 0.3),
                    border: `1px dashed ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 62
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5
                    }}
                  >
                    <PersonSearchIcon sx={{ opacity: 0.4 }} /> Seleccione un contribuyente para iniciar consulta
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Botón de Buscar */}
            <Box sx={{ flex: '0 1 180px', minWidth: '180px' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={
                  loadingEstadoCuenta ? (
                    <CircularProgress size={20} sx={{ color: 'inherit' }} />
                  ) : (
                    <SearchIcon sx={{ fontSize: '1.3rem' }} />
                  )
                }
                onClick={handleBuscarCuenta}
                disabled={!codigoContribuyente || loadingEstadoCuenta}
                sx={{
                  height: 56,
                  borderRadius: 2.5,
                  backgroundColor: '#10b981 !important',
                  color: 'white !important',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#059669 !important',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: alpha(theme.palette.action.disabledBackground, 0.12) + ' !important',
                    color: theme.palette.text.disabled + ' !important',
                    border: '1px solid ' + theme.palette.divider,
                    boxShadow: 'none !important'
                  }
                }}
              >
                {loadingEstadoCuenta ? 'Buscando...' : 'Buscar'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabla de Estado de Cuenta Anual */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.success.main} 100%)`,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main'
                }}
              >
                <AssessmentIcon sx={{ fontSize: '1.2rem' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', fontSize: '1.05rem' }}>
                Resumen de Estado de Cuenta Anual
              </Typography>
            </Box>
            {estadoCuentaAnual.length > 0 && (
              <Chip
                label={`${estadoCuentaAnual.length} Años Registrados`}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontWeight: 700, borderRadius: '8px' }}
              />
            )}
          </Box>
          <Divider sx={{ mb: 2.5 }} />

          {loadingEstadoCuenta && busquedaRealizada ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, py: 4 }}>
              <CircularProgress size={28} />
              <Typography color="text.secondary">
                Consultando el estado de cuenta del contribuyente {codigoContribuyente}...
              </Typography>
            </Box>
          ) : estadoCuentaAnual.length === 0 ? (
            <Alert
              severity={busquedaRealizada ? 'warning' : 'info'}
              sx={{
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.info.main, 0.02),
                border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
                color: 'info.dark',
                '& .MuiAlert-icon': {
                  color: 'info.main'
                }
              }}
            >
              {busquedaRealizada
                ? `La consulta se realizó correctamente, pero el contribuyente ${codigoContribuyente} no tiene registros de estado de cuenta.`
                : 'Seleccione un contribuyente y haga clic en Buscar para visualizar el estado de cuenta anual.'}
            </Alert>
          ) : (
            <>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  overflow: 'hidden'
                }}
              >
                <Table size="small" sx={{ minWidth: 750 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          color: 'primary.dark',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          borderRight: '1px solid rgba(0,0,0,0.06)',
                          py: 1.5
                        }}
                      >
                        Año
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          bgcolor: alpha(theme.palette.info.main, 0.04),
                          color: 'info.dark',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          borderRight: '1px solid rgba(0,0,0,0.06)',
                          py: 1.5
                        }}
                      >
                        Total Predial
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.04),
                          color: 'success.dark',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          borderRight: '1px solid rgba(0,0,0,0.06)',
                          py: 1.5
                        }}
                      >
                        Total Arbitrial
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.04),
                          color: 'warning.dark',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          borderRight: '1px solid rgba(0,0,0,0.06)',
                          py: 1.5
                        }}
                      >
                        Total Cargos
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.08),
                          color: 'success.dark',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          borderRight: '1px solid rgba(0,0,0,0.06)',
                          py: 1.5
                        }}
                      >
                        Total Pagado
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          bgcolor: alpha(theme.palette.error.main, 0.04),
                          color: 'error.dark',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          py: 1.5
                        }}
                      >
                        Saldo Neto
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {estadoCuentaAnual.map((fila, index) => (
                      <TableRow
                        key={`${fila.anio}-${index}`}
                        onClick={() => handleFilaClick(fila.anio)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: anioSeleccionado === fila.anio
                            ? alpha(theme.palette.primary.main, 0.06)
                            : index % 2 === 0 ? 'white' : alpha(theme.palette.action.hover, 0.3),
                          transition: 'all 0.2s ease-in-out',
                          borderLeft: anioSeleccionado === fila.anio
                            ? `4px solid ${theme.palette.primary.main}`
                            : '4px solid transparent',
                          '&:hover': {
                            backgroundColor: anioSeleccionado === fila.anio
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.primary.main, 0.03),
                            transform: 'translateX(3px)'
                          }
                        }}
                      >
                        {/* Año */}
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: anioSeleccionado === fila.anio ? 'primary.main' : 'text.primary',
                            borderRight: '1px solid rgba(0,0,0,0.05)',
                            py: 1.2
                          }}
                        >
                          {fila.anio}
                        </TableCell>
                        {/* Total Predial */}
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: 'info.main',
                            borderRight: '1px solid rgba(0,0,0,0.05)',
                            py: 1.2
                          }}
                        >
                          S/ {formatearNumero(fila.totalPredial)}
                        </TableCell>
                        {/* Total Arbitrial */}
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: 'success.main',
                            borderRight: '1px solid rgba(0,0,0,0.05)',
                            py: 1.2
                          }}
                        >
                          S/ {formatearNumero(fila.totalArbitrial)}
                        </TableCell>
                        {/* Total Cargos */}
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: 'text.primary',
                            borderRight: '1px solid rgba(0,0,0,0.05)',
                            py: 1.2
                          }}
                        >
                          S/ {formatearNumero(fila.totalCargos)}
                        </TableCell>
                        {/* Total Pagado */}
                        <TableCell
                          align="right"
                          sx={{
                            borderRight: '1px solid rgba(0,0,0,0.05)',
                            py: 1.2
                          }}
                        >
                          {fila.totalPagado > 0 ? (
                            <Typography component="span" fontWeight={700} fontSize="0.9rem" color="success.main">
                              S/ {formatearNumero(fila.totalPagado)}
                            </Typography>
                          ) : (
                            <Typography component="span" fontSize="0.9rem" color="text.secondary" sx={{ opacity: 0.6 }}>
                              S/ 0.00
                            </Typography>
                          )}
                        </TableCell>
                        {/* Saldo Neto */}
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.2
                          }}
                        >
                          {fila.saldoNeto > 0 ? (
                            <Typography component="span" fontWeight={800} fontSize="0.95rem" color="error.main">
                              S/ {formatearNumero(fila.saldoNeto)}
                            </Typography>
                          ) : (
                            <Chip
                              label="Al día"
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                height: 22,
                                borderRadius: '6px'
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Información adicional */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.015),
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.06)
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.4, transform: 'scale(0.85)' }
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    Haga clic en una fila anual para desglosar el detalle por conceptos.
                  </Typography>
                </Box>
                {deudaSeleccionada && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 0.75,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.warning.main, 0.15)
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: 'warning.dark',
                        fontSize: '0.8rem'
                      }}
                    >
                      Deuda Seleccionada:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: 'warning.dark',
                        fontSize: '0.85rem'
                      }}
                    >
                      {deudaSeleccionada}
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabla de Detalle de Conceptos */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.warning.main, 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'warning.dark'
                }}
              >
                <ReceiptLongIcon sx={{ fontSize: '1.2rem' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', fontSize: '1.05rem' }}>
                Detalle por Conceptos y Períodos
              </Typography>
            </Box>
            {anioSeleccionado && (
              <Chip
                label={`Año Seleccionado: ${anioSeleccionado}`}
                color="secondary"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  height: 32,
                  borderRadius: '16px',
                  px: 1.5
                }}
              />
            )}
          </Box>
          <Divider sx={{ mb: 2.5 }} />

          {loadingDetalle ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : errorDetalle ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>{errorDetalle}</Alert>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                maxHeight: 520,
                overflowX: 'auto',
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.5),
                  borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.35)
                  }
                }
              }}
            >
              <Table size="small" sx={{ minWidth: 1800 }} stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                        color: 'primary.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        position: 'sticky',
                        left: 0,
                        zIndex: 3,
                        minWidth: 80,
                        borderRight: '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      Año
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                        color: 'primary.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        position: 'sticky',
                        left: 80,
                        zIndex: 3,
                        minWidth: 140,
                        borderRight: '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      Grupo Tributo
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                        color: 'primary.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        position: 'sticky',
                        left: 220,
                        zIndex: 3,
                        minWidth: 250,
                        borderRight: '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      Tributo
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                        color: 'primary.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        position: 'sticky',
                        left: 470,
                        zIndex: 3,
                        minWidth: 100,
                        borderRight: '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      Concepto
                    </TableCell>
                    <TableCell
                      align="center"
                      colSpan={12}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        color: 'primary.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        borderRight: '1px solid rgba(0,0,0,0.08)',
                        py: 1
                      }}
                    >
                      Períodos Mensuales
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.06),
                        color: 'warning.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        borderRight: '1px solid rgba(0,0,0,0.08)',
                        minWidth: 120
                      }}
                    >
                      Total Cargos
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.06),
                        color: 'success.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        borderRight: '1px solid rgba(0,0,0,0.08)',
                        minWidth: 120
                      }}
                    >
                      Total Pagado
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.06),
                        color: 'error.dark',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        minWidth: 120
                      }}
                    >
                      Saldo Neto
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((periodo) => (
                      <TableCell
                        key={periodo}
                        align="center"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          color: 'primary.dark',
                          fontWeight: 700,
                          fontSize: '0.813rem',
                          minWidth: 80,
                          borderRight: '1px solid rgba(0,0,0,0.08)'
                        }}
                      >
                        {periodo}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tributosUnicos.size === 0 ? (
                    <TableRow>
                      <TableCell colSpan={19} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {anioSeleccionado
                            ? `No se registran cargos ni abonos para el año ${anioSeleccionado}`
                            : 'Haga clic en una fila del resumen anual para consultar el detalle por períodos.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.from(tributosUnicos.entries()).map(([tributo, conceptos]) => {
                      const isExpanded = tributosExpandidos.has(tributo);
                      const primerConcepto = conceptos[0];
                      const mainRowBg = alpha(theme.palette.primary.main, 0.015);
                      const mainRowHoverBg = alpha(theme.palette.primary.main, 0.04);

                      const groupStickyCellSx = {
                        position: 'sticky',
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: `linear-gradient(${mainRowBg}, ${mainRowBg})`,
                        zIndex: 2,
                        borderRight: '1px solid rgba(0,0,0,0.06)',
                        transition: 'background-color 0.2s, background-image 0.2s',
                        'tr:hover &': {
                          backgroundColor: theme.palette.background.paper,
                          backgroundImage: `linear-gradient(${mainRowHoverBg}, ${mainRowHoverBg})`
                        }
                      };

                      return (
                        <React.Fragment key={tributo}>
                          {/* Fila principal del tributo */}
                          <TableRow
                            sx={{
                              backgroundColor: mainRowBg,
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: mainRowHoverBg
                              }
                            }}
                            onClick={() => handleToggleTributo(tributo)}
                          >
                            {/* Año */}
                            <TableCell
                              align="center"
                              sx={{
                                ...groupStickyCellSx,
                                fontWeight: 700,
                                left: 0
                              }}
                            >
                              {primerConcepto.anio}
                            </TableCell>

                            {/* Grupo Tributo */}
                            <TableCell
                              align="center"
                              sx={{
                                ...groupStickyCellSx,
                                left: 80
                              }}
                            >
                              <Chip
                                label={primerConcepto.grupoTributo}
                                color={primerConcepto.grupoTributo === 'Arbitrial' ? 'primary' : 'info'}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 700, height: 20, borderRadius: '4px' }}
                              />
                            </TableCell>

                            {/* Tributo con botón expandir */}
                            <TableCell
                              align="left"
                              sx={{
                                ...groupStickyCellSx,
                                left: 220,
                                fontWeight: 700
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleTributo(tributo);
                                  }}
                                  sx={{
                                    p: 0.25,
                                    transition: 'transform 0.2s',
                                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                                  }}
                                >
                                  {isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                                </IconButton>
                                <Typography variant="body2" fontWeight={700} noWrap>
                                  {tributo}
                                </Typography>
                              </Box>
                            </TableCell>

                            {/* Concepto - cantidad */}
                            <TableCell
                              sx={{
                                ...groupStickyCellSx,
                                left: 470
                              }}
                            >
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {conceptos.length / 3} tributo(s)
                              </Typography>
                            </TableCell>

                            {/* Períodos - sumas totales */}
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((col) => {
                              const sum = conceptos.reduce((acc, c) => {
                                if (c.concepto === 'F. Venc') return acc;
                                const value = c[`col${col}` as keyof typeof c];
                                return acc + (typeof value === 'number' ? value : 0);
                              }, 0);
                              return (
                                <TableCell key={col} align="center" sx={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '0.85rem',
                                      color: sum > 0 ? 'text.primary' : 'text.disabled'
                                    }}
                                  >
                                    {sum > 0 ? formatearNumero(sum) : '-'}
                                  </Typography>
                                </TableCell>
                              );
                            })}

                            {/* Total Cargos */}
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 800,
                                color: 'warning.dark',
                                borderRight: '1px solid rgba(0,0,0,0.05)',
                                bgcolor: alpha(theme.palette.warning.main, 0.01)
                              }}
                            >
                              {formatearNumero(primerConcepto.totalCargos)}
                            </TableCell>

                            {/* Total Pagado */}
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 800,
                                color: 'success.main',
                                borderRight: '1px solid rgba(0,0,0,0.05)',
                                bgcolor: alpha(theme.palette.success.main, 0.01)
                              }}
                            >
                              {formatearNumero(primerConcepto.totalPagado)}
                            </TableCell>

                            {/* Saldo Neto */}
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 900,
                                color: primerConcepto.saldoNeto > 0 ? 'error.main' : 'success.main',
                                bgcolor: primerConcepto.saldoNeto > 0 ? alpha(theme.palette.error.main, 0.01) : alpha(theme.palette.success.main, 0.01)
                              }}
                            >
                              {primerConcepto.saldoNeto > 0 ? (
                                `S/ ${formatearNumero(primerConcepto.saldoNeto)}`
                              ) : (
                                <Chip
                                  label="Al día"
                                  size="small"
                                  color="success"
                                  sx={{ fontWeight: 700, height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </TableCell>
                          </TableRow>

                          {/* Filas de conceptos expandibles */}
                          {isExpanded && conceptos.map((detalle, idx) => {
                            const isCargo = detalle.concepto === 'Cargo';
                            const isPagado = detalle.concepto === 'Pagado';
                            const rowBg = isCargo ? alpha(theme.palette.warning.main, 0.015) :
                                          isPagado ? alpha(theme.palette.success.main, 0.015) :
                                          alpha(theme.palette.info.main, 0.015);
                            const rowHoverBg = isCargo ? alpha(theme.palette.warning.main, 0.04) :
                                               isPagado ? alpha(theme.palette.success.main, 0.04) :
                                               alpha(theme.palette.info.main, 0.04);

                            const stickyCellSx = {
                              position: 'sticky',
                              backgroundColor: theme.palette.background.paper,
                              backgroundImage: `linear-gradient(${rowBg}, ${rowBg})`,
                              zIndex: 2,
                              borderRight: '1px solid rgba(0,0,0,0.06)',
                              transition: 'background-color 0.2s, background-image 0.2s',
                              'tr:hover &': {
                                backgroundColor: theme.palette.background.paper,
                                backgroundImage: `linear-gradient(${rowHoverBg}, ${rowHoverBg})`
                              }
                            };

                            return (
                              <TableRow
                                key={`${tributo}-${idx}`}
                                sx={{
                                  backgroundColor: rowBg,
                                  '&:hover': {
                                    backgroundColor: rowHoverBg
                                  }
                                }}
                              >
                                {/* Año - vacío */}
                                <TableCell sx={{ ...stickyCellSx, left: 0 }} />

                                {/* Grupo Tributo - vacío */}
                                <TableCell sx={{ ...stickyCellSx, left: 80 }} />

                                {/* Tributo - vacío */}
                                <TableCell sx={{ ...stickyCellSx, left: 220 }} />

                                {/* Concepto */}
                                <TableCell sx={{ ...stickyCellSx, left: 470, py: 0.75 }}>
                                  <Chip
                                    label={detalle.concepto}
                                    size="small"
                                    color={isCargo ? 'warning' : isPagado ? 'success' : 'info'}
                                    variant="outlined"
                                    sx={{ fontWeight: 700, height: 22, borderRadius: '4px' }}
                                  />
                                </TableCell>

                                {/* Períodos */}
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((col) => {
                                  const value = detalle[`col${col}` as keyof typeof detalle];
                                  return (
                                    <TableCell key={col} align="center" sx={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                      {detalle.concepto === 'F. Venc' ? (
                                        <Typography variant="body2" sx={{ color: value !== '-' ? 'text.primary' : 'text.disabled', fontSize: '0.813rem' }}>
                                          {typeof value === 'string' ? value : '-'}
                                        </Typography>
                                      ) : (
                                        (() => {
                                          const num = typeof value === 'number' ? value : 0;
                                          if (num === 0) {
                                            return <Typography variant="body2" sx={{ color: 'text.disabled', opacity: 0.5, fontSize: '0.813rem' }}>-</Typography>;
                                          }
                                          return (
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                color: isCargo ? 'warning.dark' : 'success.main'
                                              }}
                                            >
                                              {formatearNumero(num)}
                                            </Typography>
                                          );
                                        })()
                                      )}
                                    </TableCell>
                                  );
                                })}

                                {/* Total Cargos */}
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: 'warning.dark',
                                    borderRight: '1px solid rgba(0,0,0,0.05)',
                                    bgcolor: isCargo ? alpha(theme.palette.warning.main, 0.03) : 'transparent'
                                  }}
                                >
                                  {isCargo ? formatearNumero(detalle.totalCargos) : '-'}
                                </TableCell>

                                {/* Total Pagado */}
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: isPagado ? 'success.main' : 'text.disabled',
                                    borderRight: '1px solid rgba(0,0,0,0.05)',
                                    bgcolor: isPagado ? alpha(theme.palette.success.main, 0.03) : 'transparent'
                                  }}
                                >
                                  {isPagado ? formatearNumero(detalle.totalPagado) : '-'}
                                </TableCell>

                                {/* Saldo Neto */}
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: detalle.saldoNeto > 0 ? 'error.main' : 'success.main',
                                    bgcolor: detalle.saldoNeto > 0 ? alpha(theme.palette.error.main, 0.03) : alpha(theme.palette.success.main, 0.03)
                                  }}
                                >
                                  {detalle.concepto !== 'F. Venc' ? (
                                    detalle.saldoNeto > 0 ? (
                                      formatearNumero(detalle.saldoNeto)
                                    ) : (
                                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>0.00</Typography>
                                    )
                                  ) : '-'}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CuentaList;
