import { Alert, AlertTitle } from '@mui/material';

const NuevaNotificacionForm = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    El registro de notificaciones coactivas aún no está conectado al API. No se procesan búsquedas ni registros simulados.
  </Alert>
);

export default NuevaNotificacionForm;
