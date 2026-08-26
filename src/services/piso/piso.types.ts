export interface PisoData {
  operationMessage?: string;
  id: number;
  codigoPredio: number | string;
  numeroPiso: number;
  numeroPisoDesc?: string;
  areaConstruida: number | null;
  areaTotalConstruccion?: number;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number | null;
  anio?: number | null;
  codPredio?: string;
  codPredioBase?: string | null;
  codPiso?: number;
  fechaConstruccion?: string | null;
  fechaConstruccionStr?: string | null;
  codLetraMurosColumnas?: string | null;
  murosColumnas?: string | null;
  codLetraTechos?: string | null;
  techos?: string | null;
  codLetraPisos?: string | null;
  pisos?: string | null;
  codLetraPuertasVentanas?: string | null;
  puertasVentanas?: string | null;
  codLetraRevestimiento?: string | null;
  revestimiento?: string | null;
  codLetraBanios?: string | null;
  banios?: string | null;
  codLetraInstalacionesElectricas?: string | null;
  instalacionesElectricas?: string | null;
  codEstadoConservacion?: string | null;
  codMaterialEstructural?: string | null;
  codEstado?: string | null;
  codGrupoUso?: string | null;
  codUbicacionAreaVerde?: string | null;
  descripcionUso?: string | null;
  valorUnitario?: number;
  incremento?: number;
  depreciacion?: number;
  montoDepreciacion?: number | null;
  valorUnitarioDepreciado?: number | null;
  valorAreaConstruida?: number | null;
  valorAreasComunes?: number | null;
  valorConstruccion?: number | null;
  valorOtrasInstalaciones?: number | null;
  valorTerreno?: number | null;
  valorTotalConstruccion?: number | null;
  autoavaluo?: number | null;
  totalAreaConstruccion?: number | null;
  numeroCondominos?: number | null;
  nombreSectorCompleto?: string | null;
  direccion?: string | null;
  rutaImagenPlano?: string | null;
  parametroBusqueda?: string | null;
}

export interface CreatePisoApiDTO {
  anio: number;
  codPredio: string;
  codPiso: number;
  numeroPiso: number;
  fechaConstruccion: string;
  murosColumnas: string;
  techos: string;
  pisos: string;
  puertasVentanas: string;
  revestimiento: string;
  banios: string;
  instalacionesElectricas: string;
  codLetraMurosColumnas: string;
  codLetraTechos: string;
  codLetraPisos: string;
  codLetraPuertasVentanas: string;
  codLetraRevestimiento: string;
  codLetraBanios: string;
  codLetraInstalacionesElectricas: string;
  codEstadoConservacion: string;
  codMaterialEstructural: string;
  areaConstruida: string;
  valorAreasComunes: string;
  codUsuario: number;
}

export interface PisoRaw {
  codPiso?: number;
  id?: number;
  anio?: number;
  codPredio?: string | number;
  codPredioBase?: string | number | null;
  numeroPiso?: number | null;
  numeroPisoDesc?: string | null;
  areaConstruida?: number | string | null;
  totalAreaConstruccion?: number | string | null;
  areaTotalConstruccion?: number | string | null;
  estado?: string;
  estPredio?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number | null;
  fechaConstruccion?: string | number | null;
  fechaConstruccionStr?: string | null;
  codLetraMurosColumnas?: string | null;
  murosColumnas?: string | null;
  codLetraTechos?: string | null;
  techos?: string | null;
  codLetraPisos?: string | null;
  pisos?: string | null;
  codLetraPuertasVentanas?: string | null;
  puertasVentanas?: string | null;
  codLetraRevestimiento?: string | null;
  revestimiento?: string | null;
  codLetraBanios?: string | null;
  banios?: string | null;
  codLetraInstalacionesElectricas?: string | null;
  instalacionesElectricas?: string | null;
  codEstadoConservacion?: string | null;
  codMaterialEstructural?: string | null;
  codEstado?: string | null;
  codGrupoUso?: string | null;
  codUbicacionAreaVerde?: string | null;
  descripcionUso?: string | null;
  valorUnitario?: number | string | null;
  incremento?: number | string | null;
  depreciacion?: number | string | null;
  montoDepreciacion?: number | string | null;
  valorUnitarioDepreciated?: number | string | null;
  valorUnitarioDepreciado?: number | string | null;
  valorAreaConstruida?: number | string | null;
  valorAreasComunes?: number | string | null;
  valorConstruccion?: number | string | null;
  valorOtrasInstalaciones?: number | string | null;
  valorTerreno?: number | string | null;
  valorTotalConstruccion?: number | string | null;
  autoavaluo?: number | string | null;
  numeroCondominos?: number | string | null;
  nombreSectorCompleto?: string | null;
  direccion?: string | null;
  rutaImagenPlano?: string | null;
  parametroBusqueda?: string | null;
}

export interface PisoQuery {
  codPiso?: number;
  anio?: number;
  codPredio?: string;
  codPredioBase?: string;
  numeroPiso?: number;
}
export interface PisoEditQuery {
  anio: number;
  codPredioBase: string;
  numeroPiso: number;
}
export interface PisoDeleteQuery {
  anio: number;
  codPredio: string;
  numeroPiso: number;
  codPiso?: number;
}
export interface PisoMutationResponse {
  data?: PisoRaw | string;
  success?: boolean;
  message?: string;
  error?: boolean | string;
  descripcion?: string;
  codigo?: string;
  mensaje?: string;
}
