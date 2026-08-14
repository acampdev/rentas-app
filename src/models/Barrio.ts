/**
 * Modelo que representa un Barrio
 */
export interface Barrio {
  id: number;
  nombre: string;
  codSector: number;
  descripcion?: string;
  estado: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
}

/**
 * Datos para el formulario de Barrio
 */
export interface BarrioFormData {
  nombreBarrio: string;
  codSector: number;
  descripcion?: string;
}
