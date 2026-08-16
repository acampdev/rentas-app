// src/components/predio/asignacion/ConsultaAsignacion.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
  Fade,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  Error as ErrorIcon,
  AddCircleOutline as AddIcon,
  PersonRemove as PersonRemoveIcon
} from '@mui/icons-material';
import { SelectorContribuyente } from '../../';
import { NotificationService } from '../../utils/Notification';
import { useAsignacion } from '../../../hooks/useAsignacion';
import type { AsignacionPredio } from '../../../services/asignacionService';
import type { ContribuyenteListItem } from '../../../hooks/useContribuyentes';

interface ConsultaAsignacionData {
  anio: string;
  codigoContribuyente: string;
  nombreContribuyente: string;
}

const ConsultaAsignacion: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const processedRedirectRef = useRef(false);

  // Hooks personalizados
  const { asignaciones, loading, error, buscarAsignaciones, limpiarError } = useAsignacion();

  // Estados locales
  const [filtros, setFiltros] = useState<ConsultaAsignacionData>({
    anio: new Date().getFullYear().toString(),
    codigoContribuyente: '',
    nombreContribuyente: ''
  });

  // Efecto para detectar búsquedas automáticas desde redirecciones (por ejemplo, después de registrar/editar)
  useEffect(() => {
    if (processedRedirectRef.current) return;

    const state = location.state as {
      searchParams?: {
        anio: number;
        codContribuyente: string;
      };
      nombreContribuyente?: string;
    } | null;

    if (state && state.searchParams) {
      processedRedirectRef.current = true;
      console.log('📬 [ConsultaAsignacion] Detectado state de navegación:', state);
      const { anio, codContribuyente } = state.searchParams;

      setFiltros({
        anio: anio.toString(),
        codigoContribuyente: codContribuyente,
        nombreContribuyente: state.nombreContribuyente || ''
      });

      buscarAsignaciones({
        anio,
        codContribuyente
      });

      // Limpiar el estado de navegación para evitar re-búsquedas si se refresca la página
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, buscarAsignaciones, navigate]);

  const [showContribuyenteModal, setShowContribuyenteModal] = useState(false);

  // Handlers
  const handleSelectContribuyente = (contribuyente: ContribuyenteListItem) => {
    setFiltros({
      ...filtros,
      codigoContribuyente: contribuyente?.codigo ? String(contribuyente.codigo) : '',
      nombreContribuyente: contribuyente?.contribuyente || ''
    });
    setShowContribuyenteModal(false);
  };

  const realizarBusqueda = async () => {
    const params = {
      anio: filtros.anio ? parseInt(filtros.anio) : undefined,
      codContribuyente: filtros.codigoContribuyente || undefined
    };

    if (!params.codContribuyente && !params.anio) {
      NotificationService.error('Debe ingresar al menos un año o contribuyente');
      return;
    }

    try {
      const resultados = await buscarAsignaciones(params);

      if (resultados.length > 0) {
        NotificationService.success(`Se encontraron ${resultados.length} asignaciones`);
      } else {
        NotificationService.info('No se encontraron asignaciones para este contribuyente');
      }
    } catch (err) {
      console.error('❌ [ConsultaAsignacion] Error en búsqueda:', err);
      NotificationService.error('Error al buscar asignaciones');
    }
  };

  const handleBuscar = async () => {
    await realizarBusqueda();
  };

  const handleImprimirPU = () => {
    if (!filtros.codigoContribuyente) {
      NotificationService.error('Debe ingresar un código de contribuyente');
      return;
    }
    NotificationService.success('Generando PU...');
  };

  const handleEditar = (asignacion: AsignacionPredio) => {
    console.log('🔄 [ConsultaAsignacion] Editando asignación:', asignacion);

    try {
      // Validar que tenemos los datos necesarios
      if (!asignacion.codPredio || !asignacion.codContribuyente) {
        NotificationService.error('Datos de asignación incompletos para editar');
        return;
      }

      // Preparar los datos para navegación con todos los campos
      const datosAsignacion = {
        // Datos principales
        anio: asignacion.anio,
        codPredio: asignacion.codPredio?.trim(),
        codPredioBase: asignacion.codPredioBase,
        codContribuyente: asignacion.codContribuyente,
        codAsignacion: asignacion.codAsignacion,
        nombreContribuyente: asignacion.nombreContribuyente,
        codPredioContribuyente: asignacion.codPredioContribuyente,
        // Datos del predio
        direccionCompleta: asignacion.direccionCompleta,
        autoavaluo: asignacion.autoavaluo,
        baseImponible: asignacion.baseImponible,
        impuestoAnual: asignacion.impuestoAnual,
        // Datos de asignación
        porcentajeCondomino: asignacion.porcentajeCondomino,
        porcentajeCondominoDesc: asignacion.porcentajeCondominoDesc,
        fechaDeclaracion: asignacion.fechaDeclaracion,
        fechaVenta: asignacion.fechaVenta,
        fechaDeclaracionStr: asignacion.fechaDeclaracionStr,
        fechaVentaStr: asignacion.fechaVentaStr,
        codModoDeclaracion: asignacion.codModoDeclaracion,
        modoDeclaracion: asignacion.modoDeclaracion,
        pensionista: asignacion.pensionista,
        pensionistaDesc: asignacion.pensionistaDesc,
        codEstado: asignacion.codEstado,
        estado: asignacion.estado,
        codUsuario: asignacion.codUsuario
      };

      console.log('📋 [ConsultaAsignacion] Datos preparados para edición:', datosAsignacion);

      // Navegar a la página de edición de asignación pasando los datos completos
      navigate('/predio/asignacion/nuevo', {
        state: {
          editMode: true,
          asignacionData: datosAsignacion,
          fromConsulta: true
        }
      });

      NotificationService.success(`Navegando a edición de asignación del predio ${asignacion.codPredio}`);
    } catch (error: unknown) {
      console.error('❌ [ConsultaAsignacion] Error al preparar edición:', error);
      NotificationService.error('Error al preparar la edición de la asignación');
    }
  };

  const handleDesasignar = (asignacion: AsignacionPredio) => {
    console.log('🔄 [ConsultaAsignacion] Desasignando asignación:', asignacion);

    try {
      if (!asignacion.codPredio || !asignacion.codContribuyente) {
        NotificationService.error('Datos de asignación incompletos para desasignar');
        return;
      }

      const datosAsignacion = {
        anio: asignacion.anio,
        codPredio: asignacion.codPredio?.trim(),
        codPredioBase: asignacion.codPredioBase,
        codContribuyente: asignacion.codContribuyente,
        codAsignacion: asignacion.codAsignacion,
        nombreContribuyente: asignacion.nombreContribuyente,
        codPredioContribuyente: asignacion.codPredioContribuyente,
        direccionCompleta: asignacion.direccionCompleta,
        autoavaluo: asignacion.autoavaluo,
        baseImponible: asignacion.baseImponible,
        impuestoAnual: asignacion.impuestoAnual,
        porcentajeCondomino: asignacion.porcentajeCondomino,
        porcentajeCondominoDesc: asignacion.porcentajeCondominoDesc,
        fechaDeclaracion: asignacion.fechaDeclaracion,
        fechaVenta: asignacion.fechaVenta,
        fechaDeclaracionStr: asignacion.fechaDeclaracionStr,
        fechaVentaStr: asignacion.fechaVentaStr,
        codModoDeclaracion: asignacion.codModoDeclaracion,
        modoDeclaracion: asignacion.modoDeclaracion,
        pensionista: asignacion.pensionista,
        pensionistaDesc: asignacion.pensionistaDesc,
        codEstado: asignacion.codEstado,
        estado: asignacion.estado,
        codUsuario: asignacion.codUsuario
      };

      navigate('/predio/asignacion/nuevo', {
        state: {
          isDesasignarMode: true,
          asignacionData: datosAsignacion,
          fromConsulta: true
        }
      });
    } catch (e) {
      console.error('Error al navegar para desasignar:', e);
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Mostrar error si existe */}
      {error && (
        <Alert severity="error" onClose={limpiarError} icon={<ErrorIcon />} sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500}>
            Error al cargar asignaciones: {error}
          </Typography>
        </Alert>
      )}

      {/* Header Principal Mejorado */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          mb: 3
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            p: 3
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              <AssignmentIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Consulta de Asignaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PU - Contribuyente y Predios Asignados
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Sección de Búsqueda Mejorada */}
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <SearchIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Buscar Contribuyente y Predio
            </Typography>
          </Box>
          {/* Formulario de Búsqueda con mejor layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'flex-end' },
              mb: 3,
              p: 2,
              bgcolor: alpha(theme.palette.grey[50], 0.5),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`
            }}
          >
            {/* Año */}
            <Box
              sx={{
                flex: { xs: '1 1 100%', sm: '0 0 80px' },
                minWidth: { xs: '100%', sm: '80px' }
              }}
            >
              <TextField
                fullWidth
                size="small"
                margin="none"
                label="Año"
                type="number"
                value={filtros.anio}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    anio: e.target.value
                  })
                }
                InputProps={{
                  inputProps: {
                    min: 1900,
                    max: new Date().getFullYear() + 10
                  }
                }}
                placeholder={`Ej: ${new Date().getFullYear()}`}
                sx={{
                  m: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 40,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
            </Box>

            {/* Botón Seleccionar Contribuyente */}
            <Button
              variant="outlined"
              onClick={() => setShowContribuyenteModal(true)}
              startIcon={<PersonIcon />}
              sx={{
                height: 40,
                borderRadius: 2,
                fontWeight: 500,
                textTransform: 'none',
                flex: { xs: '1 1 100%', sm: '0 0 200px' },
                minWidth: { xs: '100%', sm: '200px' },
                m: 0
              }}
            >
              Seleccionar Contribuyente
            </Button>

            {/* Código Contribuyente - Solo lectura */}
            <Box
              sx={{
                flex: { xs: '1 1 100%', sm: '0 0 90px' },
                minWidth: { xs: '100%', sm: '90px' }
              }}
            >
              <TextField
                fullWidth
                size="small"
                margin="none"
                label="Código"
                value={filtros.codigoContribuyente}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <PersonIcon
                      sx={{
                        mr: 0.5,
                        color: 'action.active',
                        fontSize: '1.1rem'
                      }}
                    />
                  )
                }}
                placeholder="---"
                sx={{
                  m: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 40,
                    bgcolor: alpha(theme.palette.grey[100], 0.5),
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
            </Box>

            {/* Nombre Contribuyente - Solo lectura */}
            <Box
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 200px' },
                minWidth: { xs: '100%', sm: '200px' }
              }}
            >
              <TextField
                fullWidth
                size="small"
                margin="none"
                label="Nombre del Contribuyente"
                value={filtros.nombreContribuyente}
                InputProps={{
                  readOnly: true
                }}
                placeholder="Seleccione un contribuyente..."
                sx={{
                  m: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 40,
                    bgcolor: alpha(theme.palette.grey[100], 0.5),
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
            </Box>

            {/* Botones Buscar y Nuevo */}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flex: { xs: '1 1 100%', sm: '0 0 220px' },
                minWidth: { xs: '100%', sm: '220px' },
                m: 0
              }}
            >
              {/* Botón Buscar */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleBuscar}
                disabled={loading || (!filtros.anio && !filtros.codigoContribuyente)}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
                sx={{
                  height: 40,
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: '#3b82f6 !important', // Color azul premium siempre visible
                  color: 'white !important',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    bgcolor: '#2563eb !important',
                    boxShadow: theme.shadows[4]
                  },
                  '&.Mui-disabled': {
                    bgcolor: `${alpha('#3b82f6', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important',
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? '...' : 'Buscar'}
              </Button>

              {/* Botón Nuevo */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/predio/asignacion/nuevo')}
                startIcon={<AddIcon />}
                sx={{
                  height: 40,
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: '#10b981 !important', // Verde esmeralda premium
                  color: 'white !important',
                  '&:hover': {
                    bgcolor: '#059669 !important'
                  }
                }}
              >
                Nuevo
              </Button>
            </Box>
          </Box>
        </Box>
        {/* Header de la tabla */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HomeIcon />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Predios Asignados
            </Typography>
          </Box>

          <Chip label={`${asignaciones.length} asignaciones`} color="primary" variant="filled" size="small" sx={{ fontWeight: 600 }} />
        </Box>

        <TableContainer
          sx={{
            maxHeight: 450,
            overflowX: 'auto',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderRadius: 2
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.primary.main, 0.3),
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.5)
              }
            }
          }}
        >
          <Table stickyHeader size="small" sx={{ minWidth: 1800 }}>
            <TableHead>
              <TableRow>
                {/* Columnas de la tabla con estilos consistentes */}
                {[
                  { label: 'AÑO', width: 70, align: 'center' as const },
                  {
                    label: 'CÓD. PREDIO',
                    width: 100,
                    align: 'left' as const,
                    icon: <HomeIcon fontSize="small" />
                  },
                  {
                    label: 'CONTRIBUYENTE',
                    width: 200,
                    align: 'left' as const,
                    icon: <PersonIcon fontSize="small" />
                  },
                  { label: 'DIRECCIÓN', width: 250, align: 'left' as const },
                  { label: 'AUTOAVALÚO', width: 110, align: 'right' as const },
                  { label: 'BASE IMP.', width: 100, align: 'right' as const },
                  { label: 'IMP. ANUAL', width: 100, align: 'right' as const },
                  { label: '% COND.', width: 90, align: 'center' as const },
                  {
                    label: 'F. DECLARACIÓN',
                    width: 110,
                    align: 'center' as const
                  },
                  { label: 'F. VENTA', width: 100, align: 'center' as const },
                  { label: 'MODO DECL.', width: 130, align: 'center' as const },
                  { label: 'PENSIONISTA', width: 90, align: 'center' as const },
                  { label: 'ESTADO', width: 90, align: 'center' as const },
                  { label: 'ACCIONES', width: 80, align: 'center' as const }
                ].map((col, idx) => (
                  <TableCell
                    key={idx}
                    align={col.align}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: 0.3,
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      py: 1.5,
                      px: 1,
                      minWidth: col.width,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {col.icon}
                      {col.label}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {asignaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center" sx={{ py: 8 }}>
                    <Stack alignItems="center" spacing={3}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                        }}
                      >
                        <SearchIcon
                          sx={{
                            fontSize: 64,
                            color: alpha(theme.palette.primary.main, 0.4)
                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          {filtros.codigoContribuyente || filtros.anio ? 'No se encontraron asignaciones' : 'Ingrese criterios de búsqueda'}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          {filtros.codigoContribuyente || filtros.anio
                            ? 'No hay predios asignados con los criterios especificados'
                            : 'Ingrese un año o contribuyente para buscar asignaciones'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                asignaciones.map((asignacion, index) => (
                  <Fade in={true} key={index} timeout={200 + index * 50}>
                    <TableRow
                      hover
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04)
                        },
                        '&:nth-of-type(even)': {
                          bgcolor: alpha(theme.palette.grey[50], 0.3)
                        }
                      }}
                    >
                      {/* Año */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Chip label={asignacion.anio} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>

                      {/* Código Predio */}
                      <TableCell
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Chip
                          icon={<HomeIcon sx={{ fontSize: '0.9rem !important' }} />}
                          label={asignacion.codPredio?.trim()}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </TableCell>

                      {/* Nombre Contribuyente */}
                      <TableCell
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                          maxWidth: 200
                        }}
                      >
                        <Tooltip title={asignacion.nombreContribuyente || ''} arrow>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {asignacion.nombreContribuyente || 'N/A'}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* Dirección */}
                      <TableCell
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                          maxWidth: 250
                        }}
                      >
                        <Tooltip title={asignacion.direccionCompleta || ''} arrow>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.75rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {asignacion.direccionCompleta || 'N/A'}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* Autoavalúo */}
                      <TableCell
                        align="right"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: theme.palette.success.main
                          }}
                        >
                          S/{' '}
                          {asignacion.autoavaluo?.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) || '0.00'}
                        </Typography>
                      </TableCell>

                      {/* Base Imponible */}
                      <TableCell
                        align="right"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          S/{' '}
                          {asignacion.baseImponible?.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) || '0.00'}
                        </Typography>
                      </TableCell>

                      {/* Impuesto Anual */}
                      <TableCell
                        align="right"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: theme.palette.error.main
                          }}
                        >
                          S/{' '}
                          {asignacion.impuestoAnual?.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) || '0.00'}
                        </Typography>
                      </TableCell>

                      {/* % Condominio */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Chip
                          label={asignacion.porcentajeCondominoDesc || `${asignacion.porcentajeCondomino || 100}%`}
                          size="small"
                          variant="filled"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                      </TableCell>

                      {/* Fecha Declaración */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {asignacion.fechaDeclaracionStr || 'N/A'}
                        </Typography>
                      </TableCell>

                      {/* Fecha Venta */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {asignacion.fechaVentaStr || 'N/A'}
                        </Typography>
                      </TableCell>

                      {/* Modo Declaración */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Chip
                          label={asignacion.modoDeclaracion || asignacion.codModoDeclaracion || 'N/A'}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', maxWidth: 120 }}
                        />
                      </TableCell>

                      {/* Pensionista */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Chip
                          label={asignacion.pensionistaDesc || (asignacion.pensionista === 1 ? 'Sí' : 'No')}
                          size="small"
                          variant="filled"
                          color={asignacion.pensionista === 1 ? 'success' : 'default'}
                          sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                        />
                      </TableCell>

                      {/* Estado */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Chip
                          label={asignacion.estado || 'ACTIVO'}
                          size="small"
                          variant="filled"
                          color={asignacion.estado === 'ACTIVO' || asignacion.codEstado === '0201' ? 'success' : 'error'}
                          sx={{ fontSize: '0.65rem', fontWeight: 600 }}
                        />
                      </TableCell>

                      {/* Acciones */}
                      <TableCell
                        align="center"
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }}
                      >
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title={`Editar asignación del predio ${asignacion.codPredio}`} arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleEditar(asignacion)}
                              disabled={loading}
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.16),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out',
                                minWidth: '28px',
                                minHeight: '28px'
                              }}
                            >
                              <EditIcon
                                fontSize="small"
                                sx={{
                                  color: theme.palette.primary.main,
                                  fontSize: '1rem'
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`Desasignar predio ${asignacion.codPredio}`} arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDesasignar(asignacion)}
                              disabled={loading}
                              sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.08),
                                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.16),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out',
                                minWidth: '28px',
                                minHeight: '28px'
                              }}
                            >
                              <PersonRemoveIcon
                                fontSize="small"
                                sx={{
                                  color: theme.palette.error.main,
                                  fontSize: '1rem'
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Botón Imprimir PU mejorado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`
          }}
        >
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleImprimirPU}
            disabled={!filtros.codigoContribuyente || asignaciones.length === 0}
            sx={{
              bgcolor: theme.palette.success.main,
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              '&:hover': {
                bgcolor: theme.palette.success.dark,
                boxShadow: theme.shadows[6],
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                bgcolor: alpha(theme.palette.grey[400], 0.6),
                color: alpha(theme.palette.common.white, 0.6)
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Imprimir PU
          </Button>
        </Box>
      </Paper>

      {/* Información adicional */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.grey[50], 0.8),
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          Total de asignaciones encontradas: {asignaciones.length}
        </Typography>
        {asignaciones.length > 0 && <Chip label="Datos actualizados" color="success" size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />}
      </Box>

      {/* Modal Selector de Contribuyente */}
      <SelectorContribuyente
        isOpen={showContribuyenteModal}
        onClose={() => setShowContribuyenteModal(false)}
        onSelectContribuyente={handleSelectContribuyente}
        title="Seleccionar contribuyente"
      />
    </Box>
  );
};

export default ConsultaAsignacion;
