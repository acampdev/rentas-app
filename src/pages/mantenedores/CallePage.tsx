// src/pages/mantenedores/CallePage.tsx
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
  Traffic as TrafficIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import CalleForm from '../../components/calles/CalleForm';
import CalleList from '../../components/calles/CalleList';
import Breadcrumb from '../../components/utils/Breadcrumb';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useCalles } from '../../hooks/useCalles';
import { useBarrios } from '../../hooks/useBarrios';
import { useSectores } from '../../hooks/useSectores';
import { Calle } from '../../models/Calle';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const CallePage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [calleSeleccionada, setCalleSeleccionada] = useState<Calle | null>(null);

  const {
    calles,
    loading,
    error,
    guardarCalle,
    eliminarCalle,
    cargarCalles
  } = useCalles();

  const { barrios } = useBarrios();
  const { sectores } = useSectores();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Urbanismo', path: '/mantenedores/urbanismo' },
    { label: 'Vías', active: true }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSeleccionar = (calle: any) => {
    setCalleSeleccionada(calle);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setCalleSeleccionada(null);
  };

  const handleGuardar = async (data: any) => {
    await guardarCalle(data);
    setTabValue(1);
    handleNuevo();
  };

  const handleEliminar = async () => {
    if (calleSeleccionada) {
      const id = (calleSeleccionada as any).id || (calleSeleccionada as any).codVia;
      await eliminarCalle(id);
      setTabValue(1);
      handleNuevo();
    }
  };

  return (
    <MainLayout title="Gestión de Vías">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><TrafficIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Vías y Calles</Typography>
              <Typography variant="body2" color="text.secondary">Administra el nomenclátor de avenidas, jirones, calles y pasajes</Typography>
            </Box>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={calleSeleccionada ? 'Editar Vía' : 'Nueva Vía'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Vías" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <CalleForm 
              initialData={calleSeleccionada || undefined}
              onSubmit={handleGuardar}
              onDelete={calleSeleccionada ? handleEliminar : undefined}
              onNuevo={handleNuevo}
              isSubmitting={loading}
              barrios={barrios}
              sectores={sectores}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <CalleList 
              calles={calles}
              onSelectCalle={handleSeleccionar}
              loading={loading}
              onRefresh={() => cargarCalles()}
            />
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default CallePage;
