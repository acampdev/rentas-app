/**
 * Modelo para Roles del Sistema
 */
export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
  fechaCreacion: string;
  estado: 'Activo' | 'Inactivo';
}

/**
 * Modelo para Auditoría de Operaciones
 */
export interface AuditoriaOperacion {
  id: number;
  fecha: string;
  usuario: string;
  modulo: string;
  operacion: string;
  detalle: string;
  ip: string;
}
