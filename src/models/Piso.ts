/**
 * Modelo que representa un Piso de un Predio
 */
export interface Piso {
  id: number;
  codPiso?: number;
  item: number;
  descripcion: string;
  numeroPisoDesc?: string;
  valorUnitario: number;
  incremento: number;
  porcentajeDepreciacion: number;
  valorUnicoDepreciado: number;
  valorAreaConstruida: number;
  valorAreasComunes?: number;
  areaConstruida: number | null;
  areaTotalConstruccion: number;
  valorConstruccion?: number;
  fechaConstruccion?: string;
  fechaConstruccionStr?: string;
}

/**
 * Datos para el formulario de Piso
 */
export interface PisoFormData {
  anio: number;
  codPredio: string;
  numeroPiso: number;
  areaConstruida: number;
  fechaConstruccion?: string;
  murosColumnas?: string;
  techos?: string;
  pisos?: string;
  puertasVentanas?: string;
  revestimiento?: string;
  banios?: string;
  instalacionesElectricas?: string;
}
