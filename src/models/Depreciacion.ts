/**
 * Modelo que representa un valor de Depreciación
 */
export interface Depreciacion {
  id: number;
  anio: number;
  codTipoCasa: string;
  tipoCasa: string;
  material: string;
  antiguedad: string;
  porcMuyBueno: number;
  porcBueno: number;
  porcRegular: number;
  porcMalo: number;
  estado: string;
}

/**
 * Datos para el formulario de Depreciación
 */
export interface DepreciacionFormData {
  anio: string;
  codTipoCasa: string;
  codNivelAntiguedad: string;
  codMaterialEstructural: string;
  muyBueno: number;
  bueno: number;
  regular: number;
  malo: number;
}
