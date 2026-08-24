import type { OptionFormat } from "../../hooks/useConstantesOptions";
import type { LimpiezaPublicaData } from "../../services/limpiezaPublicaService";

export interface ZonaOption {
  id: number;
  label: string;
}
export interface LimpiezaPublicaController {
  tabValue: number;
  setTabValue: (value: number) => void;
  anioRegistro: number;
  setAnioRegistro: (value: number) => void;
  anioBusqueda: number;
  setAnioBusqueda: (value: number) => void;
  zonaSel: ZonaOption | null;
  setZonaSel: (value: ZonaOption | null) => void;
  criterioSel: OptionFormat | null;
  setCriterioSel: (value: OptionFormat | null) => void;
  tasaVal: string;
  setTasaVal: (value: string) => void;
  registroEditando: LimpiezaPublicaData | null;
  zonas: ZonaOption[];
  criterios: OptionFormat[];
  currentList: LimpiezaPublicaData[];
  loading: boolean;
  isButtonDisabled: boolean;
  limpiar: () => void;
  buscar: () => void;
  guardar: () => Promise<void>;
  editar: (row: LimpiezaPublicaData) => void;
}
