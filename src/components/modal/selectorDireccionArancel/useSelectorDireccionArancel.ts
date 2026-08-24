import { useCallback, useEffect, useMemo, useState } from "react";
import arancelService, {
  type ArancelData,
} from "../../../services/arancelService";
import { getAuthenticatedUserCode } from "../../../config/api.unified.config";
import { NotificationService } from "../../utils/Notification";
import { filterAranceles } from "./selectorDireccionArancel.adapters";
import type {
  SelectorDireccionArancelController,
  SelectorDireccionArancelProps,
} from "./selectorDireccionArancel.types";

type ControllerProps = Pick<
  SelectorDireccionArancelProps,
  "open" | "onClose" | "onSelectArancel" | "useGeneralApi"
>;

const currentYear = () => new Date().getFullYear();

export const useSelectorDireccionArancel = ({
  open,
  onClose,
  onSelectArancel,
  useGeneralApi = true,
}: ControllerProps): SelectorDireccionArancelController => {
  const [selectedArancel, setSelectedArancel] = useState<ArancelData | null>(
    null,
  );
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(
    currentYear,
  );
  const [codDireccionBusqueda, setCodDireccionBusqueda] = useState<
    number | null
  >(null);
  const [parametroBusqueda, setParametroBusqueda] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [arancelesEncontrados, setArancelesEncontrados] = useState<
    ArancelData[]
  >([]);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);

  const buscarPorCodDireccion = useCallback(async (): Promise<void> => {
    if (!anioSeleccionado || !codDireccionBusqueda) return;
    setLoadingBusqueda(true);
    try {
      const values = await arancelService.listarAranceles({
        anio: anioSeleccionado,
        codDireccion: codDireccionBusqueda,
        codUsuario: getAuthenticatedUserCode(),
        parametroBusqueda: "a",
      });
      setArancelesEncontrados(values);
      setPage(0);
    } catch (error: unknown) {
      setArancelesEncontrados([]);
      NotificationService.error(
        error instanceof Error ? error.message : "Error al buscar aranceles",
      );
    } finally {
      setLoadingBusqueda(false);
    }
  }, [anioSeleccionado, codDireccionBusqueda]);

  const buscarConApiGeneral = useCallback(async (): Promise<void> => {
    setLoadingBusqueda(true);
    try {
      const values = await arancelService.listarArancelesGeneral({
        anio: anioSeleccionado ?? undefined,
        parametroBusqueda: "a",
      });
      setArancelesEncontrados(
        filterAranceles(values, parametroBusqueda, anioSeleccionado),
      );
      setPage(0);
    } catch (error: unknown) {
      setArancelesEncontrados([]);
      NotificationService.error(
        error instanceof Error ? error.message : "Error al buscar aranceles",
      );
    } finally {
      setLoadingBusqueda(false);
    }
  }, [anioSeleccionado, parametroBusqueda]);

  useEffect(() => {
    if (!open || !useGeneralApi) return;
    const timer = window.setTimeout(() => void buscarConApiGeneral(), 300);
    return () => window.clearTimeout(timer);
  }, [buscarConApiGeneral, open, useGeneralApi]);

  const arancelesPaginados = useMemo(() => {
    const start = page * rowsPerPage;
    return arancelesEncontrados.slice(start, start + rowsPerPage);
  }, [arancelesEncontrados, page, rowsPerPage]);

  const close = (): void => {
    setSelectedArancel(null);
    setParametroBusqueda("");
    setAnioSeleccionado(currentYear());
    setCodDireccionBusqueda(null);
    setArancelesEncontrados([]);
    setPage(0);
    onClose();
  };

  const confirmSelection = (): void => {
    if (selectedArancel) onSelectArancel?.(selectedArancel);
    close();
  };

  return {
    selectedArancel,
    anioSeleccionado,
    codDireccionBusqueda,
    parametroBusqueda,
    page,
    rowsPerPage,
    arancelesEncontrados,
    arancelesPaginados,
    loadingBusqueda,
    setSelectedArancel,
    setAnioSeleccionado,
    setCodDireccionBusqueda,
    setParametroBusqueda,
    setPage,
    setRowsPerPage,
    buscarPorCodDireccion,
    buscarConApiGeneral,
    confirmSelection,
    close,
  };
};
