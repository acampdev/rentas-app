// src/components/caja/mantenedores/Cajas.tsx
import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AppRegistration as RegistrationIcon,
  FindInPage as FindIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useMantenedorCaja } from '../../../hooks/useMantenedorCaja';
import { NotificationService } from '../../utils/Notification';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cajas-tabpanel-${index}`}
      aria-labelledby={`cajas-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Cajas: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  // Estados para Registro
  const [descripcionRegistro, setDescripcionRegistro] = useState('');
  const [editandoCaja, setEditandoCaja] = useState<any>(null);

  // Estados para Consulta
  const [descripcionBusqueda, setDescripcionBusqueda] = useState('');
  const [codUsuarioBusqueda, setCodUsuarioBusqueda] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Hook de mantenedor de cajas
  const {
    cajas,
    loading,
    crearCaja,
    actualizarCaja,
    eliminarCaja,
    buscarCajas
  } = useMantenedorCaja();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Handler para guardar o actualizar caja
  const handleGuardar = async () => {
    if (!descripcionRegistro.trim()) {
      NotificationService.warning('Por favor ingrese una descripción');
      return;
    }

    if (editandoCaja) {
      const resultado = await actualizarCaja({
        codCaja: editandoCaja.codCaja,
        descripcion: descripcionRegistro
      });

      if (resultado) {
        setDescripcionRegistro('');
        setEditandoCaja(null);
        setValue(1); // Cambiar a la pestaña de consulta para ver el cambio
      }
    } else {
      console.log('[Cajas] Iniciando crearCaja con descripcion:', descripcionRegistro);
      const resultado = await crearCaja({
        descripcion: descripcionRegistro
      });
      console.log('[Cajas] Resultado de crearCaja:', resultado);

      if (resultado) {
        console.log('[Cajas] Caja creada con éxito. Cambiando a pestaña de consulta (index 1)');
        setDescripcionRegistro('');
        setValue(1); // Cambiar a la pestaña de consulta para ver el cambio
      } else {
        console.warn('[Cajas] No se pudo crear la caja (resultado es falsy)');
      }
    }
  };

  // Handler para limpiar formulario de registro
  const handleNuevoRegistro = () => {
    setDescripcionRegistro('');
    setEditandoCaja(null);
  };

  // Handler para buscar cajas
  const handleBuscar = async () => {
    const params: any = {};

    if (descripcionBusqueda) {
      params.descripcion = descripcionBusqueda;
    }

    if (codUsuarioBusqueda) {
      params.codUsuario = Number(codUsuarioBusqueda);
    }

    setPage(0);
    await buscarCajas(params);
  };

  // Handler para limpiar filtros de búsqueda
  const handleNuevoBusqueda = () => {
    setDescripcionBusqueda('');
    setCodUsuarioBusqueda('');
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleEditClick = (caja: any) => {
    setDescripcionRegistro(caja.descripcion);
    setEditandoCaja(caja);
    setValue(0); // Cambiar a la pestaña de registro
  };

  const handleDeleteClick = async (caja: any) => {
    if (window.confirm(`¿Está seguro de eliminar la caja "${caja.descripcion}"?`)) {
      await eliminarCaja(caja.codCaja);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const lastPage = Math.max(0, Math.ceil(cajas.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, lastPage);
  const cajasPaginadas = cajas.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={2} sx={{ width: '100%', minWidth: 0, borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="cajas tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab
            label="Registro Cajas"
            icon={<RegistrationIcon />}
            iconPosition="start"
          />
          <Tab
            label="Consulta Cajas"
            icon={<FindIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab: Registro Cajas */}
      <TabPanel value={value} index={0}>
        <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' } }}>
              {/* Descripcion Caja - Ancho a la mitad */}
              <TextField
                label="Descripción Caja"
                value={descripcionRegistro}
                onChange={(e) => setDescripcionRegistro(e.target.value)}
                size="small"
                disabled={loading}
                placeholder="Ingrese descripción de la caja"
                sx={{ width: { xs: '100%', sm: 300 } }}
              />

              {/* Botones alineados vertical y horizontalmente */}
              {/* Boton Nuevo */}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleNuevoRegistro}
                disabled={loading}
                sx={{ width: { xs: '100%', sm: 'auto' }, textTransform: 'none', fontWeight: 600, height: '40px' }}
              >
                Nuevo
              </Button>
              {/* Boton Guardar */}
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleGuardar}
                disabled={loading || !descripcionRegistro.trim()}
                style={{ 
                  backgroundColor: '#10b981', // Verde
                  color: 'white', 
                  fontWeight: 700, 
                  minWidth: '120px',
                  height: '40px'
                }}
                sx={{ width: { xs: '100%', sm: 'auto' }, textTransform: 'none' }}
              >
                {editandoCaja ? 'Actualizar' : 'Guardar'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </TabPanel>

      {/* Tab: Consulta Cajas */}
      <TabPanel value={value} index={1}>
        <Box sx={{ px: { xs: 0, sm: 0.5, md: 1 }, minWidth: 0 }}>
          <Stack spacing={3}>
            {/* Filtros de búsqueda estilo unificado */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'minmax(220px, 1fr) minmax(150px, 0.65fr)',
                md: 'minmax(250px, 1fr) minmax(150px, 180px) auto auto'
              },
              gap: 2, 
              alignItems: 'center', 
              bgcolor: alpha(theme.palette.grey[100], 0.5), 
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
            }}>
              {/* Descripcion */}
              <Box sx={{ width: '100%', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={descripcionBusqueda}
                  onChange={(e) => setDescripcionBusqueda(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="small"
                  disabled={loading}
                  placeholder="Buscar por descripción"
                />
              </Box>

              {/* Codigo Usuario */}
              <Box sx={{ width: '100%', minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Cod. Usuario"
                  value={codUsuarioBusqueda}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCodUsuarioBusqueda(value);
                  }}
                  onKeyPress={handleKeyPress}
                  size="small"
                  disabled={loading}
                  placeholder="Solo números"
                  inputProps={{
                    pattern: '[0-9]*',
                    inputMode: 'numeric'
                  }}
                />
              </Box>

              {/* Botón Buscar Visible */}
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                onClick={handleBuscar}
                disabled={loading}
                style={{ 
                  backgroundColor: '#3b82f6', // Azul para consulta
                  color: 'white',
                  fontWeight: 700,
                  height: '40px',
                  minWidth: '120px'
                }}
                sx={{ width: { xs: '100%', md: 'auto' }, textTransform: 'none' }}
              >
                Buscar
              </Button>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleNuevoBusqueda}
                disabled={loading}
                sx={{ width: { xs: '100%', md: 'auto' }, textTransform: 'none', fontWeight: 600, height: '40px' }}
              >
                Limpiar
              </Button>
            </Box>

            {/* Tabla de resultados estilo unificado */}
            <Paper variant="outlined" sx={{ minWidth: 0, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 1.5, 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap'
              }}>
                <DashboardIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                  TABLA DE CAJAS REGISTRADAS
                </Typography>
              </Box>

              <TableContainer
                sx={{
                  maxHeight: { xs: 360, sm: 440, md: 500 },
                  overflowY: 'auto',
                  overflowX: 'auto',
                  scrollbarGutter: 'stable',
                  '&::-webkit-scrollbar': { width: 8, height: 8 },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: alpha(theme.palette.text.primary, 0.25),
                    borderRadius: 4
                  },
                  '&::-webkit-scrollbar-track': {
                    bgcolor: alpha(theme.palette.text.primary, 0.05)
                  }
                }}
              >
                <Table stickyHeader size="small" sx={{ minWidth: 760 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>COD. CAJA</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>DESCRIPCIÓN</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>USUARIO</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>NUM. CAJA</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ESTADO</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ACCIONES</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                    ) : cajas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Typography color="text.secondary">
                            No se encontraron cajas registradas para los filtros especificados
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cajasPaginadas.map((caja) => (
                        <TableRow key={caja.codCaja} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{caja.codCaja}</TableCell>
                          <TableCell>{caja.descripcion}</TableCell>
                          <TableCell>{caja.usuario || '-'}</TableCell>
                          <TableCell>{caja.numcaja}</TableCell>
                          <TableCell>
                            <Chip
                              label={caja.estado}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontWeight: 600,
                                borderColor: caja.estado === 'DISPONIBLE' ? '#10b981' : '#6b7280',
                                color: caja.estado === 'DISPONIBLE' ? '#10b981' : '#6b7280',
                                bgcolor: alpha(caja.estado === 'DISPONIBLE' ? '#10b981' : '#6b7280', 0.05)
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditClick(caja)}
                                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(caja)}
                                  sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={cajas.length}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  '& .MuiTablePagination-toolbar': {
                    minHeight: 52,
                    px: { xs: 1, sm: 2 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    gap: { xs: 0.5, sm: 1 }
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    my: 0
                  }
                }}
              />
            </Paper>
          </Stack>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default Cajas;
