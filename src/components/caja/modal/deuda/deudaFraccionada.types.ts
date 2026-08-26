import type { Dispatch, SetStateAction } from "react";
import type { EstadoCuentaDetalle } from "../../../../services/cuentaCorrienteService";

export interface CuotaFraccionamiento {
  nCuota: number;
  deuda: number;
  im: number;
  cuota: number;
  fVenc: string;
  checked: boolean;
  pagado?: boolean;
}

export interface ResolucionFraccionamiento {
  año: number;
  resolucion: string;
  codResolucion: number;
  cuotas: CuotaFraccionamiento[];
}

export interface TributoFraccionado {
  anio: number;
  tributo: string;
  valores: number[];
}

export interface DeudaFraccionadaProps {
  codContribuyente: number | string;
  allDetails: { year: number; details: EstadoCuentaDetalle[] }[];
  cuotasFraccionamiento: CuotaFraccionamiento[];
  setCuotasFraccionamiento?: Dispatch<SetStateAction<CuotaFraccionamiento[]>>;
  selectedAño: number | null;
  setSelectedAño?: (año: number | null) => void;
  selectedResolucion?: string;
  setSelectedResolucion?: (resolucion: string) => void;
  selectedResolucionCode?: number | null;
  setSelectedResolucionCode?: (code: number | null) => void;
  montoFraccionado: string;
  setMontoFraccionado?: (monto: string) => void;
  setMontoAPagar?: (monto: string) => void;
  setTributosFraccionados?: Dispatch<SetStateAction<TributoFraccionado[]>>;
  getCellColorFraccionamiento: (rowIndex: number, mesIndex: number) => string;
}
