import type { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface PorContribuyenteProps {
  onExportPdf?: () => void;
}

const PorContribuyente: FC<PorContribuyenteProps> = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    La consulta de caja por contribuyente aún no está conectada al API. No se muestran contribuyentes ni recibos simulados.
  </Alert>
);

export default PorContribuyente;
