import type { Barrio } from "../../models/Barrio";
import type { Sector } from "../../models/Sector";

export interface BarrioListProps {
  barrios: Barrio[];
  sectores?: Sector[];
  onEdit?: (barrio: Barrio) => void;
  onView?: (barrio: Barrio) => void;
  onSelect?: (barrio: Barrio) => void;
  onSelectBarrio?: (barrio: Barrio) => void;
  loading?: boolean;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  selectedBarrio?: Barrio | null;
}

export type BarrioOrder = "asc" | "desc";
export type BarrioOrderBy = keyof Barrio | "sector";
