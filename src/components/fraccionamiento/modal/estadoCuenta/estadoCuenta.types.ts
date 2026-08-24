import type { ContribuyenteListItem } from "../../../../hooks/useContribuyentes";
import type {
  CronogramaContribuyente,
  Fraccionamiento,
} from "../../../../types/fraccionamiento.types";

export interface EstadoCuentaProps {
  open: boolean;
  onClose: () => void;
  fraccionamiento: Fraccionamiento | null;
  contribuyente?: ContribuyenteListItem | null;
}

export interface EstadoCuentaViewData {
  cronograma: CronogramaContribuyente[];
  codigo: string | number;
  nombre: string;
  direccion: string;
  usuario: string;
  fechaEmision: string;
  fechaCuotaInicial?: Date | string | null;
  periodo: string;
  deudaFraccionada?: number | null;
  cuotaInicial?: number | null;
  saldoPendiente: number;
}
