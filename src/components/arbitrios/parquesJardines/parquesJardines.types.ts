import type { OptionFormat } from "../../../hooks/useConstantesOptions";

export interface ParquesJardinesFormState {
  anio: number;
  ruta: OptionFormat | null;
  ubicacion: OptionFormat | null;
  tasaAnual: string;
  editing: boolean;
}

export interface ParquesMatrixRow {
  ubicacionLabel: string;
  codUbicacion: string | number;
  rates: Record<string, number | null>;
}

export interface ParquesMatrix {
  rows: ParquesMatrixRow[];
  routes: OptionFormat[];
  locations: OptionFormat[];
}
