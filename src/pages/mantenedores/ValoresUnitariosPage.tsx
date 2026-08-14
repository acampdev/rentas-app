import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  alpha,
  useTheme,
  Button
} from '@mui/material';
import {
  PriceCheck as PriceIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import { Breadcrumb } from '../../components';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import ValorUnitarioForm from '../../components/unitarios/ValorUnitarioForm';
import ValorUnitarioList from '../../components/unitarios/ValorUnitarioList';
import { useValoresUnitarios } from '../../hooks';
import { ValorUnitarioData } from '../../services/valorUnitarioService';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const ValoresUnitariosPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [valorSeleccionado, setValorSeleccionado] = useState<ValorUnitarioData | null>(null);

  const {
    valoresUnitarios,
    loading,
    anio,
    setAnio,
    cargarValores,
    crearValorUnitario,
    actualizarValorUnitario,
    eliminarValorUnitario
  } = useValoresUnitarios();

  const aniosDisponibles = Array.from({ length: 10 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: y.toString(), label: y.toString() };
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Tarifas', path: '/mantenedores/tarifas' },
    { label: 'Valores Unitarios', active: true }
  ];

  const handleSeleccionar = (val: ValorUnitarioData) => {
    setValorSeleccionado(val);
    setModoEdicion(true);
    setTabValue(0);
  };

  const handleNuevo = () => {
    setValorSeleccionado(null);
    setModoEdicion(false);
  };

  const handleGuardar = async (data: any) => {
    try {
      if (modoEdicion && valorSeleccionado) {
        // Mapeo para actualización (Service espera CreateValorUnitarioDTO partial)
        const updateData = {
          año: Number(data.anio),
          categoria: String(data.codCategoria),
          subcategoria: String(data.codSubcategoria),
          letra: String(data.codLetra),
          costo: Number(data.costo),
          codUsuario: getAuthenticatedUserCode()
        };
        await actualizarValorUnitario({ id: valorSeleccionado.id, datos: updateData });
      } else {
        // Mapeo para creación (Service espera CrearValorUnitarioApiDTO)
        const createData = {
          codigoValorUnitario: null,
          codigoValorUnitarioAnterior: null,
          anio: Number(data.anio),
          codLetra: String(data.codLetra),
          codCategoria: String(data.codCategoria),
          codSubcategoria: String(data.codSubcategoria),
          costo: Number(data.costo)
        };
        await crearValorUnitario(createData as any);
      }
      setTabValue(1);
      setValorSeleccionado(null);
      setModoEdicion(false);
      cargarValores();
    } catch (err) {
      console.error('Error al guardar valor unitario:', err);
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await eliminarValorUnitario(id);
      setTabValue(1);
      handleNuevo();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MainLayout title="Gestión de Valores Unitarios">
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Breadcrumb items={breadcrumbItems} />
          <Stack direction="row" alignItems="center" spacing={3} mt={2}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><PriceIcon fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.dark">Valores Unitarios</Typography>
              <Typography variant="body2" color="text.secondary">Administra los costos unitarios por categoría de edificación</Typography>
            </Box>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => cargarValores()} disabled={loading}>Actualizar</Button>
          </Stack>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={modoEdicion ? 'Editar Valor' : 'Nuevo Valor'} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Lista de Tarifas" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <ValorUnitarioForm 
              valorSeleccionado={valorSeleccionado || null}
              onSubmit={handleGuardar}
              onNuevo={handleNuevo}
              isSubmitting={loading}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ValorUnitarioList 
              años={aniosDisponibles}
              añoSeleccionado={anio}
              onAnioChange={setAnio}
              onValorSeleccionado={handleSeleccionar}
              onEliminar={handleEliminar}
              valoresUnitarios={valoresUnitarios}
              loading={loading}
            />
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default ValoresUnitariosPage;
