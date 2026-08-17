import type { FC } from 'react';
import { Alert, AlertTitle, Stack, Typography } from '@mui/material';

const ReportesCuentas: FC = () => (
  <Stack spacing={2}>
    <Typography variant="h5" fontWeight={800}>
      Estado de Cuenta Corriente
    </Typography>
    <Alert severity="warning" variant="outlined">
      <AlertTitle>Módulo no disponible</AlertTitle>
      El reporte de cuentas todavía no está conectado a una API municipal. No se muestran movimientos, contribuyentes ni importes de demostración.
    </Alert>
  </Stack>
);

export default ReportesCuentas;
