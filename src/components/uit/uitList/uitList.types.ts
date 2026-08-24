import type { GridPaginationModel } from "@mui/x-data-grid";
import type { UITData } from "../../../services/uitService";

export interface UitListProps {
  uits: UITData[];
  onEditar?: (uit: UITData) => void;
  loading?: boolean;
  uitSeleccionada?: UITData | null;
}

export interface UitListController {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  rows: UITData[];
  isSearching: boolean;
  hasSearched: boolean;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  search: () => Promise<void>;
  clearSearch: () => void;
  handleSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
