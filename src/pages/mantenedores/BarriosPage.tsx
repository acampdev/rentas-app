// src/pages/mantenedores/BarriosPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Tabs,
  Tab,
  LinearProgress,
  alpha,
  useTheme,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  List as ListIcon,
  LocationCity as CityIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import BarrioForm from '../../components/barrio/BarrioForm';
import BarrioList from '../../components/barrio/BarrioList';
import Breadcrumb from '../../components/utils/Breadcrumb';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useBarrios } from '../../hooks/useBarrios';
import { useSectores } from '../../hooks/useSectores';
import { Barrio } from '../../models/Barrio';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const BarriosPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [barrioSeleccionado, setBarrioSeleccionado] = useState<Barrio | null>(null);

  const {
    barrios,
    loading,
    error,
    crearBarrio,
    actualizarBarrio,
    cargarBarrios
  } = useBarrios();

  const { sectores } = useSectores();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Urbanismo', path: '/mantenedores/urbanismo' },
    { label: 'Barrios', active: true }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSeleccionar = (barrio: any) => {
    setBarrioSeleccionado(barrio);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setBarrioSeleccionado(null);
  };

  const handleGuardar = async (data: any) => {
    try {
      if (barrioSeleccionado) {
        await actualizarBarrio({ id: barrioSeleccionado.id, datos: data });
      } else {
        await crearBarrio(data);
      }
      setTabValue(1);
      handleNuevo();
      cargarBarrios();
    } catch (err) {
      console.error('Error al guardar barrio:', err);
    }
  };

  return (
    <MainLayout title="Gestión de Barrios">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><CityIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Barrios</Typography>
              <Typography variant="body2" color="text.secondary">Gestiona los sectores y barrios del distrito</Typography>
            </Box>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={barrioSeleccionado ? 'Editar Barrio' : 'Nuevo Barrio'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Barrios" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <BarrioForm 
              initialData={barrioSeleccionado || undefined}
              onSubmit={handleGuardar}
              onNew={handleNuevo}
              isSubmitting={loading}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <BarrioList 
              barrios={barrios}
              selectedBarrio={barrioSeleccionado || undefined}
              onSelectBarrio={handleSeleccionar}
              onEdit={handleSeleccionar}
              loading={loading}
              sectores={sectores}
            />
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default BarriosPage;
