import type { MantenedorCajaData } from "../../../services/mantenedorCajaService";

export interface CajasController {
  tab: number;
  setTab: (value: number) => void;
  descripcionRegistro: string;
  setDescripcionRegistro: (value: string) => void;
  editando: MantenedorCajaData | null;
  descripcionBusqueda: string;
  setDescripcionBusqueda: (value: string) => void;
  codUsuarioBusqueda: string;
  setCodUsuarioBusqueda: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  currentPage: number;
  cajas: MantenedorCajaData[];
  cajasPaginadas: MantenedorCajaData[];
  loading: boolean;
  guardar: () => Promise<void>;
  nuevoRegistro: () => void;
  buscar: () => Promise<void>;
  limpiarBusqueda: () => void;
  editar: (caja: MantenedorCajaData) => void;
  eliminar: (caja: MantenedorCajaData) => Promise<void>;
}
