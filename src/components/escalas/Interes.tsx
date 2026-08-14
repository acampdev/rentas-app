// src/components/escalas/Interes.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Percent as PercentIcon
} from '@mui/icons-material';
import { useInteres } from '../../hooks/useInteres';
import { InteresData } from '../../models/Interes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`interes-tab-${index}`}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Interes: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Estados locales para el formulario de registro/edición
  const [codInteres, setCodInteres] = useState<string>('');
  const [anioForm, setAnioForm] = useState<string>(new Date().getFullYear().toString());
  const [tasa, setTasa] = useState<string>('');
  const [codTipo, setCodTipo] = useState<string>('');
  const [codClase, setCodClase] = useState<string>('');
  const [isEditingForm, setIsEditingForm] = useState<boolean>(false);

  const {
    intereses,
    loading,
    error,
    anio,
    setAnio,
    crearInteres,
    actualizarInteres,
    eliminarInteres,
    isCreating,
    isUpdating,
    isDeleting
  } = useInteres();

  const [searchAnio, setSearchAnio] = useState<number>(anio);

  useEffect(() => {
    setSearchAnio(anio);
  }, [anio]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setAnio(searchAnio);
    }
  };

  const handleEditClick = (item: InteresData) => {
    setCodInteres(item.codInteres.toString());
    setAnioForm(item.anio.toString());
    setTasa(item.tasa.toString());
    setCodTipo(item.codTipo);
    setCodClase(item.codClase);
    setIsEditingForm(true);
    setTabValue(1); // Cambiar a la pestaña de registro/formulario
  };

  const handleNewClick = () => {
    setCodInteres('');
    setAnioForm(new Date().getFullYear().toString());
    setTasa('');
    setCodTipo('');
    setCodClase('');
    setIsEditingForm(false);
  };

  const handleSave = async () => {
    if (!anioForm || !tasa || !codTipo || !codClase) {
      return;
    }

    const payload = {
      codInteres: parseInt(codInteres) || 0,
      anio: parseInt(anioForm),
      tasa: parseFloat(tasa),
      codTipo,
      codClase
    };

    try {
      if (isEditingForm) {
        await actualizarInteres(payload);
      } else {
        await crearInteres(payload);
      }
      
      // Actualizar vista de consulta con el año ingresado y limpiar
      setAnio(payload.anio);
      setTabValue(0);
      handleNewClick();
    } catch {
      // Los errores se manejan y muestran mediante NotificationService en el hook
    }
  };

  const handleDeleteClick = async (item: InteresData) => {
    if (window.confirm(`¿Está seguro de eliminar el interés con código ${item.codInteres} del año ${item.anio}?`)) {
      try {
        await eliminarInteres({
          codInteres: item.codInteres,
          anio: item.anio,
          tasa: item.tasa,
          codTipo: item.codTipo,
          codClase: item.codClase
        });
      } catch {
        // Errores ya manejados por el hook
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    if (estado === '0001') return '#10b981'; // Verde (Activo)
    return '#6b7280'; // Gris
  };

  const getEstadoLabel = (estado: string) => {
    if (estado === '0001') return 'ACTIVO';
    return estado || 'INACTIVO';
  };

  const isFormInvalid = !anioForm || !tasa || !codTipo || !codClase || (!isEditingForm && !codInteres);

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab icon={<SearchIcon />} iconPosition="start" label="Consultar Interés" />
          <Tab icon={<SaveIcon />} iconPosition="start" label={isEditingForm ? "Modificar Interés" : "Registrar Interés"} />
        </Tabs>
      </Box>

      {/* TAB 1: CONSULTAR */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ px: 3 }}>
          <Stack spacing={3}>
            {/* FILTROS DE BÚSQUEDA */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center', 
              bgcolor: alpha(theme.palette.grey[100], 0.5), 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
            }}>
              <Box sx={{ width: '150px', flexShrink: 0 }}>
                <TextField 
                  fullWidth
                  label="Filtrar por Año" 
                  type="number" 
                  value={searchAnio} 
                  onChange={(e) => setSearchAnio(parseInt(e.target.value) || new Date().getFullYear())} 
                  onKeyPress={handleKeyPress}
                  size="small" 
                />
              </Box>

              <Button 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />} 
                onClick={() => setAnio(searchAnio)}
                disabled={loading}
                style={{ 
                  backgroundColor: '#3b82f6', // Azul para consulta
                  color: 'white',
                  fontWeight: 700,
                  height: '40px',
                  minWidth: '120px'
                }}
                sx={{ textTransform: 'none' }}
              >
                Buscar
              </Button>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            {/* TABLA DE RESULTADOS */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 1.5, 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DashboardIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                  TABLA DE INTERESES POR AÑO Y CLASIFICACIÓN
                </Typography>
              </Box>

              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>CÓD. INTERÉS</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>AÑO</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>TASA (%)</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>CÓD. TIPO</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>CÓD. CLASE</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ESTADO</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ACCIONES</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading || isDeleting ? (
                      <TableRow><TableCell colSpan={7} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                    ) : intereses.length > 0 ? (
                      intereses.map((item, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{item.codInteres}</TableCell>
                          <TableCell>{item.anio}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <Typography variant="body2" fontWeight={700}>{item.tasa}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{item.codTipo}</TableCell>
                          <TableCell>{item.codClase}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={getEstadoLabel(item.codEstado || '')} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontWeight: 600,
                                borderColor: getEstadoColor(item.codEstado || ''),
                                color: getEstadoColor(item.codEstado || ''),
                                bgcolor: alpha(getEstadoColor(item.codEstado || ''), 0.05)
                              }} 
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Editar">
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={() => handleEditClick(item)}
                                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => handleDeleteClick(item)}
                                  sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                          <Typography color="text.secondary">No se encontraron intereses registrados para el año {anio}</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        </Box>
      </TabPanel>

      {/* TAB 2: REGISTRAR / MODIFICAR */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ px: 3 }}>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <TextField 
                  label="Cód. Interés" 
                  type="number" 
                  size="small" 
                  value={codInteres} 
                  onChange={(e) => setCodInteres(e.target.value)} 
                  disabled={isEditingForm}
                  fullWidth
                  required
                />
                
                <TextField 
                  label="Año Fiscal" 
                  type="number" 
                  size="small" 
                  value={anioForm} 
                  onChange={(e) => setAnioForm(e.target.value)} 
                  fullWidth
                  required
                />
                
                <TextField 
                  label="Tasa (%)" 
                  type="number" 
                  size="small" 
                  value={tasa} 
                  onChange={(e) => setTasa(e.target.value)} 
                  InputProps={{
                    endAdornment: <PercentIcon fontSize="small" color="action" />
                  }}
                  fullWidth
                  required
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <TextField 
                  label="Código Tipo" 
                  size="small" 
                  value={codTipo} 
                  onChange={(e) => setCodTipo(e.target.value)} 
                  fullWidth
                  required
                />
                
                <TextField 
                  label="Código Clase" 
                  size="small" 
                  value={codClase} 
                  onChange={(e) => setCodClase(e.target.value)} 
                  fullWidth
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={handleNewClick}
                  disabled={isCreating || isUpdating}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Nuevo
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={(isCreating || isUpdating) ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                  onClick={handleSave} 
                  disabled={isCreating || isUpdating || isFormInvalid}
                  style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 700, minWidth: '150px' }}
                  sx={{ textTransform: 'none' }}
                >
                  {isEditingForm ? "Modificar" : "Guardar"}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default Interes;
