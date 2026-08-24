import type { OptionFormat } from '../../../hooks/useConstantesOptions';

export interface ContribuyenteSeleccionado {
  codigo: string;
  nombre: string;
}

export interface SelectorContribuyenteValue {
  codigo?: string | number;
  contribuyente?: string;
  nombreCompleto?: string;
  numDocumento?: string;
  dni?: string;
  documento?: string;
  tipoDocumento?: string | number;
}

export interface SolicitudFraccionamientoValues {
  tipoResolucion: string;
  deudaInsoluta: string;
  cuotaInicial: string;
  numeroCuotas: string;
  anioDeudaInicio: string;
  periodoInicio: string;
  anioDeudaFin: string;
  periodoFin: string;
  solicitante: string;
  tipoDocumento: string;
  numDocumento: string;
  cargo: string;
  anioResoAnterior: string;
  codResoAnterior: string;
}

export type SolicitudFieldChange = <K extends keyof SolicitudFraccionamientoValues>(
  field: K,
  value: SolicitudFraccionamientoValues[K],
) => void;

export interface SolicitudOptions {
  tipoFraccionamiento: OptionFormat[];
  tipoDocumento: OptionFormat[];
  loadingTiposFraccionamiento: boolean;
}
