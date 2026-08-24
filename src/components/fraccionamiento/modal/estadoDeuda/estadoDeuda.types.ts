import type { ContribuyenteListItem } from "../../../../hooks/useContribuyentes";
import type { Fraccionamiento } from "../../../../types/fraccionamiento.types";

export interface EstadoDeudaProps {
  open: boolean;
  onClose: () => void;
  fraccionamiento: Fraccionamiento | null;
  contribuyente?: ContribuyenteListItem | null;
}

export interface DeudaAnualReporte {
  anio: number;
  periodos: Set<number>;
  monto: number;
  interes: number;
  fraccion: number;
  pagoTotal: number;
}

export interface EstadoDeudaIdentity {
  codigo: string | number;
  nombre: string;
  direccion: string;
  usuario: string;
  fechaHora: string;
}

export interface EstadoDeudaTotals {
  monto: number;
  interes: number;
  fraccion: number;
  pagoTotal: number;
}
