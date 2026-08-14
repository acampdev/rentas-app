import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  alpha,
  useTheme,
  Paper
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import { AlcabalaComponent as AlcabalaForm, AlcabalaList, Breadcrumb } from '../../components';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useAlcabala } from '../../hooks';
import { AlcabalaData } from '../../services/alcabalaService';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const AlcabalaPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [alcabalaSeleccionada, setAlcabalaSeleccionada] = useState<AlcabalaData | null>(null);
  const [tasaManual, setTasaManual] = useState(0);
  const [anioManual, setAnioManual] = useState<number | null>(new Date().getFullYear());

  const {
    alcabalas,
    loading,
    error,
    aniosDisponibles,
    crearAlcabala,
    actualizarAlcabala,
    buscarPorAnio
  } = useAlcabala();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Tarifas', path: '/mantenedores/tarifas' },
    { label: 'Alcabala', active: true }
  ];

  const handleSeleccionar = (alc: AlcabalaData) => {
    setAlcabalaSeleccionada(alc);
    setAnioManual(alc.anio);
    setTasaManual(alc.tasa);
    setModoEdicion(true);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setAlcabalaSeleccionada(null);
    setAnioManual(new Date().getFullYear());
    setTasaManual(0);
    setModoEdicion(false);
  };

  const handleGuardar = async () => {
    if (!anioManual) return;
    if (modoEdicion && alcabalaSeleccionada) {
      await actualizarAlcabala({ id: alcabalaSeleccionada.id, datos: { codAlcabala: alcabalaSeleccionada.id, anio: anioManual, tasa: tasaManual } });
    } else {
      await crearAlcabala({ anio: anioManual, tasa: tasaManual });
    }
    setTabValue(1);
    handleNuevo();
  };

  return (
    <MainLayout title="Gestión de Alcabala">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><ReceiptIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Alcabala</Typography>
              <Typography variant="body2" color="text.secondary">Administra las tasas de alcabala por año fiscal</Typography>
            </Box>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={modoEdicion ? 'Editar Tasa' : 'Nueva Tasa'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Tasas" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <AlcabalaForm 
              aniosDisponibles={aniosDisponibles}
              anioSeleccionado={anioManual}
              tasa={tasaManual}
              onAnioChange={setAnioManual}
              onTasaChange={setTasaManual}
              onRegistrar={handleGuardar}
              loading={loading}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <AlcabalaList 
              alcabalas={alcabalas}
              paginacion={{ pagina: 1, porPagina: 10, total: alcabalas.length }}
              onCambiarPagina={() => {}}
              onBuscar={buscarPorAnio}
              onNuevo={handleNuevo}
              onEditar={handleSeleccionar}
              loading={loading}
            />
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default AlcabalaPage;
