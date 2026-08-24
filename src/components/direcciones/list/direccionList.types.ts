import type { DireccionData } from "../../../services/direccionService";

export type DireccionOrder = "asc" | "desc";
export type DireccionSortKey =
  | "codigo"
  | "descripcion"
  | "rutaNombre"
  | "zonaNombre"
  | "ubicacionAreaVerdeNombre";

export interface DireccionListProps {
  direcciones: DireccionData[];
  direccionSeleccionada?: DireccionData | null;
  onSelectDireccion: (direccion: DireccionData) => void;
  onEditDireccion?: (direccion: DireccionData) => void;
  loading?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchTerm?: string;
}

export interface DireccionHeadCell {
  id: DireccionSortKey | "actions";
  label: string;
  width: string;
  align?: "left" | "center";
}
