/**
 * Modelo que representa una Unidad Impositiva Tributaria (UIT)
 */
export interface UIT {
  id: number;
  codUit?: number | null;
  anio: number;
  valor: number;
  valorUit?: number;
  valQuinit?: number;
  alicuota?: number;
  rangoInicial?: number;
  rangoFinal?: number;
  impuestoParcial?: number;
  impuestoAcumulado?: number;
  codEpa?: number;
  estado?: string;
  fechaVigenciaDesde?: string;
  fechaVigenciaHasta?: string;
}

/**
 * Datos para el formulario de UIT
 */
export interface UITFormData {
  anio: number;
  valor: number;
  estado?: string;
}
