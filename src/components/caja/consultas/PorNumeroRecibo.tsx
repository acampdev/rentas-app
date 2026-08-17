import type { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface PorNumeroReciboProps {
  onExportPdf?: () => void;
}

const PorNumeroRecibo: FC<PorNumeroReciboProps> = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    La consulta por número de recibo aún no está conectada al API. No se muestran recibos simulados.
  </Alert>
);

export default PorNumeroRecibo;
