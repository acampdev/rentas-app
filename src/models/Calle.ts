/**
 * Modelo que representa una Calle o Vía
 */
export interface Calle {
  id?: number;
  codVia?: number;
  nombreVia: string;
  codTipoVia: string | number;
  nombreTipoVia?: string;
  descTipoVia?: string;
  codBarrio?: number;
  codigoBarrio?: number;
  nombreBarrio?: string;
  codSector?: number;
  nombreSector?: string;
}

/**
 * Datos para el formulario de Calle
 */
export interface CalleFormData {
  tipoVia: number;
  codSector: number;
  codBarrio: number;
  nombreCalle: string;
}
