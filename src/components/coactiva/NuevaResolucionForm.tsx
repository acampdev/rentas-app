import { Alert, AlertTitle } from '@mui/material';

const NuevaResolucionForm = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    El registro de resoluciones coactivas aún no está conectado al API. No se procesan búsquedas ni registros simulados.
  </Alert>
);

export default NuevaResolucionForm;
