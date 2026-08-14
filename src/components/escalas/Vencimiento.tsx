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
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  AutoFixHigh as AutoIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useVencimientos } from '../../hooks/useVencimientos';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`venc-tab-${index}`}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Vencimiento: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [anioReg, setAnioReg] = useState<number>(new Date().getFullYear());
  
  const {
    vencimientos,
    loading,
    error,
    anio,
    setAnio,
    crearVencimientos,
    isCreating
  } = useVencimientos();

  const [searchAnio, setSearchAnio] = useState<number>(anio);

  useEffect(() => {
    setSearchAnio(anio);
  }, [anio]);

  const handleGenerate = async () => {
    await crearVencimientos(anioReg);
    setAnio(anioReg);
    setTabValue(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setAnio(searchAnio);
    }
  };

  const getImpuestoColor = (impuesto: string) => {
    const normalized = impuesto.toUpperCase();
    if (normalized.includes('PREDIAL') || normalized.includes('PREDIO')) return '#3b82f6'; // Azul
    if (normalized.includes('ARBITRIO') || normalized.includes('ARBITRIOS')) return '#8b5cf6'; // Morado
    if (normalized.includes('ALCABALA')) return '#f59e0b'; // Ámbar
    return '#6b7280'; // Gris
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab icon={<AutoIcon />} iconPosition="start" label="Generar Vencimientos" />
          <Tab icon={<SearchIcon />} iconPosition="start" label="Consultar" />
        </Tabs>
      </Box>

      {/* TAB 1: GENERAR VENCIMIENTOS */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ px: 3 }}>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField 
                  label="Año Fiscal" 
                  type="number" 
                  size="small" 
                  value={anioReg} 
                  onChange={(e) => setAnioReg(parseInt(e.target.value) || new Date().getFullYear())} 
                  sx={{ width: 150 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  Generar los últimos días hábiles para el pago de tributos del año seleccionado.
                </Typography>
              </Box>

              <Alert severity="info">
                Esta acción calculará y registrará automáticamente las fechas límites mensuales para impuestos prediales y arbitrios municipales del año fiscal elegido.
              </Alert>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={() => setAnioReg(new Date().getFullYear())}
                  disabled={isCreating}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Nuevo
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                  onClick={handleGenerate} 
                  disabled={isCreating || !anioReg}
                  style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 700, minWidth: '150px' }}
                  sx={{ textTransform: 'none' }}
                >
                  Guardar
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </TabPanel>

      {/* TAB 2: CONSULTAR */}
      <TabPanel value={tabValue} index={1}>
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
                  CALENDARIO DE VENCIMIENTO DE TRIBUTOS
                </Typography>
              </Box>

              <TableContainer sx={{ maxHeight: 450 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>MES</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>IMPUESTO</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>DÍA</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>FECHA LÍMITE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                    ) : vencimientos.length > 0 ? (
                      vencimientos.map((v, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{v.mes}</TableCell>
                          <TableCell>
                            <Chip 
                              label={v.tipoImpuesto} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontWeight: 600,
                                borderColor: getImpuestoColor(v.tipoImpuesto),
                                color: getImpuestoColor(v.tipoImpuesto),
                                bgcolor: alpha(getImpuestoColor(v.tipoImpuesto), 0.05)
                              }} 
                            />
                          </TableCell>
                          <TableCell>{v.diaSemana}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight={700}>{v.ultimoDiaHabilStr}</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                          <Typography color="text.secondary">No hay datos de vencimientos registrados para el año {anio}</Typography>
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
    </Paper>
  );
};

export default Vencimiento;
