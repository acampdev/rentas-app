import type { TimData } from "../../../services/timService";

export interface TimFormValues {
  anio: number;
  tasa: string;
  periodo: number;
  tributo: number | string;
  resolucionInteres: number;
}

export interface TimSearchValues {
  anio: number;
  periodo: number;
  tributo: number | string;
  resolucionInteres: number;
}

export interface TimOption {
  value: string | number;
  label: string;
}

export interface TimSearchState {
  results: TimData[];
  loading: boolean;
  searched: boolean;
}
