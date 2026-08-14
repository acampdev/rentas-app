/**
 * Modelo que representa un Arancel
 */
export interface Arancel {
  codArancel: number | null;
  anio: number;
  codDireccion: number;
  costo: number | null;
  codUsuario?: number | null;
  costoArancel: number;
  direccionCompleta: string;
  sector: string;
  barrio: string;
  calle: string;
}

/**
 * Datos para el formulario de Arancel
 */
export interface ArancelFormData {
  anio: number;
  codDireccion: number;
  costoArancel: number;
}
