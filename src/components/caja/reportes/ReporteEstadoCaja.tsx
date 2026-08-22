import { Alert, AlertTitle, Stack, Typography } from '@mui/material';

const ReporteEstadoCaja = () => (
  <Stack spacing={2}>
    <Typography variant="h6">Estado de Caja Detallado</Typography>
    <Alert severity="warning" variant="outlined">
      <AlertTitle>Módulo no disponible</AlertTitle>
      El reporte detallado de caja todavía no está conectado a una API municipal.
      No se muestran montos, movimientos ni datos de cajeros simulados, y la impresión
      permanecerá deshabilitada hasta disponer de información real.
    </Alert>
  </Stack>
);

export default ReporteEstadoCaja;
