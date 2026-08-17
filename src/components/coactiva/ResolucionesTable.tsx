import type { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface Resolucion {
  id: number;
  numeroResolucion: string;
  expediente: string;
  tipo: 'Inicio' | 'Embargo' | 'Remate' | 'Archivo';
  contribuyente: string;
  fechaEmision: string;
  estado: 'Vigente' | 'Ejecutada' | 'Anulada';
}

interface ResolucionesTableProps {
  onView?: (resolucion: Resolucion) => void;
  onEdit?: (resolucion: Resolucion) => void;
  onAdd?: () => void;
}

const ResolucionesTable: FC<ResolucionesTableProps> = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    La consulta de resoluciones coactivas aún no está conectada al API. No se muestran resoluciones de ejemplo.
  </Alert>
);

export default ResolucionesTable;
