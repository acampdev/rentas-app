// src/components/escalas/RegistroTIM.tsx
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
  MenuItem,
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { useTim, useTimComboOptions } from '../../hooks/useTim';
import { timService, TimData } from '../../services/timService';
import ActualizarTim from '../tim/ActulizarTim.tsx';

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const RegistroTIM: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  // Form states (Tab 1)
  const [formAnio, setFormAnio] = useState<number>(new Date().getFullYear());
  const [formTasa, setFormTasa] = useState<string>('');
  const [formPeriodo, setFormPeriodo] = useState<number>(1);
  const [formTributo, setFormTributo] = useState<number | string>('');
  const [formResolucionInteres, setFormResolucionInteres] = useState<number>(2);

  // Search states (Tab 2)
  const [searchAnio, setSearchAnio] = useState<number>(new Date().getFullYear());
  const [searchPeriodo, setSearchPeriodo] = useState<number>(1);
  const [searchTributo, setSearchTributo] = useState<number | string>('');
  const [searchResolucionInteres, setSearchResolucionInteres] = useState<number>(2);

  // Results & loading
  const [resultados, setResultados] = useState<TimData[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Hook actions
  const { crearTim, eliminarTim, isCreating, isDeleting } = useTim();

  // Load Tributos from TIM combo options API
  const { options: tributoOptions, loading: loadingTributos } = useTimComboOptions();

  // Set default values once options load
  useEffect(() => {
    if (tributoOptions.length > 0) {
      if (!formTributo) {
        const exists = tributoOptions.some(opt => Number(opt.value) === 5);
        setFormTributo(exists ? 5 : Number(tributoOptions[0].value));
      }
      if (!searchTributo) {
        const exists = tributoOptions.some(opt => Number(opt.value) === 5);
        setSearchTributo(exists ? 5 : Number(tributoOptions[0].value));
      }
    }
  }, [tributoOptions, formTributo, searchTributo]);

  // Edit states
  const [selectedTim, setSelectedTim] = useState<TimData | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGuardar = async () => {
    const tasaNum = parseFloat(formTasa);
    if (isNaN(tasaNum) || tasaNum < 0) {
      alert('Por favor ingrese una tasa válida.');
      return;
    }

    try {
      await crearTim({
        anio: formAnio,
        periodo: formPeriodo,
        tasa: tasaNum,
        codTributo: Number(formTributo),
        codResolucionInteres: formResolucionInteres
      });
      // Reset form
      handleNuevo();
    } catch (err) {
      console.error('Error creating TIM:', err);
    }
  };

  const handleNuevo = () => {
    setFormAnio(new Date().getFullYear());
    setFormTasa('');
    setFormPeriodo(1);
    setFormResolucionInteres(2);
    if (tributoOptions.length > 0) {
      const exists = tributoOptions.some(opt => Number(opt.value) === 5);
      setFormTributo(exists ? 5 : Number(tributoOptions[0].value));
    } else {
      setFormTributo(5);
    }
  };

  const handleBuscar = async () => {
    setLoadingSearch(true);
    setHasSearched(true);
    try {
      const data = await timService.obtenerTim({
        anio: searchAnio,
        periodo: searchPeriodo,
        codTributo: Number(searchTributo),
        codResolucionInteres: searchResolucionInteres
      });
      setResultados(data);
    } catch (err) {
      console.error('Error loading TIM records:', err);
      setResultados([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleEditClick = (record: TimData) => {
    setSelectedTim(record);
    setEditOpen(true);
  };

  const handleDeleteClick = async (record: TimData) => {
    if (window.confirm('¿Está seguro de eliminar esta escala TIM?')) {
      try {
        await eliminarTim({
          codTIM: record.codTIM,
          codResolucionInteres: record.codResolucionInteres
        });
        handleBuscar();
      } catch (err) {
        console.error('Error deleting TIM:', err);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 900, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Formulario TIM" />
          <Tab label="Búsqueda TIM" />
        </Tabs>
      </Box>

      {/* TAB 1: Formulario TIM */}
      <TabPanel value={tabValue} index={0}>
        <Stack spacing={4}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Registrar Nueva Escala TIM
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            {/* Año */}
            <TextField
              label="Año"
              type="number"
              value={formAnio}
              onChange={(e) => setFormAnio(parseInt(e.target.value) || new Date().getFullYear())}
              sx={{ width: 100 }}
              size="small"
              inputProps={{ min: 2000, max: 2100 }}
            />

            {/* Tasa */}
            <TextField
              label="Tasa"
              type="number"
              value={formTasa}
              onChange={(e) => setFormTasa(e.target.value)}
              sx={{ width: 100 }}
              size="small"
              inputProps={{ step: 0.0001, min: 0 }}
              placeholder="0.00"
            />

            {/* Periodo */}
            <TextField
              label="Periodo (Mes)"
              type="number"
              value={formPeriodo}
              onChange={(e) => setFormPeriodo(parseInt(e.target.value) || 1)}
              sx={{ width: 140 }}
              size="small"
              inputProps={{ min: 1, max: 12 }}
            />

            {/* Tributo */}
            <TextField
              select
              label="Tributo"
              value={formTributo}
              onChange={(e) => setFormTributo(parseInt(e.target.value) || 0)}
              sx={{ width: 250 }}
              size="small"
              disabled={loadingTributos}
              InputProps={{
                endAdornment: loadingTributos && <CircularProgress size={20} />
              }}
            >
              {tributoOptions.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label} ({t.value})
                </MenuItem>
              ))}
            </TextField>

            {/* Resolución */}
            <TextField
              label="Cód. Resolución"
              type="number"
              value={formResolucionInteres}
              onChange={(e) => setFormResolucionInteres(parseInt(e.target.value) || 2)}
              sx={{ width: 150 }}
              size="small"
            />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleNuevo}
              sx={{ minWidth: 120, height: 40 }}
            >
              Nuevo
            </Button>
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={isCreating}
              sx={{
                minWidth: 120,
                height: 40,
                backgroundColor: '#3b82f6 !important',
                color: 'white !important',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#2563eb !important'
                }
              }}
            >
              {isCreating ? 'Guardando...' : 'Guardar'}
            </Button>
          </Stack>
        </Stack>
      </TabPanel>

      {/* TAB 2: Búsqueda TIM */}
      <TabPanel value={tabValue} index={1}>
        <Stack spacing={4}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Filtros de Búsqueda TIM
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            {/* Año */}
            <TextField
              label="Año"
              type="number"
              value={searchAnio}
              onChange={(e) => setSearchAnio(parseInt(e.target.value) || new Date().getFullYear())}
              sx={{ width: 100 }}
              size="small"
              inputProps={{ min: 2000, max: 2100 }}
            />

            {/* Periodo */}
            <TextField
              label="Periodo (Mes)"
              type="number"
              value={searchPeriodo}
              onChange={(e) => setSearchPeriodo(parseInt(e.target.value) || 1)}
              sx={{ width: 140 }}
              size="small"
              inputProps={{ min: 1, max: 12 }}
            />

            {/* Tributo */}
            <TextField
              select
              label="Tributo"
              value={searchTributo}
              onChange={(e) => setSearchTributo(parseInt(e.target.value) || 0)}
              sx={{ width: 250 }}
              size="small"
              disabled={loadingTributos}
              InputProps={{
                endAdornment: loadingTributos && <CircularProgress size={20} />
              }}
            >
              {tributoOptions.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label} ({t.value})
                </MenuItem>
              ))}
            </TextField>

            {/* Resolución */}
            <TextField
              label="Cód. Resolución"
              type="number"
              value={searchResolucionInteres}
              onChange={(e) => setSearchResolucionInteres(parseInt(e.target.value) || 2)}
              sx={{ width: 150 }}
              size="small"
            />

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
              sx={{
                height: 40,
                backgroundColor: '#3b82f6 !important',
                color: 'white !important',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#2563eb !important'
                }
              }}
            >
              Buscar
            </Button>
          </Stack>

          {/* Tabla de resultados */}
          {loadingSearch ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={40} />
            </Box>
          ) : hasSearched && resultados.length === 0 ? (
            <Alert severity="info">No se encontraron escalas TIM con los filtros especificados.</Alert>
          ) : resultados.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={1}
              sx={{
                borderRadius: 1,
                maxHeight: 400,
                overflowX: 'auto',
                overflowY: 'auto'
              }}
            >
              <Table stickyHeader size="small">
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Cód. TIM</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Año</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Mes</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tributo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tasa</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Resolución</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Vigencia</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultados.map((row) => (
                    <TableRow key={row.codTIM} hover>
                      <TableCell>{row.codTIM}</TableCell>
                      <TableCell>{row.anio}</TableCell>
                      <TableCell>{row.mes || `Mes ${row.periodo}`}</TableCell>
                      <TableCell>{row.tributo || `Tributo ${row.codTributo}`}</TableCell>
                      <TableCell>{row.tasa}</TableCell>
                      <TableCell>{row.resolucion || `Resolución ${row.codResolucionInteres}`}</TableCell>
                      <TableCell>
                        {row.fechaInicio} a {row.fechaFin || 'Indefinido'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEditClick(row)} color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(row)} color="error" size="small" disabled={isDeleting}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Stack>
      </TabPanel>

      {/* Modal de Actualización */}
      <ActualizarTim
        open={editOpen}
        onClose={() => setEditOpen(false)}
        timData={selectedTim}
        onSuccess={handleBuscar}
      />
    </Paper>
  );
};

export default RegistroTIM;
