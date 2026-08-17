// src/components/caja/AsignacionCaja.tsx
import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
  Alert,
  Autocomplete
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Today as TodayIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

// Hooks
import { useAsignacionCajas } from '../../hooks/useAsignacionCajas';
import { useTurnos } from '../../hooks/useTurnos';
import { useCajas } from '../../hooks/useCajas';
import { useUsuarios } from '../../hooks/useUsuarios';
import { NotificationService } from '../utils/Notification';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AsignacionCaja: React.FC = () => {
  const theme = useTheme();

  // Tabs state
  const [value, setValue] = useState(0);

  // Form states
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedCajero, setSelectedCajero] = useState<number | ''>('');
  const [selectedCaja, setSelectedCaja] = useState<number | ''>('');
  const [selectedTurno, setSelectedTurno] = useState<number | ''>('');
  
  // Edit mode state
  const [editandoAsignacion, setEditandoAsignacion] = useState<any | null>(null);

  // Search states
  const [searchDate, setSearchDate] = useState<Date | null>(new Date());
  const [searchTermino, setSearchTermino] = useState('');
  const [searchCodUsuario, setSearchCodUsuario] = useState('');

  // Hook asignaciones
  const {
    asignaciones,
    loading: loadingAsignaciones,
    crearAsignacion,
    actualizarAsignacion,
    eliminarAsignacion,
    buscarAsignaciones
  } = useAsignacionCajas();

  // Hook turnos
  const {
    turnos,
    loading: loadingTurnos
  } = useTurnos();

  // Hook cajas (dinámico)
  const {
    cajas,
    loading: loadingCajas
  } = useCajas();

  // Hook usuarios (dinámico)
  const {
    usuarios,
    loading: loadingUsuarios
  } = useUsuarios();

  // Filtrar cajas y usuarios activos para el formulario
  const cajasActivas = cajas.filter(c => {
    const est = c.estado?.trim().toUpperCase();
    return est === 'ACTIVO' || est === 'DISPONIBLE' || c.codCaja === selectedCaja || !c.estado;
  });
  const usuariosCajeros = usuarios.filter(
    u => u.rol?.trim().toLowerCase() === 'cajero' && (u.estado === 'ACTIVO' || u.codUsuario === selectedCajero)
  );
  const selectedCajeroObj = usuariosCajeros.find(u => u.codUsuario === selectedCajero) || null;
  const selectedCajaObj = cajasActivas.find(c => c.codCaja === selectedCaja) || null;

  // Parser seguro para fechas de string
  const parseFechaStr = (str: string): Date => {
    if (!str) return new Date();
    const parts = str.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(str);
  };

  // Handler para buscar asignaciones con filtros
  const handleBuscar = async () => {
    const params: any = {};

    if (searchTermino) {
      params.terminoBusqueda = searchTermino;
    }

    if (searchDate) {
      params.fecha = format(searchDate, 'yyyy-MM-dd');
    }

    if (searchCodUsuario) {
      params.codUsuario = Number(searchCodUsuario);
    }

    await buscarAsignaciones(params);
  };

  const handleNuevaBusqueda = () => {
    setSearchTermino('');
    setSearchDate(new Date());
    setSearchCodUsuario('');
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLimpiarFormulario = () => {
    setSelectedCajero('');
    setSelectedCaja('');
    setSelectedTurno('');
    setSelectedDate(new Date());
    setEditandoAsignacion(null);
  };

  const handleGuardarAsignacion = async () => {
    if (!selectedCajero || !selectedCaja || !selectedTurno || !selectedDate) {
      NotificationService.warning('Por favor complete todos los campos');
      return;
    }

    const fechaStr = format(selectedDate, 'yyyy-MM-dd');

    // Obtener el usuario logeado desde localStorage
    const userStr = sessionStorage.getItem('auth_user');
    let loggedUserId: number | undefined = undefined;
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.id) {
          loggedUserId = Number(userObj.id);
        }
      } catch (e) {
        console.error('[AsignacionCaja] Error al parsear auth_user:', e);
      }
    }

    if (editandoAsignacion) {
      // Flujo de Actualización (PUT)
      const resultado = await actualizarAsignacion({
        codAsignacionCaja: editandoAsignacion.codAsignacionCaja,
        codUsuario: Number(selectedCajero),
        codCaja: Number(selectedCaja),
        codTurno: Number(selectedTurno),
        usuario: loggedUserId
      });

      if (resultado) {
        handleLimpiarFormulario();
        setValue(1); // Cambiar a la pestaña de consultas para ver el resultado
      }
    } else {
      // Flujo de Creación (POST)
      const resultado = await crearAsignacion({
        codUsuario: Number(selectedCajero),
        codCaja: Number(selectedCaja),
        codTurno: Number(selectedTurno),
        fecha: fechaStr,
        usuario: loggedUserId
      });

      if (resultado) {
        handleLimpiarFormulario();
        setValue(1); // Cambiar a la pestaña de consultas para ver el resultado
      }
    }
  };

  const handleEditClick = (asignacion: any) => {
    setEditandoAsignacion(asignacion);
    setSelectedCajero(asignacion.codUsuario || '');
    setSelectedCaja(asignacion.codCaja || '');
    setSelectedTurno(asignacion.codTurno || '');
    
    if (asignacion.fechaStr) {
      setSelectedDate(parseFechaStr(asignacion.fechaStr));
    } else if (asignacion.fecha) {
      setSelectedDate(new Date(asignacion.fecha));
    }
    
    setValue(0); // Cambiar a la pestaña de formulario
  };

  const handleEliminarAsignacion = async (codAsignacionCaja: number) => {
    const confirmacion = window.confirm('¿Está seguro de eliminar esta asignación?');
    if (confirmacion) {
      // Obtener el usuario logeado desde localStorage
      const userStr = sessionStorage.getItem('auth_user');
      let loggedUserId: number | undefined = undefined;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.id) {
            loggedUserId = Number(userObj.id);
          }
        } catch (e) {
          console.error('[AsignacionCaja] Error al parsear auth_user:', e);
        }
      }
      await eliminarAsignacion(codAsignacionCaja, loggedUserId);
    }
  };

  const headerStyle = {
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    py: 1.5,
    px: 1,
    whiteSpace: 'nowrap' as const
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 0 }}>
        <Paper 
          elevation={3}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            mb: 3
          }}
        >
          <Box sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              }}>
                <ReceiptIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Asignación de Caja
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestión de Asignaciones de Cajeros, Cajas y Turnos de Atención
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <Tabs value={value} onChange={handleChange} aria-label="asignacion tabs">
              <Tab
                label={editandoAsignacion ? "Editar Asignación" : "Asignar Cajero"}
                icon={<PersonIcon />}
                iconPosition="start"
                sx={{ fontWeight: 600 }}
              />
              <Tab
                label="Cajeros Asignados"
                icon={<TodayIcon />}
                iconPosition="start"
                sx={{ fontWeight: 600 }}
              />
            </Tabs>
          </Box>

          {/* Nueva Asignacion / Edición de Cajero */}
          <TabPanel value={value} index={0}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.grey[100], 0.3), borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 3 }}>
                {editandoAsignacion ? "Modificar Datos de Asignación" : "Detalles de la Nueva Asignación"}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: 2, 
                alignItems: 'center',
                width: '100%',
                overflowX: 'auto',
                pb: 1
              }}>
                {/* Fecha */}
                <Box sx={{ 
                  flex: '0 0 160px', 
                  minWidth: '160px', 
                  m: 0, 
                  p: 0 
                }}>
                  <DatePicker
                    label="Fecha Asignación"
                    value={selectedDate}
                    onChange={(newValue: any) => setSelectedDate(newValue)}
                    disabled={!!editandoAsignacion}
                    sx={{ width: '100%', m: 0 }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        margin: 'none',
                        fullWidth: true,
                        sx: {
                          m: 0,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            height: 40,
                            bgcolor: editandoAsignacion ? alpha(theme.palette.grey[200], 0.5) : 'white',
                          }
                        }
                      }
                    }}
                  />
                </Box>
                {/* Cajero */}
                <Autocomplete
                  size="small"
                  options={usuariosCajeros}
                  loading={loadingUsuarios}
                  value={selectedCajeroObj}
                  onChange={(_event, newValue) => {
                    setSelectedCajero(newValue ? newValue.codUsuario : '');
                  }}
                  getOptionLabel={(option) => `${option.nombrePersona} (${option.username?.trim()})`}
                  isOptionEqualToValue={(option, value) => option.codUsuario === value.codUsuario}
                  sx={{ 
                    flex: '1 1 250px', 
                    minWidth: '180px',
                    m: 0,
                    p: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 40,
                      bgcolor: 'white',
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cajero"
                      placeholder="Seleccionar cajero..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingUsuarios ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />

                {/* Caja */}
                <Autocomplete
                  size="small"
                  options={cajasActivas}
                  loading={loadingCajas}
                  value={selectedCajaObj}
                  onChange={(_event, newValue) => {
                    setSelectedCaja(newValue ? newValue.codCaja : '');
                  }}
                  getOptionLabel={(option) => option.numcaja || ''}
                  isOptionEqualToValue={(option, value) => option.codCaja === value.codCaja}
                  sx={{ 
                    flex: '1 1 180px', 
                    minWidth: '130px',
                    m: 0,
                    p: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 40,
                      bgcolor: 'white',
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Caja"
                      placeholder="Seleccionar caja..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingCajas ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />

                {/* Turno */}
                <FormControl 
                  size="small" 
                  margin="none"
                  sx={{ 
                    flex: '1 1 180px', 
                    minWidth: '130px',
                    m: 0,
                    p: 0
                  }}
                >
                  <InputLabel>Turno</InputLabel>
                  <Select
                    value={selectedTurno}
                    onChange={(e) => setSelectedTurno(e.target.value as number)}
                    label="Turno"
                    sx={{
                      borderRadius: 2,
                      height: 40,
                      bgcolor: 'white',
                    }}
                  >
                    {loadingTurnos ? (
                      <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Cargando turnos...</MenuItem>
                    ) : turnos.length === 0 ? (
                      <MenuItem disabled>No hay turnos registrados</MenuItem>
                    ) : (
                      turnos.map((turno) => (
                        <MenuItem key={turno.codTurno} value={turno.codTurno}>
                           {turno.nombreTurno} ({turno.horario})
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Box>

              {/* Botones del formulario */}
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                {/* Boton Nuevo */}
                <Button
                  variant="outlined"
                  onClick={handleLimpiarFormulario}
                  disabled={loadingAsignaciones}
                  startIcon={<AddIcon />}
                  sx={{
                    height: 40,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: '#ffffff !important',
                    borderColor: '#1976d2 !important',
                    color: '#1976d2 !important',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04) !important',
                    },
                    '&.Mui-disabled': {
                      borderColor: '#e0e0e0 !important',
                      color: '#a0a0a0 !important',
                    }
                  }}
                >
                  Nuevo
                </Button>
                {/* Boton Guardar */}
                <Button
                  variant="contained"
                  onClick={handleGuardarAsignacion}
                  disabled={loadingAsignaciones}
                  startIcon={loadingAsignaciones ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{
                    height: 40,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: '#10b981 !important', // Verde esmeralda premium
                    color: 'white !important',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      bgcolor: '#059669 !important',
                      boxShadow: theme.shadows[4]
                    },
                    '&.Mui-disabled': {
                      bgcolor: `${alpha('#10b981', 0.5)} !important`,
                      color: 'rgba(255, 255, 255, 0.7) !important',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {editandoAsignacion ? "Actualizar Asignación" : "Guardar Asignación"}
                </Button>
              </Box>
            </Paper>
          </TabPanel>

          {/* Cajeros Asignados (Consulta) */}
          <TabPanel value={value} index={1}>
            {/* Filtros de Búsqueda */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2, mb: 3, border: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: { xs: 'wrap', sm: 'nowrap' }, // Mantener en una sola fila en escritorio
                gap: 2, 
                alignItems: 'center'
              }}>
                {/* Buscar por término */}
                <TextField
                  size="small"
                  margin="none"
                  label="Término de búsqueda"
                  value={searchTermino}
                  onChange={(e) => setSearchTermino(e.target.value)}
                  placeholder="Nombre, caja, turno..."
                  disabled={loadingAsignaciones}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 200px' },
                    minWidth: { xs: '100%', sm: '200px' },
                    m: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 40,
                      bgcolor: 'white',
                    }
                  }}
                />

                {/* Fecha */}
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '0 0 160px' }, 
                  minWidth: { xs: '100%', sm: '160px' }, 
                  m: 0, 
                  p: 0 
                }}>
                  <DatePicker
                    label="Filtrar por Fecha"
                    value={searchDate}
                    onChange={(newValue: any) => setSearchDate(newValue)}
                    disabled={loadingAsignaciones}
                    sx={{ width: '100%', m: 0 }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        margin: 'none',
                        fullWidth: true,
                        sx: {
                          m: 0,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            height: 40,
                            bgcolor: 'white',
                          }
                        }
                      }
                    }}
                  />
                </Box>

                {/* Código de Usuario */}
                <TextField
                  size="small"
                  margin="none"
                  label="Cód. Usuario"
                  value={searchCodUsuario}
                  onChange={(e) => setSearchCodUsuario(e.target.value.replace(/\D/g, ''))}
                  placeholder="Solo números"
                  disabled={loadingAsignaciones}
                  inputProps={{
                    pattern: '[0-9]*',
                    inputMode: 'numeric'
                  }}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '0 0 130px' },
                    minWidth: { xs: '100%', sm: '130px' },
                    m: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 40,
                      bgcolor: 'white',
                    }
                  }}
                />

                {/* Botones de acción */}
                <Box sx={{
                  display: 'flex',
                  gap: 1.5,
                  flex: { xs: '1 1 100%', sm: '0 0 220px' },
                  minWidth: { xs: '100%', sm: '220px' },
                  m: 0
                }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleBuscar}
                    disabled={loadingAsignaciones}
                    startIcon={loadingAsignaciones ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    sx={{
                      height: 40,
                      bgcolor: '#3b82f6 !important', // Azul premium
                      color: 'white !important',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
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
                    Buscar
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleNuevaBusqueda}
                    disabled={loadingAsignaciones}
                    startIcon={<ClearIcon />}
                    sx={{
                      height: 40,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      m: 0
                    }}
                  >
                    Limpiar
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Info de resultados */}
            <Box sx={{ mb: 2 }}>
              <Alert severity="info" sx={{ borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>
                Se encontraron {asignaciones.length} asignaciones de caja registradas.
              </Alert>
            </Box>

            {/* Tabla de Cajeros Asignados */}
            <TableContainer 
              component={Paper} 
              variant="outlined" 
              sx={{ 
                maxHeight: 450, 
                overflowX: 'auto',
                overflowY: 'auto',
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                  width: 8,
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: alpha(theme.palette.grey[100], 0.5),
                  borderRadius: 2,
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.5),
                  }
                },
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerStyle}>Cajero</TableCell>
                    <TableCell sx={headerStyle}>Caja</TableCell>
                    <TableCell sx={headerStyle}>Turno</TableCell>
                    <TableCell sx={headerStyle}>Fecha</TableCell>
                    <TableCell sx={headerStyle}>Estado</TableCell>
                    <TableCell align="center" sx={headerStyle}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingAsignaciones ? (
                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                  ) : asignaciones.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No hay asignaciones registradas para los filtros especificados</Typography></TableCell></TableRow>
                  ) : (
                    asignaciones.map((asignacion) => (
                      <TableRow 
                        key={asignacion.codAsignacionCaja} 
                        hover
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          },
                          '&:nth-of-type(even)': {
                            bgcolor: alpha(theme.palette.grey[50], 0.3),
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                            <PersonIcon color="action" fontSize="small" />
                            {asignacion.nombreUsuario || '---'}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{asignacion.numCaja || '---'}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{asignacion.turno || '---'}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 500 }}>{asignacion.fechaStr || '---'}</TableCell>
                        <TableCell>
                          <Chip
                            label={asignacion.estado}
                            color={asignacion.estado === 'ACTIVO' ? 'success' : 'default'}
                            size="small"
                            sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            title="Editar"
                            onClick={() => handleEditClick(asignacion)}
                            sx={{ mr: 0.5 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleEliminarAsignacion(asignacion.codAsignacionCaja)}
                            title="Eliminar"
                            disabled={loadingAsignaciones}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Box>

    </LocalizationProvider>
  );
};

export default AsignacionCaja;
