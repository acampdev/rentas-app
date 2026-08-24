import type { HRData } from "../../../../services/hrService";

export type PrintPageSize = "A4" | "OFICIO";

export interface HRContribuyente {
  codigo?: string | number;
  contribuyente?: string;
  nombreCompleto?: string;
  numDocumento?: string;
  dni?: string;
  direccionFiscal?: string;
}

export interface PrintHRProps {
  isOpen: boolean;
  onClose: () => void;
  contribuyente: HRContribuyente | null;
  hrData: HRData[];
}

export interface HRTotals {
  autoavaluo: number;
  impuestoAnual: number;
  impuestoTrimestral: number;
}
