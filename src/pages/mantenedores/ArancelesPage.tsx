// src/pages/mantenedores/ArancelesPage.tsx
import React, { useState, useCallback } from 'react';
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
  Map as MapIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import { ArancelComponent as ArancelForm, ArancelList, Breadcrumb } from '../../components';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useAranceles } from '../../hooks/useAranceles';
import { ArancelData } from '../../services/arancelService';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const ArancelesPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [arancelSeleccionado, setArancelSeleccionado] = useState<ArancelData | null>(null);

  const {
    aranceles,
    loading,
    error,
    anio,
    setAnio,
    setBusqueda,
    crearArancel,
    actualizarArancel,
    eliminarArancel,
    cargarAranceles,
    isCreating,
    isUpdating
  } = useAranceles();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Urbanismo', path: '/mantenedores/urbanismo' },
    { label: 'Aranceles', active: true }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = useCallback((params: { anio: number; parametroBusqueda?: string }) => {
    setAnio(params.anio);
    if (params.parametroBusqueda !== undefined) {
      setBusqueda(params.parametroBusqueda || 'a');
    }
  }, [setAnio, setBusqueda]);

  const handleSeleccionar = (arancel: ArancelData) => {
    console.log('🎯 [ArancelesPage] Seleccionando arancel:', arancel);
    setArancelSeleccionado(arancel);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setArancelSeleccionado(null);
  };

  const handleGuardar = async (data: any) => {
    try {
      if (arancelSeleccionado) {
        const codArancel = Number(data.codArancel || arancelSeleccionado.codArancel || (arancelSeleccionado as any).id);
        const anio = Number(data.anio !== undefined && data.anio !== null ? data.anio : arancelSeleccionado.anio);
        const codDireccion = Number(data.codDireccion !== undefined && data.codDireccion !== null ? data.codDireccion : arancelSeleccionado.codDireccion);
        const costo = Number(data.costo !== undefined && data.costo !== null ? data.costo : (data.costoArancel !== undefined && data.costoArancel !== null ? data.costoArancel : arancelSeleccionado.costo));
        
        await actualizarArancel({ 
          codArancel, 
          anio,
          codDireccion,
          costo,
          codUsuario: getAuthenticatedUserCode()
        });
      } else {
        const anio = Number(data.anio);
        const codDireccion = Number(data.codDireccion);
        const costo = Number(data.costo !== undefined && data.costo !== null ? data.costo : data.costoArancel);
        
        await crearArancel({
          anio,
          codDireccion,
          costo,
          codUsuario: getAuthenticatedUserCode()
        } as any);
      }
      setTabValue(1);
      handleNuevo();
      cargarAranceles();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este arancel?')) {
      try {
        await eliminarArancel(id);
        cargarAranceles();
        handleNuevo();
        setTabValue(1);
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };


  return (
    <MainLayout title="Gestión de Aranceles">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><MapIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Aranceles</Typography>
              <Typography variant="body2" color="text.secondary">Administra los valores arancelarios por vía y cuadra</Typography>
            </Box>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={arancelSeleccionado ? 'Editar Arancel' : 'Nuevo Arancel'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Aranceles" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <ArancelForm 
              key={arancelSeleccionado?.codArancel || (arancelSeleccionado as any)?.id || 'nuevo'}
              initialData={arancelSeleccionado || undefined}
              onSubmit={handleGuardar}
              onDelete={arancelSeleccionado ? () => handleEliminar(arancelSeleccionado.codArancel || (arancelSeleccionado as any).id) : undefined}
              onNuevo={handleNuevo}
              isSubmitting={isCreating || isUpdating}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ArancelList 
              aranceles={aranceles as any as ArancelData[]}
              onEditArancel={handleSeleccionar}
              onEliminar={handleEliminar}
              onSearch={handleSearch}
              loading={loading}
              onRefresh={() => cargarAranceles()}
            />
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default ArancelesPage;
