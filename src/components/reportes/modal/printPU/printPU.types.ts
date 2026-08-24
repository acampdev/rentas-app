import type { PUData } from "../../../../services/puService";

export type PrintPageSize = "A4" | "OFICIO";

export interface PrintPUContribuyente {
  codigo?: string | number;
  contribuyente?: string;
  nombreCompleto?: string;
  numDocumento?: string;
  dni?: string;
}

export interface PrintablePUData extends PUData {
  barrio?: string;
  sector?: string;
  numDomicilio?: string;
}

export interface PrintPUProps {
  isOpen: boolean;
  onClose: () => void;
  contribuyente: PrintPUContribuyente | null;
  puData: PrintablePUData[];
}
