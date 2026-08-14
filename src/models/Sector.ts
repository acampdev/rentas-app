/**
 * Modelo que representa un Sector
 */
export interface Sector {
  id: number;
  nombre: string;
  cuadrante: number;
  nombreCuadrante: string;
  codUnidadUrbana: number;
  unidadUrbana: string;
  estado: string;
  descripcion?: string;
}

/**
 * Datos para el formulario de Sector
 */
export interface SectorFormData {
  nombreSector: string;
  codCuadrante: number;
  codUnidadUrbana: number;
}
