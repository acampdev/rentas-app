import { useState } from 'react';
import { Alert, Box, LinearProgress, Paper, Tab, Tabs, Typography } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import IPMForm from '../../components/ipm/IPMForm';
import IPMConsulta from '../../components/ipm/IPMConsulta';
import { useIpm } from '../../hooks/useIpm';
import type { IPMData, IPMWriteDTO } from '../../services/ipmService';

const IPMPage = () => {
  const [tab, setTab] = useState(1);
  const [seleccionado, setSeleccionado] = useState<IPMData | null>(null);
  const { registros, anioSeleccionado, buscarPorAnio, crearIPM, actualizarIPM, loading, isSaving, error } = useIpm();

  const handleGuardar = async (datos: IPMWriteDTO) => {
    if (seleccionado) await actualizarIPM(datos);
    else await crearIPM(datos);
    setSeleccionado(null);
    setTab(1);
  };

  const handleEditar = (registro: IPMData) => {
    setSeleccionado(registro);
    setTab(0);
  };

  return (
    <MainLayout title="Índice de Precios al por Mayor (IPM)">
      <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <Typography variant="h4" fontWeight={700} mb={0.5} sx={{ fontSize: { xs: '1.55rem', sm: '2.125rem' } }}>Índice de Precios al por Mayor</Typography>
        <Typography color="text.secondary" mb={3}>Registro y consulta mensual del IPM</Typography>
        {(loading || isSaving) && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<AddIcon />} iconPosition="start" label={seleccionado ? 'Editar IPM' : 'Nuevo IPM'} onClick={() => setSeleccionado(null)} />
            <Tab icon={<ListIcon />} iconPosition="start" label="Consulta IPM" />
          </Tabs>
          <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', boxSizing: 'border-box' }}>
            {tab === 0 ? (
              <IPMForm registro={seleccionado} loading={isSaving} onGuardar={handleGuardar} onCancelar={() => setSeleccionado(null)} />
            ) : (
              <IPMConsulta registros={registros} anio={anioSeleccionado} loading={loading} onBuscar={buscarPorAnio} onEditar={handleEditar} />
            )}
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default IPMPage;
