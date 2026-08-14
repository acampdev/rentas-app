// src/pages/mantenedores/UitPage.tsx
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
  Calculate as CalculateIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import { UitFormAlicuota, UitList, Breadcrumb } from '../../components';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useUIT } from '../../hooks/useUIT';
import { UITData } from '../../services/uitService';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const UitPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [uitSeleccionada, setUitSeleccionada] = useState<UITData | null>(null);

  const {
    uits,
    uitVigente,
    loading,
    error,
    aniosDisponibles,
    crearUIT,
    actualizarUIT,
    eliminarUIT,
    anioSeleccionado,
    setAnioSeleccionado
  } = useUIT();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Tarifas', path: '/mantenedores/tarifas' },
    { label: 'UIT', active: true }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSeleccionar = (uit: UITData) => {
    setUitSeleccionada(uit);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setUitSeleccionada(null);
  };

  const handleGuardar = async (data: any) => {
    if (uitSeleccionada) {
      const codUit = uitSeleccionada.codUit || uitSeleccionada.id;
      await actualizarUIT({
        codUit: Number(codUit),
        anio: Number(data.anio),
        valor: Number(data.valor)
      });
    } else {
      await crearUIT({
        anio: Number(data.anio),
        valor: Number(data.valor)
      });
    }
    setTabValue(1);
    handleNuevo();
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarUIT(id);
      setTabValue(1);
      handleNuevo();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MainLayout title="Gestión de UIT">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><CalculateIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Unidad Impositiva Tributaria (UIT)</Typography>
              <Typography variant="body2" color="text.secondary">Administra los valores de la UIT y alícuotas del Impuesto Predial</Typography>
            </Box>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={uitSeleccionada ? 'Editar UIT' : 'Nueva UIT'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de UITs" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <UitFormAlicuota 
              uitSeleccionada={uitSeleccionada || null}
              onGuardar={handleGuardar}
              onNuevo={handleNuevo}
              modoEdicion={!!uitSeleccionada}
              loading={loading}
              anioSeleccionado={anioSeleccionado}
              onAnioChange={setAnioSeleccionado}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <UitList 
              uits={uits}
              onEditar={handleSeleccionar}
              loading={loading}
              uitSeleccionada={uitSeleccionada}
            />
          </TabPanel>

        </Paper>
      </Box>
    </MainLayout>
  );
};

export default UitPage;
