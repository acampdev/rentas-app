import type { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface Usuario {
  id: number;
  codigo: string;
  nombre: string;
  email: string;
  rol: string;
  estado: 'Activo' | 'Inactivo';
  ultimoAcceso: string;
}

interface UsuariosTableProps {
  onEdit?: (usuario: Usuario) => void;
  onDelete?: (usuario: Usuario) => void;
  onAdd?: () => void;
}

const UsuariosTable: FC<UsuariosTableProps> = () => (
  <Alert severity="warning" variant="outlined">
    <AlertTitle>Módulo no disponible</AlertTitle>
    Esta consulta de usuarios y roles aún no está conectada al API. No se muestran usuarios de ejemplo ni se habilitan acciones simuladas.
  </Alert>
);

export default UsuariosTable;
