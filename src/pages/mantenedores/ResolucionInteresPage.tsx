// src/pages/mantenedores/ResolucionInteresPage.tsx
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
  Add as AddIcon,
  List as ListIcon,
  Percent as PercentIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import Breadcrumb from '../../components/utils/Breadcrumb';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import ResolucionInteres from '../../components/resolucionInteres/ResolucionInteres';
import ConsultaResolucion from '../../components/resolucionInteres/ConsultaResolucion';
import { useResolucionesInteres } from '../../hooks/useResolucionInteres';
import type { ResolucionInteresData } from '../../services/resolucionInteresService';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const ResolucionInteresPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [resolucionSeleccionada, setResolucionSeleccionada] = useState<ResolucionInteresData | null>(null);

  const {
    resoluciones: _resoluciones,
    loading,
    error,
    crearResolucion,
    actualizarResolucion,
    eliminarResolucion
  } = useResolucionesInteres();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Resolución Interés', active: true }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSeleccionar = (item: ResolucionInteresData) => {
    setResolucionSeleccionada(item);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setResolucionSeleccionada(null);
  };

  const handleGuardar = async (data: { anioFiscal: number; descripcion: string; tasa: number }) => {
    try {
      if (resolucionSeleccionada) {
        await actualizarResolucion({
          codResolucionInteres: resolucionSeleccionada.codResolucionInteres,
          anioFiscal: data.anioFiscal,
          descripcion: data.descripcion,
          tasa: data.tasa
        });
      } else {
        await crearResolucion({
          anioFiscal: data.anioFiscal,
          descripcion: data.descripcion,
          tasa: data.tasa
        });
      }
      setTabValue(1);
      handleNuevo();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarResolucion(id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MainLayout title="Gestión de Resoluciones de Interés">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
              <PercentIcon fontSize="large" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">
                Resolución de Interés
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administra las tasas de interés y resoluciones aplicadas a las deudas tributarias.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<AddIcon />} iconPosition="start" label={resolucionSeleccionada ? 'Editar Resolución' : 'Nueva Resolución'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Resoluciones" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <ResolucionInteres
              resolucionSeleccionada={resolucionSeleccionada}
              onGuardar={handleGuardar}
              onNuevo={handleNuevo}
              modoEdicion={!!resolucionSeleccionada}
              loading={loading}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ConsultaResolucion
              onEditar={handleSeleccionar}
              onEliminar={handleEliminar}
            />
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default ResolucionInteresPage;
