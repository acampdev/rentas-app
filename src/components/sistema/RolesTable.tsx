import type { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface Rol {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  permisos: number;
  usuarios: number;
  estado: 'Activo' | 'Inactivo';
}

interface RolesTableProps {
  onEdit?: (rol: Rol) => void;
  onDelete?: (rol: Rol) => void;
  onAdd?: () => void;
}

const RolesTable: FC<RolesTableProps> = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    Esta consulta de roles aún no está conectada al API. No se muestran roles de ejemplo ni se habilitan acciones simuladas.
  </Alert>
);

export default RolesTable;
