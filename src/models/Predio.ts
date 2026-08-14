/**
 * Modelo que representa un Predio Urbano
 */
export interface Predio {
  id?: number;
  codigoPredio: string;
  codPredioBase?: string;
  anio?: number | null;
  fechaAdquisicion?: Date | string | null;
  condicionPropiedad: string;
  direccionId?: number | null;
  direccion?: string;
  numeroFinca?: string | null;
  otroNumero?: string | null;
  tipoPredio?: string | null;
  conductor: string;
  usoPredio?: string | null;
  estadoPredio?: string;
  areaTerreno: number;
  valorTerreno?: number | null;
  valorConstruccion?: number | null;
  totalAreaConstruccion?: number | null;
  valorTotalConstruccion?: number | null;
  autoavaluo?: number | null;
  numeroPisos?: number | null;
  numeroCondominos?: number | null;
  
  // Códigos de la API
  codPredio?: string;
  codClasificacion?: number | null;
  estPredio?: string | null;
  codTipoPredio?: number | null;
  codCondicionPropiedad?: number | null;
  codDireccion?: number | null;
  codUso?: number | string | null;
  nombreUso?: string | null;
  direccionCompleta?: string | null;
  codListaConductor?: number | null;
  codUbicacionAreaVerde?: number | null;
  codEstado?: number | null;
  codUsuario?: number | null;
  costoArancel?: number | null;
}

/**
 * Tipo para el formulario de Predio
 */
export interface PredioFormData {
  anio?: number;
  fechaAdquisicion?: Date | string | null;
  condicionPropiedad: string;
  direccionId?: number;
  direccion?: string;
  numeroFinca?: string;
  otroNumero?: string;
  tipoPredio?: string;
  conductor: string;
  usoPredio?: string;
  estadoPredio?: string;
  clasificacionPredio?: string;
  areaTerreno: number;
  valorTerreno?: number;
  valorConstruccion?: number;
  totalAreaConstruccion?: number;
  valorTotalConstruccion?: number;
  autoavaluo?: number;
  numeroPisos?: number;
  numeroCondominos?: number;
}

/**
 * Interfaz para filtros de búsqueda
 */
export interface FiltroPredio {
  codigoPredio?: string;
  anio?: number;
  codPredioBase?: string;
  parametroBusqueda?: string;
}
