// src/components/modal/SelectorDireccionArancel.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  alpha,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Skeleton,
  InputAdornment,
  Chip,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

import { useAranceles } from '../../hooks/useAranceles';
import { ArancelData } from '../../services/arancelService';
import arancelService from '../../services/arancelService';
import { formatCurrency } from '../../utils/formatters';
import { NotificationService } from '../utils/Notification';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

interface SelectorDireccionArancelProps {
  open: boolean;
  onClose: () => void;
  onSelectArancel?: (arancel: ArancelData) => void;
  title?: string;
  useGeneralApi?: boolean;
}

const SelectorDireccionArancel: React.FC<SelectorDireccionArancelProps> = ({
  open,
  onClose,
  onSelectArancel,
  useGeneralApi = true
}) => {
  const theme = useTheme();

  // Hook de aranceles
  const { eliminarArancel } = useAranceles();

  // Estados para selección
  const [selectedArancel, setSelectedArancel] = useState<ArancelData | null>(null);

  // Estados para búsqueda
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [codDireccionBusqueda, setCodDireccionBusqueda] = useState<number | null>(null);
  const [parametroBusqueda, setParametroBusqueda] = useState<string>('');

  // Estados para la tabla
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para datos y carga
  const [arancelesEncontrados, setArancelesEncontrados] = useState<ArancelData[]>([]);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);

  // Función para realizar búsqueda por código de dirección usando GET API (legacy)
  const buscarPorCodDireccion = useCallback(async () => {
    if (anioSeleccionado && codDireccionBusqueda) {
      try {
        setLoadingBusqueda(true);
        console.log(`🔄 [SelectorDireccionArancel] Buscando arancel específico:`);

        const resultados = await arancelService.listarAranceles({
          anio: anioSeleccionado,
          codDireccion: codDireccionBusqueda,
          codUsuario: getAuthenticatedUserCode(),
          parametroBusqueda: 'a'
        });

        console.log('✅ [SelectorDireccionArancel] Resultados encontrados:', resultados);
        setArancelesEncontrados(resultados);

      } catch (error) {
        console.error('❌ [SelectorDireccionArancel] Error en búsqueda:', error);
        setArancelesEncontrados([]);
        NotificationService.error('Error al buscar aranceles');
      } finally {
        setLoadingBusqueda(false);
      }
    }
  }, [anioSeleccionado, codDireccionBusqueda]);

  // Función para realizar búsqueda usando la nueva API general
  const buscarConApiGeneral = useCallback(async () => {
    try {
      setLoadingBusqueda(true);
      console.log('🔄 [SelectorDireccionArancel] Buscando con API general:', { parametroBusqueda, anioSeleccionado });

      // Siempre cargar todos los aranceles primero
      let resultados: ArancelData[] = await arancelService.obtenerTodosAranceles();
      console.log('✅ [SelectorDireccionArancel] Total aranceles cargados:', resultados.length);

      // Filtrar localmente por parámetro de búsqueda si existe
      if (parametroBusqueda.trim() !== '') {
        const searchTerm = parametroBusqueda.trim().toLowerCase();
        console.log('🔍 [SelectorDireccionArancel] Filtrando localmente por:', searchTerm);

        resultados = resultados.filter(arancel => {
          const direccion = (arancel.direccionCompleta || '').toLowerCase();
          const anioStr = String(arancel.anio || '');
          const costo = String(arancel.costoArancel || '');

          return direccion.includes(searchTerm) ||
                 anioStr.includes(searchTerm) ||
                 costo.includes(searchTerm);
        });

        console.log(`🔍 [SelectorDireccionArancel] Resultados filtrados por "${searchTerm}":`, resultados.length);
      }

      // Filtrar por año si está seleccionado
      if (anioSeleccionado !== null && anioSeleccionado > 0 && resultados.length > 0) {
        const resultadosFiltrados = resultados.filter(arancel => arancel.anio === anioSeleccionado);
        console.log(`🔍 [SelectorDireccionArancel] Filtrado por año ${anioSeleccionado}: ${resultadosFiltrados.length} de ${resultados.length}`);
        resultados = resultadosFiltrados;
      }

      setArancelesEncontrados(resultados);
      setPage(0); // Resetear a la primera página cuando se filtra

    } catch (error) {
      console.error('❌ [SelectorDireccionArancel] Error en búsqueda con API general:', error);
      setArancelesEncontrados([]);
      NotificationService.error('Error al buscar aranceles');
    } finally {
      setLoadingBusqueda(false);
    }
  }, [parametroBusqueda, anioSeleccionado]);

  // Efecto para cargar aranceles iniciales cuando se abre el modal
  useEffect(() => {
    if (open) {
      const cargarArancelesIniciales = async () => {
        try {
          setLoadingBusqueda(true);
          console.log('🔄 [SelectorDireccionArancel] Cargando aranceles iniciales...');

          if (useGeneralApi) {
            let resultados = await arancelService.obtenerTodosAranceles();

            if (anioSeleccionado !== null && anioSeleccionado > 0) {
              resultados = resultados.filter(arancel => arancel.anio === anioSeleccionado);
            }

            setArancelesEncontrados(resultados);
          } else {
            const resultados = await arancelService.listarAranceles({
              codDireccion: undefined,
              anio: undefined,
              parametroBusqueda: '',
              codUsuario: getAuthenticatedUserCode()
            });
            setArancelesEncontrados(resultados);
          }

          console.log('✅ [SelectorDireccionArancel] Aranceles iniciales cargados');
        } catch (error) {
          console.error('❌ [SelectorDireccionArancel] Error cargando aranceles iniciales:', error);
          setArancelesEncontrados([]);
        } finally {
          setLoadingBusqueda(false);
        }
      };

      cargarArancelesIniciales();
    }
  }, [open, useGeneralApi]);

  // Efecto para recargar cuando cambia el año o parámetro de búsqueda
  useEffect(() => {
    if (open && useGeneralApi) {
      const timer = setTimeout(() => {
        buscarConApiGeneral();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [parametroBusqueda, anioSeleccionado, open, useGeneralApi, buscarConApiGeneral]);

  // Paginación
  const arancelesPaginados = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return arancelesEncontrados.slice(start, end);
  }, [arancelesEncontrados, page, rowsPerPage]);

  // Handlers de paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handler para selección de arancel
  const handleRowClick = (arancel: ArancelData) => {
    setSelectedArancel(arancel);
  };

  const handleConfirmSelection = () => {
    if (selectedArancel && onSelectArancel) {
      onSelectArancel(selectedArancel);
    }
    onClose();
  };

  const handleClose = () => {
    setSelectedArancel(null);
    setParametroBusqueda('');
    setAnioSeleccionado(null);
    setCodDireccionBusqueda(null);
    setPage(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '70vh',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: theme.shadows[20],
        }
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 3,
        pb: 2,
        background: alpha(theme.palette.primary.main, 0.02),
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 36,
            height: 36
          }}>
            <AssignmentIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="primary.main">
              {useGeneralApi ? 'Lista de Aranceles - API General' : 'Lista de Aranceles'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {useGeneralApi
                ? 'Búsqueda avanzada por sector, barrio, calle y dirección completa'
                : 'Los aranceles se cargan por año y muestran los costos por dirección'
              }
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Contenido principal */}
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 3, pb: 2 }}>
          {/* Controles de búsqueda */}
          <Stack spacing={3} mb={2}>
            {useGeneralApi ? (
              /* Búsqueda con API general */
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                {/* Campo de búsqueda general */}
                <Box sx={{
                  flex: { xs: '1 1 100%', sm: '1 1 calc(60% - 8px)' },
                  minWidth: { xs: '100%', sm: '250px' }
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Buscar Aranceles"
                    value={parametroBusqueda}
                    onChange={(e) => {
                      setParametroBusqueda(e.target.value);
                      setPage(0);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'action.active' }} />
                        </InputAdornment>
                      )
                    }}
                    placeholder="Buscar por sector, barrio, calle..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        buscarConApiGeneral();
                      }
                    }}
                  />
                </Box>

                {/* Año */}
                <Box sx={{
                  flex: { xs: '1 1 100%', sm: '0 0 120px' },
                  minWidth: { xs: '100%', sm: '120px' }
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Año"
                    type="number"
                    value={anioSeleccionado || ''}
                    onChange={(e) => {
                      const newYear = parseInt(e.target.value) || null;
                      setAnioSeleccionado(newYear);
                      setPage(0);
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1900,
                        max: new Date().getFullYear()
                      }
                    }}
                  />
                </Box>

                {/* Botón de búsqueda */}
                <Box sx={{ flex: '0 0 auto' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loadingBusqueda ? <CircularProgress size={16} /> : <SearchIcon />}
                    onClick={buscarConApiGeneral}
                    disabled={loadingBusqueda}
                    sx={{
                      height: 40,
                      minWidth: 100,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Buscar
                  </Button>
                </Box>
              </Box>
            ) : (
              /* Búsqueda por año y código de dirección (legacy) */
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                {/* Año */}
                <Box sx={{
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '0 0 120px' },
                  minWidth: { xs: '100%', md: '120px' }
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Año"
                    type="number"
                    value={anioSeleccionado || ''}
                    onChange={(e) => {
                      const newYear = parseInt(e.target.value) || null;
                      setAnioSeleccionado(newYear);
                      setPage(0);
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1900,
                        max: new Date().getFullYear()
                      }
                    }}
                    required
                  />
                </Box>

                {/* Código de dirección */}
                <Box sx={{
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '0 0 150px' },
                  minWidth: { xs: '100%', md: '150px' }
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Código Dirección"
                    type="number"
                    value={codDireccionBusqueda || ''}
                    onChange={(e) => {
                      const newCodDireccion = parseInt(e.target.value) || null;
                      setCodDireccionBusqueda(newCodDireccion);
                      setPage(0);
                    }}
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                    placeholder="Ej: 4"
                    required
                  />
                </Box>

                {/* Botón de búsqueda */}
                <Box sx={{ flex: '0 0 auto' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loadingBusqueda ? <CircularProgress size={16} /> : <SearchIcon />}
                    onClick={buscarPorCodDireccion}
                    disabled={loadingBusqueda || !anioSeleccionado || !codDireccionBusqueda}
                    sx={{
                      height: 40,
                      minWidth: 100,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Buscar
                  </Button>
                </Box>
              </Box>
            )}

            {/* Mensaje informativo */}
            {useGeneralApi ? (
              arancelesEncontrados.length === 0 && !loadingBusqueda && (
                <Alert
                  severity="info"
                  icon={<SearchIcon />}
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Use la búsqueda general para encontrar aranceles por sector, barrio, calle o deje vacío para ver todos.
                </Alert>
              )
            ) : (
              (!anioSeleccionado || !codDireccionBusqueda) && (
                <Alert
                  severity="info"
                  icon={<SearchIcon />}
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Ingrese el año y código de dirección para buscar aranceles específicos.
                </Alert>
              )
            )}
          </Stack>
        </Box>

        {/* Tabla de aranceles */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 3, pb: 2 }}>
          {loadingBusqueda ? (
            <Box sx={{ p: 2 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  height={60}
                  sx={{ mb: 1, borderRadius: 1 }}
                  animation="wave"
                />
              ))}
            </Box>
          ) : (useGeneralApi ? arancelesEncontrados.length > 0 : anioSeleccionado && codDireccionBusqueda && arancelesEncontrados.length > 0) ? (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                maxHeight: { xs: 250, sm: 300, md: 350 },
                overflowY: 'auto',
                overflowX: 'auto',
                '& .MuiTable-root': {
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  minWidth: { xs: 500, sm: 600, md: 700 }
                },
                '&::-webkit-scrollbar': {
                  width: 8,
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: alpha(theme.palette.grey[200], 0.5),
                  borderRadius: 2,
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.5),
                  }
                }
              }}
            >
              <Table size="medium" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        bgcolor: 'background.paper',
                        borderBottom: 2,
                        borderColor: 'divider',
                        width: 100
                      }}
                    >
                      Año
                    </TableCell>
                    {useGeneralApi && (
                      <TableCell sx={{
                        fontWeight: 600,
                        bgcolor: 'background.paper',
                        borderBottom: 2,
                        borderColor: 'divider'
                      }}>
                        Dirección Completa
                      </TableCell>
                    )}
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        bgcolor: 'background.paper',
                        borderBottom: 2,
                        borderColor: 'divider',
                        width: 150
                      }}
                    >
                      Costo Arancel
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arancelesPaginados.map((arancel, index) => {
                    // Comparación estricta para evitar que múltiples filas se seleccionen
                    const isSelected = selectedArancel !== null &&
                      selectedArancel !== undefined &&
                      (
                        // Si ambos tienen codArancel válido, comparar por codArancel
                        (selectedArancel.codArancel && arancel.codArancel && selectedArancel.codArancel === arancel.codArancel) ||
                        // Si no tienen codArancel, comparar por combinación única de campos
                        (!selectedArancel.codArancel && !arancel.codArancel &&
                          selectedArancel.anio === arancel.anio &&
                          selectedArancel.codDireccion === arancel.codDireccion &&
                          selectedArancel.costoArancel === arancel.costoArancel)
                      );
                    return (
                      <Fade in={true} key={arancel.codArancel || `${arancel.anio}-${arancel.codDireccion}-${index}`}>
                        <TableRow
                          hover
                          selected={isSelected}
                          onClick={() => handleRowClick(arancel)}
                          sx={{
                            cursor: 'pointer',
                            '&:nth-of-type(even)': {
                              bgcolor: alpha(theme.palette.primary.main, 0.02)
                            },
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.12),
                              transform: 'scale(1.005)',
                              transition: 'all 0.2s ease'
                            },
                            '&.Mui-selected': {
                              bgcolor: alpha(theme.palette.primary.main, 0.15),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.20),
                              }
                            }
                          }}
                        >
                          <TableCell align="center">
                            <Chip
                              label={arancel.anio}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          {useGeneralApi && (
                            <TableCell sx={{ minWidth: '300px' }}>
                              <Typography variant="body2" sx={{
                                whiteSpace: 'nowrap',
                                fontWeight: 500
                              }}>
                                {arancel.direccionCompleta || 'N/A'}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell align="right">
                            <Chip
                              label={formatCurrency(arancel.costoArancel)}
                              color="success"
                              size="small"
                              icon={<MoneyIcon />}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        </TableRow>
                      </Fade>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (useGeneralApi && arancelesEncontrados.length === 0) || (anioSeleccionado && codDireccionBusqueda && arancelesEncontrados.length === 0) ? (
            <Alert
              severity="warning"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: 'warning.main'
                }
              }}
            >
              {useGeneralApi
                ? 'No se encontraron aranceles con los criterios de búsqueda especificados'
                : `No se encontraron aranceles para el año ${anioSeleccionado} y código de dirección ${codDireccionBusqueda}`
              }
            </Alert>
          ) : null}
        </Box>

        {/* Paginación */}
        {((useGeneralApi && arancelesEncontrados.length > 0) || (anioSeleccionado && codDireccionBusqueda && arancelesEncontrados.length > 0)) && (
          <Box sx={{
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            px: 2
          }}>
            <TablePagination
              component="div"
              count={arancelesEncontrados.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  px: 0
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 500
                }
              }}
            />
          </Box>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          background: alpha(theme.palette.grey[50], 0.8),
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {selectedArancel
            ? `Seleccionado: ${selectedArancel.direccionCompleta || `Año ${selectedArancel.anio}`} - ${formatCurrency(selectedArancel.costoArancel)}`
            : (useGeneralApi
                ? 'Tip: Use la búsqueda general para encontrar aranceles por cualquier criterio'
                : 'Tip: Seleccione un año para ver los aranceles disponibles'
              )
          }
        </Typography>

        <Stack direction="row" spacing={2}>
          {/* Botón para cancelar selección */}
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              minWidth: 100,
              height: '36px',
              fontWeight: 600,
              borderColor: theme.palette.divider,
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              }
            }}
          >
            Cancelar
          </Button>
          {/* Botón para seleccionar arancel */}
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            disabled={!selectedArancel}
            sx={{
              backgroundColor: '#3b82f6 !important', // Azul premium coherente
              color: 'white !important',
              fontWeight: 700,
              height: '36px',
              textTransform: 'none',
              borderRadius: 1.5,
              minWidth: 120,
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
            Seleccionar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default SelectorDireccionArancel;
