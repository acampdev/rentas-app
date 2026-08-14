// src/pages/mantenedores/SectoresPage.tsx
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
  Public as PublicIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import { SectorComponent as SectorForm, SectorList, Breadcrumb } from '../../components';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useSectores } from '../../hooks/useSectores';
import { Sector } from '../../models/Sector';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const SectoresPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [sectorSeleccionado, setSectorSeleccionado] = useState<Sector | null>(null);

  const {
    sectores,
    loading,
    error,
    crearSector,
    actualizarSector,
    eliminarSector,
    cargarSectores
  } = useSectores();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Urbanismo', path: '/mantenedores/urbanismo' },
    { label: 'Sectores', active: true }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSeleccionar = (sector: Sector) => {
    setSectorSeleccionado(sector);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setSectorSeleccionado(null);
  };

  const handleGuardar = async (data: any) => {
    try {
      if (sectorSeleccionado) {
        await actualizarSector({ id: sectorSeleccionado.id, datos: data });
      } else {
        await crearSector(data);
      }
      // Cambiar de pestaña y limpiar selección
      setTabValue(1);
      handleNuevo();
      // Forzar recarga en segundo plano
      cargarSectores();
    } catch (err) {
      console.error('Error al guardar sector:', err);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarSector(id);
      setTabValue(1);
      handleNuevo();
      cargarSectores();
    } catch (err) {
      console.error('Error al eliminar sector:', err);
    }
  };

  return (
    <MainLayout title="Gestión de Sectores">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><PublicIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Sectores</Typography>
              <Typography variant="body2" color="text.secondary">Gestiona la división territorial del distrito por sectores</Typography>
            </Box>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={sectorSeleccionado ? 'Editar Sector' : 'Nuevo Sector'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Sectores" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <SectorForm 
              sectorSeleccionado={sectorSeleccionado}
              onGuardar={handleGuardar}
              onNuevo={handleNuevo}
              isEditMode={!!sectorSeleccionado}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SectorList 
              sectores={sectores}
              selectedSector={sectorSeleccionado || undefined}
              onSelectSector={handleSeleccionar}
              onEdit={handleSeleccionar}
              onEliminar={handleEliminar}
              loading={loading}
            />
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default SectoresPage;
