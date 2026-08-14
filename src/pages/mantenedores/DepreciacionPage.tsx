import React from 'react';
import { Box, Typography, Stack, Alert, useTheme } from '@mui/material';
import { TrendingDown as TrendingDownIcon, Info as InfoIcon } from '@mui/icons-material';
import { MainLayout } from '../../layout';
import { DepreciacionUnificado, Breadcrumb } from '../../components';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useDepreciacion } from '../../hooks/useDepreciacion';

const DepreciacionPage: React.FC = () => {
  const {
    depreciaciones,
    loading,
    error,
    anio,
    setAnio,
    codTipoCasa,
    setCodTipoCasa,
    consultarDepreciaciones,
    crearDepreciacion
  } = useDepreciacion();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Mantenedores', path: '/mantenedores' },
    { label: 'Tarifas', path: '/mantenedores/tarifas' },
    { label: 'Depreciación', active: true }
  ];

  return (
    <MainLayout>
      <Box sx={{ width: '100%', p: 3 }}>
        <Breadcrumb items={breadcrumbItems} />
        <Stack direction="row" alignItems="center" spacing={1} my={3}>
          <TrendingDownIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight="bold">Depreciación</Typography>
        </Stack>

        <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
          La depreciación se calcula en base al material de construcción, antigüedad y estado de conservación del inmueble.
        </Alert>

        <DepreciacionUnificado
          anioSeleccionado={anio}
          tipoCasaSeleccionado={codTipoCasa}
          depreciaciones={depreciaciones}
          onAnioChange={(a) => setAnio(a || new Date().getFullYear())}
          onTipoCasaChange={(tc) => setCodTipoCasa(tc || '0501')}
          onRegistrar={crearDepreciacion}
          onBuscar={consultarDepreciaciones}
          loading={loading}
        />
      </Box>
    </MainLayout>
  );
};

export default DepreciacionPage;
