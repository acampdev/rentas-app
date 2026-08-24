export interface PredioData {
  anio?: number;
  codPredio?: string;
  codPredioBase?: string;
  numeroFinca?: string | null;
  otroNumero?: string | null;
  codClasificacion?: string | null;
  estPredio?: string | null;
  codTipoPredio?: string | null;
  codCondicionPropiedad?: string | null;
  codDireccion?: string | null;
  codUsoPredio?: string | null;
  fechaAdquisicion?: string | null;
  numeroCondominos?: string;
  codListaConductor?: string;
  codUbicacionAreaVerde?: string | null;
  areaTerreno?: number;
  numeroPisos?: number;
  totalAreaConstruccion?: number | null;
  valorTotalConstruccion?: number | null;
  valorTerreno?: number | null;
  valorOtrasInstalaciones?: number | null;
  autoavaluo?: number;
  codEstado?: string | null;
  rutaImagenPlano?: string | null;
  codUsuario?: number | null;
  direccion?: string;
  conductor?: string;
  estadoPredio?: string;
  condicionPropiedad?: string;
  codGrupoUso?: number | null;
  descripcionUso?: string | null;
  parametroBusqueda?: string | null;
  nombreSectorCompleto?: string;
  costoArancel?: number | null;
}

export interface CreatePredioDTO {
  anio: number;
  codPredio: null;
  numeroFinca: number;
  otroNumero: string;
  codClasificacion: string;
  estPredio: string;
  codTipoPredio: string;
  codCondicionPropiedad: string;
  codDireccion: number;
  codUsoPredio: number | null;
  fechaAdquisicion: string;
  numeroCondominos: number;
  codListaConductor: string;
  codUbicacionAreaVerde: number;
  areaTerreno: number;
  totalAreaConstruccion: number | null;
  valorTotalConstruccion: number | null;
  valorTerreno: number | null;
  autoavaluo: number | null;
  codEstado: string;
  codUsuario: number;
}

export interface BusquedaPredioParams {
  codPredio?: string;
  anio?: number;
  direccion?: number;
  codPredioBase?: string;
  parametroBusqueda?: string;
}

export interface PredioRaw {
  anio?: number;
  codPredio?: string;
  codPredioBase?: string | number;
  numeroFinca?: string | number | null;
  otroNumero?: string | null;
  codClasificacion?: string | number | null;
  estPredio?: string | null;
  codTipoPredio?: string | number | null;
  codCondicionPropiedad?: string | number | null;
  codDireccion?: string | number | null;
  codUsoPredio?: string | number | null;
  codUso?: string | number | null;
  fechaAdquisicion?: string | null;
  fechaAdquisicionStr?: string | null;
  numeroCondominos?: string | number;
  codListaConductor?: string | number;
  codUbicacionAreaVerde?: string | number | null;
  areaTerreno?: string | number;
  numeroPisos?: string | number;
  totalAreaConstruccion?: string | number | null;
  areaTotalConstruida?: string | number | null;
  valorTotalConstruccion?: string | number | null;
  valorTerreno?: string | number | null;
  valorOtrasInstalaciones?: string | number | null;
  autoavaluo?: string | number | null;
  codEstado?: string | null;
  codEstadoPredio?: string | null;
  rutaImagenPlano?: string | null;
  codUsuario?: number | null;
  direccion?: string;
  conductor?: string;
  estadoPredio?: string;
  condicionPropiedad?: string;
  codGrupoUso?: number | null;
  descripcionUso?: string | null;
  parametroBusqueda?: string | null;
  nombreSectorCompleto?: string;
  costoArancel?: string | number | null;
}

export interface PredioEstadisticas {
  total: number;
  porEstado: Record<string, number>;
  porCondicion: Record<string, number>;
  areaTerrenoTotal: number;
  areaConstruidaTotal: number;
}
export interface UsoPredio {
  codUsoPredio: number;
  codGrupoUso: number;
  descripcionUso: string;
}
export interface UsoPredioRaw {
  codUsoPredio?: number | string;
  codUso?: number | string;
  codigo?: number | string;
  codGrupoUso?: number | string;
  descripcionUso?: string;
  descripcion?: string;
  nombreUso?: string;
}
export type PredioListResponse =
  PredioRaw[] | { data?: PredioRaw[] | PredioRaw; success?: boolean };
