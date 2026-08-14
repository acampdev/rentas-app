/**
 * Modelo que representa una Dirección
 */
export interface Direccion {
  id: number;
  codSector?: number;
  codBarrio?: number;
  codVia?: number;
  cuadra: string;
  lado: string;
  loteInicial: number;
  loteFinal: number;
  descripcion?: string;
  estado?: boolean;
  
  // Campos adicionales del API
  nombreSector?: string;
  nombreBarrio?: string;
  nombreVia?: string;
  nombreTipoVia?: string;
  codDireccion?: number;
  codUsuario?: number;
}

/**
 * Datos para el formulario de Dirección
 */
export interface DireccionFormData {
  sectorId: number;
  barrioId: number;
  calleId: number;
  cuadra: string;
  lado: string;
  loteInicial: number;
  loteFinal: number;
}
