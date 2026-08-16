// src/components/modal/SelectorPredio.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Stack,
  InputAdornment,
  Radio,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Terrain as TerrainIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { usePredios } from '../../hooks/usePredioAPI';
import { Predio } from '../../models/Predio';
import { formatCurrency } from '../../utils/formatters';
import { formatPredioDireccion, sortPrediosByCode } from './selectorPredio.utils';

interface SelectorPredioProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPredio: (predio: Predio) => void;
  title?: string;
  selectedId?: string | null;
  contribuyenteId?: number | null;
}

/**
 * Modal para seleccionar un predio
 */
const SelectorPredio: React.FC<SelectorPredioProps> = ({
  isOpen,
  onClose,
  onSelectPredio,
  title = 'Selector de predios'
}) => {
  const theme = useTheme();

  // Estados locales - Filtros
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [codPredioBase, setCodPredioBase] = useState('');
  const [parametroBusqueda, setParametroBusqueda] = useState('');
  const [selectedPredio, setSelectedPredio] = useState<Predio | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasSearched, setHasSearched] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Hook de predios - DEBE estar después de todos los estados
  const {
    predios,
    loading,
    error,
    buscarPrediosConFiltros
  } = usePredios({ enabled: false });

  // Cargar predios al abrir el modal
  useEffect(() => {
    if (isOpen) {
      console.log('🔓 [SelectorPredio] Modal abierto, cargando predios del año actual');
      buscarPrediosConFiltros(anio, '').catch(err => {
        console.error('❌ [SelectorPredio] Error al cargar predios:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Resetear estados cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setAnio(new Date().getFullYear());
      setCodPredioBase('');
      setParametroBusqueda('');
      setSelectedPredio(null);
      setPage(0);
      setHasSearched(false);
    }
  }, [isOpen]);

  // Mostrar predios según si se ha buscado o no con ordenamiento
  const filteredPredios = useMemo(() => sortPrediosByCode(predios, order), [predios, order]);

  // Paginar resultados
  const paginatedPredios = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPredios.slice(start, end);
  }, [filteredPredios, page, rowsPerPage]);

  // Handlers
  const handleRequestSort = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    console.log('🔄 [SelectorPredio] Cambiando orden:', { actual: order, nuevo: newOrder });
    setOrder(newOrder);
  };

  const handleBuscar = async () => {
    setHasSearched(true);
    setPage(0);

    console.log('🔍 [SelectorPredio] Buscando con filtros:', {
      anio,
      codPredioBase,
      parametroBusqueda
    });

    try {
      // Llamar a la nueva API con query params
      await buscarPrediosConFiltros(
        anio || undefined,
        codPredioBase || undefined,
        parametroBusqueda || undefined
      );

      console.log('✅ [SelectorPredio] Búsqueda completada');
    } catch (error) {
      console.error('❌ [SelectorPredio] Error en búsqueda:', error);
    }
  };

  const handleLimpiar = async () => {
    const anioActual = new Date().getFullYear();
    setAnio(anioActual);
    setCodPredioBase('');
    setParametroBusqueda('');
    setHasSearched(false);
    setPage(0);

    await buscarPrediosConFiltros(anioActual, '');
  };

  const handleSelectPredio = (predio: Predio) => {
    const predioId = predio.codPredioBase || predio.codigoPredio || predio.codPredio || predio.id;
    console.log('✓ [SelectorPredio] Predio seleccionado:', predioId);
    setSelectedPredio(predio);
  };

  const handleConfirm = () => {
    if (selectedPredio) {
      // Asegurar que el código enviado sea el mismo que se muestra en la tabla (codPredioBase)
      const codigoMostradoEnTabla = selectedPredio.codPredioBase || selectedPredio.codigoPredio || selectedPredio.codPredio;

      console.log('🔍 [SelectorPredio] Valores ANTES de enviar:', {
        'codPredioBase (DEBE SER ESTE)': selectedPredio.codPredioBase,
        'codigoPredio (ORIGINAL)': selectedPredio.codigoPredio,
        'codPredio (ORIGINAL)': selectedPredio.codPredio,
        'Código mostrado en tabla': codigoMostradoEnTabla
      });

      // Crear un nuevo objeto donde TODOS los campos de código sean el codPredioBase
      const predioParaEnviar: Predio = {
        ...selectedPredio,
        // Sobrescribir TODOS los campos de código con el código correcto (codPredioBase)
        codigoPredio: codigoMostradoEnTabla || '',
        codPredio: codigoMostradoEnTabla,
        codPredioBase: selectedPredio.codPredioBase
      };

      console.log('📤 [SelectorPredio] Valores DESPUÉS de modificar:', {
        'codigoPredio (ENVIADO)': predioParaEnviar.codigoPredio,
        'codPredio (ENVIADO)': predioParaEnviar.codPredio,
        'codPredioBase (ENVIADO)': predioParaEnviar.codPredioBase,
        'OBJETO COMPLETO': predioParaEnviar
      });

      console.warn('⚠️ SI RECIBES 20258 EN EL FORMULARIO, EL PROBLEMA ESTÁ EN EL FORMULARIO RECEPTOR, NO AQUÍ');

      onSelectPredio(predioParaEnviar);
      onClose();
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: '85vh',
          maxHeight: 800,
          width: '90vw'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <IconButton
            aria-label="cerrar"
            onClick={onClose}
            sx={{
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Sección de Filtros de Búsqueda - Estilo compacto */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 0,
            background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0
          }}
        >
          <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <FilterIcon sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Búsqueda de Predios
              </Typography>
              {(codPredioBase || parametroBusqueda || hasSearched) && (
                <Chip
                  label={hasSearched ? "Búsqueda activa" : "Filtros ingresados"}
                  color="primary"
                  size="small"
                />
              )}
            </Stack>

            {/* Filtros compactos */}
            <Stack direction="row" spacing={1} alignItems="flex-end" flexWrap="wrap">
              {/* Año */}
              <Box sx={{ flex: '0 0 100px' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Año"
                  type="number"
                  value={anio}
                  onChange={(e) => setAnio(parseInt(e.target.value) || new Date().getFullYear())}
                  disabled={loading}
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: 2020,
                      max: new Date().getFullYear() + 1
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleBuscar();
                    }
                  }}
                />
              </Box>

              {/* Código Predio */}
              <Box sx={{ flex: '0 0 160px' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Código Predio"
                  placeholder="Ej: 4"
                  value={codPredioBase}
                  onChange={(e) => setCodPredioBase(e.target.value)}
                  disabled={loading}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: codPredioBase && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setCodPredioBase('')}
                          disabled={loading}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleBuscar();
                    }
                  }}
                />
              </Box>

              {/* Parámetro Búsqueda */}
              <Box sx={{ flex: '0 0 300px' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Parámetro Búsqueda"
                  placeholder="Buscar..."
                  value={parametroBusqueda}
                  onChange={(e) => setParametroBusqueda(e.target.value)}
                  disabled={loading}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: parametroBusqueda && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setParametroBusqueda('')}
                          disabled={loading}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleBuscar();
                    }
                  }}
                />
              </Box>

              {/* Botones de acción compactos */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {/* Botón para buscar predios */}
                <Button
                  variant="contained"
                  onClick={handleBuscar}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
                  size="small"
                  sx={{
                    minWidth: 90,
                    height: 40,
                    backgroundColor: '#3b82f6 !important', // Azul premium coherente
                    color: 'white !important',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 1.5,
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                    '&:hover': {
                      backgroundColor: '#2563eb !important',
                      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
                      color: 'rgba(255, 255, 255, 0.7) !important',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Buscar
                </Button>

                {/* Botón para limpiar filtros */}
                <Button
                  variant="outlined"
                  onClick={handleLimpiar}
                  disabled={loading}
                  size="small"
                  sx={{
                    minWidth: 90,
                    height: 40,
                    borderColor: '#3b82f6 !important', // Azul premium coherente
                    color: '#3b82f6 !important',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 1.5,
                    '&:hover': {
                      borderColor: '#2563eb !important',
                      backgroundColor: `${alpha('#3b82f6', 0.04)} !important`
                    }
                  }}
                >
                  Limpiar
                </Button>
              </Box>
            </Stack>

            {/* Texto de ayuda compacto */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {loading 
                ? 'Buscando predios...'
                : hasSearched 
                  ? `${filteredPredios.length} predios encontrados`
                  : `${predios.length} predios disponibles. Use código de predio para búsqueda específica.`
              }
            </Typography>
          </Box>
        </Paper>

        {/* Tabla responsiva con Material UI mejorado */}
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary">
                Cargando predios...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ py: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : filteredPredios.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
              <HomeIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography color="text.secondary" variant="body2">
                {hasSearched ? 'No se encontraron predios con los criterios de búsqueda' : 'No hay predios disponibles'}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Vista de tabla para pantallas medianas y grandes */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <TableContainer sx={{
                  flex: 1,
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                  '&::-webkit-scrollbar': {
                    width: 8,
                    height: 8
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.grey[200], 0.3),
                    borderRadius: 4
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.4),
                    borderRadius: 4,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.6)
                    }
                  }
                }}>
                  <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                      <TableRow sx={{ 
                        '& .MuiTableCell-head': { 
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          py: 1.5,
                          color: 'text.primary',
                          borderBottom: `2px solid ${theme.palette.primary.main}`,
                          position: 'sticky',
                          top: 0,
                          zIndex: 10
                        }
                      }}>
                        <TableCell padding="checkbox" sx={{ width: '5%', textAlign: 'center' }}>
                          <Typography variant="caption" fontWeight={700}>Sel.</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: '10%' }}>
                          <TableSortLabel
                            active={true}
                            direction={order}
                            onClick={handleRequestSort}
                            sx={{
                              '& .MuiTableSortLabel-icon': {
                                fontSize: 16,
                                opacity: 0.7
                              },
                              '&:hover': {
                                color: 'primary.main'
                              }
                            }}
                          >
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                              <HomeIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                              <Typography variant="caption" fontWeight={700}>Código</Typography>
                            </Stack>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ width: '35%' }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <LocationIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                            <Typography variant="caption" fontWeight={700}>Dirección</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right" sx={{ width: '12%' }}>
                          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                            <TerrainIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                            <Typography variant="caption" fontWeight={700}>Área m²</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center" sx={{ width: '20%' }}>
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                            <PersonIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                            <Typography variant="caption" fontWeight={700}>Conductor</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center" sx={{ width: '18%' }}>
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                            <MoneyIcon sx={{ fontSize: 14, color: 'success.main' }} />
                            <Typography variant="caption" fontWeight={700}>ValorTerreno</Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPredios.map((predio, index) => {
                        const predioId = predio.codPredioBase || predio.codigoPredio || predio.codPredio || predio.id;

                        const createUniqueKey = (p: Predio | null) => {
                          if (!p) return null;
                          const codigo = p.codPredioBase || p.codigoPredio || p.codPredio || p.id || '';
                          const direccionStr = typeof p.direccion === 'string'
                            ? p.direccion
                            : (p.direccion as any)?.nombreVia || (p.direccion as any)?.descripcion || p.direccionCompleta || '';
                          const direccionId = typeof p.direccion === 'object' && p.direccion !== null
                            ? (p.direccion as any).id || p.direccionId
                            : p.direccionId;
                          return `${codigo}-${direccionStr}-${direccionId || ''}-${p.anio || ''}`.trim();
                        };

                        const selectedKey = createUniqueKey(selectedPredio);
                        const currentKey = createUniqueKey(predio);
                        const isSelected = selectedKey !== null && currentKey !== null && selectedKey === currentKey;

                        return (
                          <TableRow
                            key={currentKey || index}
                            hover
                            onClick={() => handleSelectPredio(predio)}
                            selected={!!isSelected}
                            sx={{
                              cursor: 'pointer',
                              height: 60,
                              bgcolor: isSelected
                                ? alpha(theme.palette.primary.main, 0.25)
                                : index % 2 === 0
                                  ? 'transparent'
                                  : alpha(theme.palette.grey[50], 0.4),
                              borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                              '&:hover': {
                                bgcolor: isSelected
                                  ? alpha(theme.palette.primary.main, 0.35)
                                  : alpha(theme.palette.primary.main, 0.06),
                                borderLeft: `4px solid ${alpha(theme.palette.primary.main, isSelected ? 1 : 0.4)}`,
                                boxShadow: isSelected
                                  ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
                                  : `0 2px 8px ${alpha(theme.palette.grey[400], 0.25)}`,
                                transform: 'translateX(2px)',
                                zIndex: 1
                              },
                              '&.Mui-selected': {
                                bgcolor: alpha(theme.palette.primary.main, 0.25),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.35)
                                }
                              },
                              '&:last-child td': {
                                borderBottom: 'none'
                              },
                              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative'
                            }}
                          >
                            <TableCell padding="checkbox" sx={{ textAlign: 'center' }}>
                              <Radio
                                checked={!!isSelected}
                                value={predioId || `predio-${index}`}
                                size="small"
                                color="primary"
                                sx={{
                                  '&.Mui-checked': {
                                    transform: 'scale(1.1)',
                                    color: 'primary.main'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: '0.875rem',
                                  fontWeight: isSelected ? 600 : 500,
                                  color: isSelected ? 'primary.main' : 'text.primary'
                                }}
                              >
                                {predioId || 'Sin código'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: isSelected ? 600 : 500,
                                    lineHeight: 1.3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    color: isSelected ? 'primary.main' : 'text.primary'
                                  }}
                                >
                                  {typeof predio.direccion === 'string'
                                    ? predio.direccion
                                    : predio.direccion
                                    ? formatPredioDireccion(predio.direccion)
                                    : `Dirección del predio ${predioId}`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                  {predio.areaTerreno?.toFixed(1) || '0.0'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  m²
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: '0.8rem',
                                  fontWeight: 500,
                                  maxWidth: 120,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: predio.conductor ? 'text.primary' : 'text.secondary',
                                  mx: 'auto'
                                }}
                              >
                                {predio.conductor || 'Sin conductor'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: 'success.main'
                                }}
                              >
                                {formatCurrency(predio.valorTerreno || 0)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Paginación minimalista */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  flexShrink: 0
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {filteredPredios.length > 0
                      ? `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredPredios.length)} de ${filteredPredios.length}`
                      : 'Sin resultados'
                    }
                  </Typography>

                  <TablePagination
                    component="div"
                    count={filteredPredios.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas:"
                    labelDisplayedRows={() => ''}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    sx={{
                      '.MuiTablePagination-toolbar': {
                        minHeight: 40,
                        pl: 2,
                        display: 'flex',
                        alignItems: 'center'
                      },
                      '.MuiTablePagination-selectLabel': {
                        fontSize: '0.75rem',
                        m: 0,
                        mb: 0,
                        lineHeight: '1.5',
                        display: 'inline-flex',
                        alignItems: 'center'
                      },
                      '.MuiTablePagination-select': {
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        mr: 1,
                        mt: 0,
                        mb: 0
                      },
                      '.MuiTablePagination-actions': {
                        ml: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0,
                        mb: 0,
                        '& .MuiIconButton-root': {
                          padding: 0.75
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Vista de tarjetas para móviles y tablets */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <Box sx={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  px: 1,
                  '&::-webkit-scrollbar': {
                    width: 4
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.grey[300], 0.2)
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.grey[400], 0.5),
                    borderRadius: 2
                  }
                }}>
                  <Stack spacing={1} sx={{ py: 1 }}>
                    {paginatedPredios.map((predio, index) => {
                      const predioId = predio.codPredioBase || predio.codigoPredio || predio.codPredio || predio.id;

                      const selectedId = selectedPredio
                        ? String(selectedPredio.codigoPredio || selectedPredio.codPredio || selectedPredio.id || '').trim()
                        : null;
                      const currentId = String(predioId || '').trim();
                      const isSelected = selectedId !== null && selectedId !== '' && currentId !== '' && selectedId === currentId;

                      return (
                        <Paper
                          key={predioId || index}
                          onClick={() => handleSelectPredio(predio)}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: isSelected 
                              ? `2px solid ${theme.palette.primary.main}` 
                              : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                            bgcolor: isSelected 
                              ? alpha(theme.palette.primary.main, 0.05)
                              : 'background.paper',
                            borderRadius: 2,
                            transition: 'all 0.3s ease-in-out',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.grey[400], 0.15)}`,
                              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                              bgcolor: alpha(theme.palette.primary.main, 0.02)
                            },
                            '&:before': isSelected ? {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: 4,
                              height: '100%',
                              bgcolor: 'primary.main',
                              borderRadius: '0 2px 2px 0'
                            } : {}
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <HomeIcon 
                                sx={{ 
                                  fontSize: 16, 
                                  color: isSelected ? 'primary.main' : 'text.secondary' 
                                }} 
                              />
                              <Chip
                                label={predioId || 'Sin código'}
                                size="small"
                                variant={isSelected ? "filled" : "outlined"}
                                color={isSelected ? "primary" : "default"}
                                sx={{ 
                                  fontWeight: 600,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Stack>
                            <Radio
                              checked={!!isSelected}
                              value={predioId || `predio-mobile-${index}`}
                              size="small"
                              color="primary"
                              sx={{
                                '&.Mui-checked': {
                                  transform: 'scale(1.1)',
                                  color: 'primary.main'
                                }
                              }}
                            />
                          </Stack>

                          <Stack spacing={1.5}>
                            <Box>
                              <Stack direction="row" alignItems="flex-start" spacing={1}>
                                <LocationIcon sx={{ fontSize: 14, color: 'primary.main', mt: 0.3 }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', mb: 0.5 }}>
                                    DIRECCIÓN
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: '0.8rem',
                                      fontWeight: isSelected ? 600 : 500,
                                      lineHeight: 1.3,
                                      color: isSelected ? 'primary.main' : 'text.primary'
                                    }}
                                  >
                                    {typeof predio.direccion === 'string'
                                      ? predio.direccion
                                      : predio.direccion
                                      ? formatPredioDireccion(predio.direccion)
                                      : `Dirección del predio ${predioId}`}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>

                            <Stack 
                              direction="row" 
                              spacing={2} 
                              sx={{ 
                                bgcolor: alpha(theme.palette.grey[50], 0.5),
                                p: 1.5,
                                borderRadius: 1,
                                border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                                  <TerrainIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                    ÁREA
                                  </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                  {predio.areaTerreno?.toFixed(1) || '0.0'} m²
                                </Typography>
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                                  <MoneyIcon sx={{ fontSize: 12, color: 'success.main' }} />
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                    AUTOAVALÚO
                                  </Typography>
                                </Stack>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'success.main'
                                  }}
                                >
                                  {formatCurrency(predio.autoavaluo || 0)}
                                </Typography>
                              </Box>
                            </Stack>

                            {predio.conductor && (
                              <Box>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <PersonIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                      CONDUCTOR
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontSize: '0.8rem',
                                        fontWeight: 500
                                      }}
                                    >
                                      {predio.conductor}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                            )}
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Paginación móvil minimalista */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  flexShrink: 0
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {filteredPredios.length > 0
                      ? `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredPredios.length)} de ${filteredPredios.length}`
                      : 'Sin resultados'
                    }
                  </Typography>

                  <TablePagination
                    component="div"
                    count={filteredPredios.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage=""
                    labelDisplayedRows={() => ''}
                    rowsPerPageOptions={[5, 8, 10]}
                    sx={{
                      '.MuiTablePagination-toolbar': {
                        minHeight: 36,
                        px: 0,
                        display: 'flex',
                        alignItems: 'center'
                      },
                      '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                        display: 'none'
                      },
                      '.MuiTablePagination-select': {
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        mr: 0.5,
                        mt: 0,
                        mb: 0
                      },
                      '.MuiTablePagination-actions': {
                        ml: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0,
                        mb: 0,
                        '& .MuiIconButton-root': {
                          padding: 0.75
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        {/* Botón para seleccionar predio */}
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedPredio}
          sx={{
            px: 4,
            height: '38px',
            textTransform: 'none',
            borderRadius: 1.5,
            minWidth: 140,
            backgroundColor: '#3b82f6 !important', // Azul premium coherente
            color: 'white !important',
            fontWeight: 700,
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#2563eb !important',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
              transform: 'scale(1.02)'
            },
            '&.Mui-disabled': {
              backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
              color: 'rgba(255, 255, 255, 0.7) !important',
              boxShadow: 'none'
            }
          }}
        >
          {selectedPredio ? '✓ Seleccionar' : 'Seleccionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectorPredio;
