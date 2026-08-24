import type { ArancelData } from "../../../services/arancelService";

export interface SelectorDireccionArancelProps {
  open: boolean;
  onClose: () => void;
  onSelectArancel?: (arancel: ArancelData) => void;
  title?: string;
  useGeneralApi?: boolean;
}

export interface SelectorDireccionArancelController {
  selectedArancel: ArancelData | null;
  anioSeleccionado: number | null;
  codDireccionBusqueda: number | null;
  parametroBusqueda: string;
  page: number;
  rowsPerPage: number;
  arancelesEncontrados: ArancelData[];
  arancelesPaginados: ArancelData[];
  loadingBusqueda: boolean;
  setSelectedArancel: (value: ArancelData | null) => void;
  setAnioSeleccionado: (value: number | null) => void;
  setCodDireccionBusqueda: (value: number | null) => void;
  setParametroBusqueda: (value: string) => void;
  setPage: (value: number) => void;
  setRowsPerPage: (value: number) => void;
  buscarPorCodDireccion: () => Promise<void>;
  buscarConApiGeneral: () => Promise<void>;
  confirmSelection: () => void;
  close: () => void;
}
