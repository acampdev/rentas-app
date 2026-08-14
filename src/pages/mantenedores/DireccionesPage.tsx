// src/pages/mantenedores/DireccionesPage.tsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Tabs,
  Tab,
  useTheme,
  alpha
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import { MainLayout } from '../../layout';
import { Breadcrumb } from '../../components';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useDirecciones } from '../../hooks';
import DireccionFormMUI from '../../components/direcciones/DireccionForm';
import DireccionListMUI from '../../components/direcciones/DireccionList';
import { DireccionData } from '../../services/direccionService';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} style={{ display: value === index ? 'block' : 'none' }}><Box>{children}</Box></div>
);

const DireccionesPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<DireccionData | null>(null);

  const { direcciones, loading, buscarDirecciones, crearDireccion, actualizarDireccion, eliminarDireccion } = useDirecciones();

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Ubicación', path: '/mantenedores/ubicacion' },
    { label: 'Direcciones', active: true }
  ], []);

  const handleGuardar = async (data: any) => {
    try {
      if (modoEdicion && direccionSeleccionada) {
        await actualizarDireccion({ id: direccionSeleccionada.id, datos: data });
      } else {
        await crearDireccion(data);
      }
      setModoEdicion(false);
      setDireccionSeleccionada(null);
      setTabValue(1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Seguro que desea eliminar esta dirección?')) {
      await eliminarDireccion(id);
    }
  };

  const handleSeleccionar = (direccion: DireccionData) => {
    console.log('🎯 [DireccionesPage] Seleccionando dirección para editar:', direccion);
    setDireccionSeleccionada(direccion);
    setModoEdicion(true);
    setTabValue(0);
  };

  return (
    <MainLayout title="Gestión de Direcciones">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><LocationIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Gestión de Direcciones</Typography>
              <Typography variant="body2" color="text.secondary">Administra las direcciones del sistema municipal</Typography>
            </Box>
            <Chip label={`Total: ${direcciones.length}`} color="primary" sx={{ fontWeight: 600 }} />
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={modoEdicion ? 'Editar Dirección' : 'Nueva Dirección'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Direcciones" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <DireccionFormMUI 
                key={direccionSeleccionada?.id || 'nuevo'}
                direccionSeleccionada={direccionSeleccionada}
                onSubmit={handleGuardar}
                onNuevo={() => { setModoEdicion(false); setDireccionSeleccionada(null); }}
                onEditar={() => setModoEdicion(true)}
                loading={loading}
                isEditMode={modoEdicion}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <DireccionListMUI 
                direcciones={direcciones}
                onSelectDireccion={handleSeleccionar}
                onEditDireccion={handleSeleccionar}
                onDeleteDireccion={handleEliminar}
                loading={loading}
                onSearch={(term) => buscarDirecciones({ parametrosBusqueda: term })}
              />
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default DireccionesPage;
