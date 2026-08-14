/**
 * Modelo que representa una tasa de Alcabala
 */
export interface Alcabala {
  id: number;
  anio: number;
  tasa: number;
  estado: string;
}

/**
 * Datos para el formulario de Alcabala
 */
export interface AlcabalaFormData {
  anio: number | null;
  tasa: number;
}
