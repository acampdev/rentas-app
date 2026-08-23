import type { ContribuyenteOption } from "../../../models/Caja";

export type TipoSeleccionMonto = "repartir" | "seleccionar";

export interface SaldoPago {
  codTributo: number;
  anio: number;
  periodo: number;
  abono: number;
  anioResolucion?: number;
  codResolucion?: number;
  numeroCuota?: number;
}

export interface ConceptoPago {
  id: string;
  descripcion: string;
  añosAfectados: number[];
  mesesAfectados: number[];
  total: number;
  detalleMeses: Record<number, number>;
  tributoNombre?: string;
  tipoPago?: "ordinario" | "fraccionamiento";
  saldosDeuda?: SaldoPago[];
}

export interface DatosPagoDeudaOrdinaria {
  montoTotal: number;
  conceptos: ConceptoPago[];
  contribuyente: ContribuyenteOption;
}

export interface DeudaContribuyenteProps {
  open: boolean;
  onClose: () => void;
  contribuyenteData?: ContribuyenteOption | null;
  loading?: boolean;
  onPagoGenerado?: (datos: DatosPagoDeudaOrdinaria) => void;
}

export type SelectedDebtCells = Record<string, string[]>;
