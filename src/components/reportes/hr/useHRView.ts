import { useState } from "react";
import { useHR } from "../../../hooks/useHR";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import type { HRContribuyente } from "../modal/printHR/printHR.types";
import { logger } from "../../../utils/logger";

export type HRSelectedContribuyente = HRContribuyente &
  Partial<ContribuyenteListItem>;

export const useHRView = () => {
  const { hrData, loading, buscarHR, limpiarHR } = useHR();
  const [contribuyente, setContribuyente] =
    useState<HRSelectedContribuyente | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const selectContribuyente = (data: ContribuyenteListItem) => {
    logger.log("[HR] Contribuyente seleccionado:", data.codigo);
    setContribuyente({ ...data, nombreCompleto: data.contribuyente || "" });
    setSelectorOpen(false);
    limpiarHR();
  };

  const buscar = async () => {
    if (!contribuyente?.codigo) return;

    try {
      await buscarHR({ codContribuyente: contribuyente.codigo.toString() });
    } catch {
      // React Query conserva el error para que la vista pueda informarlo sin
      // generar una promesa rechazada sin controlar desde el botón Buscar.
    }
  };

  return {
    hrData,
    loading,
    contribuyente,
    selectorOpen,
    setSelectorOpen,
    printOpen,
    setPrintOpen,
    selectContribuyente,
    buscar,
  };
};
