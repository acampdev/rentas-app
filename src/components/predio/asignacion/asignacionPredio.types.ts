import type { Predio } from "../../../models/Predio";
import type { CreateAsignacionAPIDTO } from "../../../services/asignacionService";

export interface AsignacionContribuyente {
  codigo: number | string;
  nombreCompleto: string;
}
export interface AsignacionFormData {
  contribuyente: AsignacionContribuyente | null;
  predio: Predio | null;
  modoDeclaracion: string;
  fechaVenta: Date | null;
  fechaDeclaracion: Date | null;
  porcentajeCondomino: string;
}
export interface DatosEdicionAsignacion {
  anio?: number;
  codPredio?: string;
  codPredioBase?: number | null;
  codContribuyente?: number | string;
  codAsignacion?: number | string | null;
  nombreContribuyente?: string;
  codPredioContribuyente?: number | null;
  direccionCompleta?: string;
  autoavaluo?: number;
  baseImponible?: number;
  impuestoAnual?: number;
  porcentajeCondomino?: number | null;
  porcentajeCondominoDesc?: string;
  fechaDeclaracion?: string;
  fechaVenta?: string;
  fechaDeclaracionStr?: string;
  fechaVentaStr?: string;
  codModoDeclaracion?: string;
  modoDeclaracion?: string;
  pensionista?: number;
  pensionistaDesc?: string;
  codEstado?: string;
  estado?: string;
  codUsuario?: number | null;
}
export interface AsignacionPredioProps {
  onCrearAsignacion?: (datos: CreateAsignacionAPIDTO) => Promise<unknown>;
  onActualizarAsignacion?: (datos: CreateAsignacionAPIDTO) => Promise<unknown>;
  onDesasignar?: (datos: CreateAsignacionAPIDTO) => Promise<unknown>;
  loading?: boolean;
  error?: string | null;
  isEditMode?: boolean;
  isDesasignarMode?: boolean;
  datosEdicion?: DatosEdicionAsignacion | null;
}
export const EMPTY_ASSIGNMENT: AsignacionFormData = {
  contribuyente: null,
  predio: null,
  modoDeclaracion: "",
  fechaVenta: null,
  fechaDeclaracion: null,
  porcentajeCondomino: "",
};
