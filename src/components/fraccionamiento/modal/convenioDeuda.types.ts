import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import type {
  CronogramaContribuyente,
  Fraccionamiento,
} from "../../../types/fraccionamiento.types";

export interface ConvenioDeudaProps {
  open: boolean;
  onClose: () => void;
  fraccionamiento: Fraccionamiento | null;
  contribuyente?: ContribuyenteListItem | null;
}
export interface ConvenioTotals {
  amortizacion: number;
  interes: number;
  montoCuota: number;
}
export interface ConvenioViewData {
  cronograma: CronogramaContribuyente[];
  cuotaInicial: number;
  fechaCuotaInicial?: string | Date | null;
  totals: ConvenioTotals;
  nombreContribuyente: string;
  documento: string;
  direccion: string;
  telefono: string;
  usuario: string;
  fechaEmision: string;
}
