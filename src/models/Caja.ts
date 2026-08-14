/**
 * Interfaces para Caja
 */
export interface Caja {
  codCaja: number;
  descripcion: string;
  usuario: string | null;
  numcaja: string;
  estado: string;
}

/**
 * Interfaces para AperturaCaja
 */
export interface AperturaCaja {
  codAperturaCaja?: number;
  codAsignacionCaja: number | null;
  fecha?: string;
  montoApertura: number;
  montoCierre?: number;
  estado?: 'ABIERTA' | 'CERRADA' | string;
  fechaApertura?: string;
  fechaCierre?: string;
  observacion?: string | null;
  numeroApertura?: string;
  caja?: string;
  turno?: string;
  diferencia?: number;
  tipoDiferencia?: string;
  fechaStr?: string | null;
  codUsuario?: number | null;
}

export interface AperturaCajaDTO {
  observacion: string;
  montoApertura: number;
  codUsuario: number;
}

export interface CierreCajaDTO {
  codAperturaCaja: number;
  codAsignacionCaja: number | null;
  observacion: string;
  montoCierre: number;
  codUsuario: number;
}

/**
 * Interfaces para AsignacionCaja
 */
export interface AsignacionCaja {
  codAsignacionCaja: number;
  codUsuario: number | null;
  codCaja: number | null;
  codTurno: number | null;
  fecha: string | null;
  terminoBusqueda: string | null;
  numCaja: string;
  nombreUsuario: string;
  turno: string;
  estado: string;
  fechaStr: string;
}

export interface CreateAsignacionCajaDTO {
  codUsuario: number;
  codCaja: number;
  codTurno: number;
  fecha: string;
  usuario?: number;
}

export interface UpdateAsignacionCajaDTO {
  codAsignacionCaja: number;
  codUsuario: number;
  codCaja: number;
  codTurno: number;
  usuario?: number;
}

/**
 * Interfaces para Pagos
 */
export interface ContribuyenteOption {
  id: string | number;
  label: string;
  documento: string;
  direccion: string;
  codigo?: string | number;
  dniRuc?: string | number;
  contribuyente?: string;
  nombreCompleto?: string;
  codigoPredio?: string | number;
  direccionPredio?: string;
}

export interface ConceptoDetalle {
  id: string;
  descripcion: string;
  total: number;
}

export interface Pago {
  codigo: string;
  rucDni: string;
  contribuyente: ContribuyenteOption | null;
  direccion: string;
  fechaRecibo: Date | null;
  descripcion: string;
  conceptos: ConceptoDetalle[];
  formaPago: string;
  total: number;
}
