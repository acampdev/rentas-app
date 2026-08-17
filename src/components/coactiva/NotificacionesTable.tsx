import type { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface Notificacion {
  id: number;
  numeroNotificacion: string;
  expediente: string;
  contribuyente: string;
  tipoNotificacion: 'Inicio' | 'Embargo' | 'Remate' | 'Citación';
  fechaNotificacion: string;
  estado: 'Pendiente' | 'Entregada' | 'Devuelta' | 'Rechazada';
  direccion: string;
}

interface NotificacionesTableProps {
  onView?: (notificacion: Notificacion) => void;
  onEdit?: (notificacion: Notificacion) => void;
  onAdd?: () => void;
}

const NotificacionesTable: FC<NotificacionesTableProps> = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    La consulta de notificaciones coactivas aún no está conectada al API. No se muestran notificaciones de ejemplo.
  </Alert>
);

export default NotificacionesTable;
