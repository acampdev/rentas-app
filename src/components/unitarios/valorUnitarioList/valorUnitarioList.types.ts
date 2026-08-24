import type { ValorUnitarioData } from "../../../services/valorUnitarioService";

export interface ValorUnitarioListProps {
  años: { value: string; label: string }[];
  añoSeleccionado?: number | null;
  onValorSeleccionado?: (value: ValorUnitarioData) => void;
  onEliminar?: (id: string) => void;
  onAnioChange?: (year: number) => void;
  valoresUnitarios?: ValorUnitarioData[];
  loading?: boolean;
}

export interface SubcategoriaMatriz {
  cod: string;
  nombre: string;
  equivalentes: string[];
}
