import type { Sector } from "../../../models/Sector";

export type SectorOrder = "asc" | "desc";
export type SectorSortKey =
  "id" | "nombre" | "nombreCuadrante" | "unidadUrbana";

export interface SectorListProps {
  sectores: Sector[];
  onSelectSector: (sector: Sector) => void;
  onEdit?: (sector: Sector) => void;
  isOfflineMode?: boolean;
  loading?: boolean;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  selectedSector?: Sector | null;
}

export interface SectorHeadCell {
  id: SectorSortKey | "acciones";
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}
