import type { ContribuyenteListItem } from "../../../../hooks/useContribuyentes";
import type {
  CronogramaContribuyente,
  Fraccionamiento,
} from "../../../../types/fraccionamiento.types";

export interface ResolucionJefaturalProps {
  open: boolean;
  onClose: () => void;
  fraccionamiento: Fraccionamiento | null;
  contribuyente?: ContribuyenteListItem | null;
}
export interface ResolucionJefaturalData {
  cronograma: CronogramaContribuyente[];
  usuario: string;
  codigo: string | number;
  nombre: string;
  documento: string;
  tipoDocumento: string;
  direccion: string;
  fechaResolucion?: Date | string | null;
  cuotaInicial: number;
  deuda?: number | null;
}
