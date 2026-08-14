/**
 * Modelo que representa un Fraccionamiento de deuda
 */
export interface Fraccionamiento {
  id?: number;
  codigoFraccionamiento?: string;
  codigoContribuyente: string;
  nombreContribuyente?: string;
  fechaSolicitud: Date | string;
  fechaAprobacion?: Date | string;
  montoTotal: number;
  montoCuotaInicial: number;
  numeroCuotas: number;
  montoCuota: number;
  tasaInteres: number;
  estado: string;
  observaciones?: string;
  aprobadoPor?: string;
  motivoRechazo?: string;
}

/**
 * Modelo para las cuotas de un fraccionamiento
 */
export interface CuotaFraccionamiento {
  numeroCuota: number;
  fechaVencimiento: string;
  montoAmortizacion: number;
  montoInteres: number;
  montoTotal: number;
  estado: string;
}
