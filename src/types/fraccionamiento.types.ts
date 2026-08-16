// src/types/fraccionamiento.types.ts

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
  estado: EstadoFraccionamiento;
  observaciones?: string;
  aprobadoPor?: string;
  motivoRechazo?: string;
  deudas?: DeudaFraccionamiento[];
  cronograma?: CuotaFraccionamiento[];

  // Nuevos campos de la API de Convenio/Fraccionamiento
  codContribuyente?: number;
  tipo?: string | null;
  tipoResolucion?: string;
  deudaInsoluta?: number;
  cuotaInicial?: number;
  codTipoInteres?: string | null;
  codClaseInteres?: string | null;
  anioDeudaInicio?: number;
  periodoInicio?: number;
  anioDeudaFin?: number;
  periodoFin?: number;
  solicitante?: string;
  tipoDocumento?: string;
  numDocumento?: string;
  cargo?: string;
  codUsuario?: number | null;
  anioResoAnterior?: number | null;
  codResoAnterior?: number | null;
  anio?: number;
  capitalNeto?: number | null;
  tasaMensual?: number;
  totalInteres?: number;
  totalFraccionado?: number;
  codResolucion?: number;
}

export interface DeudaFraccionamiento {
  id?: number;
  idFraccionamiento?: number;
  codigoDeuda: string;
  concepto: string;
  periodo: string;
  montoOriginal: number;
  montoInteres: number;
  montoTotal: number;
  seleccionada?: boolean;
}

export interface CuotaFraccionamiento {
  id?: number;
  idFraccionamiento?: number;
  numeroCuota: number;
  fechaVencimiento: Date | string;
  montoCapital: number;
  montoInteres: number;
  montoTotal: number;
  estado: EstadoCuota;
  fechaPago?: Date | string | null;
  montoPagado?: number | null;
  observaciones?: string;

  // Nuevos campos de la API de Cronograma
  anio?: number;
  codResolucion?: number;
  saldoInicio?: number;
  interes?: number;
  amortizacion?: number;
  montoCuota?: number;
  pagado?: boolean;
  numeroPago?: number | null;
}

export interface CronogramaContribuyente {
  anio: number;
  codResolucion: number;
  numeroCuota: number;
  saldoInicio: number;
  interes: number;
  amortizacion: number;
  montoCuota: number;
  fechaVencimiento: string;
  pagado: boolean;
  fechaPago: string | null;
  montoPagado: number | null;
  numeroPago: number | null;
  codContribuyente: number;
}

export type EstadoFraccionamiento = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'VIGENTE' | 'CANCELADO' | 'VENCIDO';

export type EstadoCuota = 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'PARCIAL';

export interface SolicitudFraccionamientoForm {
  codigoContribuyente: string;
  nombreContribuyente: string;
  deudas: DeudaFraccionamiento[];
  montoTotal: number;
  montoCuotaInicial: number;
  numeroCuotas: number;
  tasaInteres: number;
  observaciones?: string;
}

export interface CreateFraccionamientoDTO {
  codContribuyente: number;
  tipo?: string | null;
  tipoResolucion: string;
  deudaInsoluta: number;
  cuotaInicial: number;
  numeroCuotas: number;
  codTipoInteres?: string | null;
  codClaseInteres?: string | null;
  anioDeudaInicio: number;
  periodoInicio: number;
  anioDeudaFin: number;
  periodoFin: number;
  solicitante: string;
  tipoDocumento: string;
  numDocumento: string;
  cargo: string;
  codUsuario: number;
  anioResoAnterior: number | null;
  codResoAnterior: number | null;
  anio: number;
}

export interface AprobacionFraccionamientoForm {
  id: number;
  aprobado: boolean;
  observaciones?: string;
  motivoRechazo?: string;
  tasaInteres?: number;
  numeroCuotas?: number;
}

export interface FraccionamientoFiltros {
  codigoFraccionamiento?: string;
  codigoContribuyente?: string;
  nombreContribuyente?: string;
  estado?: EstadoFraccionamiento;
  fechaDesde?: Date | string;
  fechaHasta?: Date | string;
  // Campos de paginación y búsqueda (QueryParams)
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

export interface EstadisticasFraccionamiento {
  totalSolicitudes: number;
  solicitudesPendientes: number;
  solicitudesAprobadas: number;
  solicitudesRechazadas: number;
  fraccionamientosVigentes: number;
  fraccionamientosCancelados: number;
  montoTotalFraccionado: number;
  montoRecaudado: number;
  montoPendiente: number;
}
