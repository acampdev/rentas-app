import type { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface PorFechaProps {
  onExportPdf?: () => void;
}

const PorFecha: FC<PorFechaProps> = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    La consulta de recibos por fecha aún no está conectada al API. No se muestran resultados simulados.
  </Alert>
);

export default PorFecha;
