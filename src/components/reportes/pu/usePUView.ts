import { useState } from "react";
import { usePU } from "../../../hooks/usePU";
import { logger } from "../../../utils/logger";
import type { PUContributor } from "./pu.types";

export function usePUView() {
  const { puData, loading, buscarPU, precargarPU, limpiarPU } = usePU();
  const [contributor, setContributor] = useState<PUContributor | null>(null);
  const [searchedContributor, setSearchedContributor] =
    useState<PUContributor | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const selectContributor = (data: PUContributor) => {
    logger.log("🔍 [PU] Contribuyente seleccionado:", data);
    setContributor({
      ...data,
      nombreCompleto: data.contribuyente || data.nombreCompleto || "",
    });
    setSelectorOpen(false);
    limpiarPU();
    void precargarPU({ codContribuyente: String(data.codigo) }).catch(() => {
      // Si la precarga falla, Buscar volverá a intentar y React Query
      // conservará el error correspondiente.
    });
  };

  const search = async () => {
    if (!contributor?.codigo) return;
    const selectedContributor = contributor;

    try {
      await buscarPU({
        codContribuyente: String(selectedContributor.codigo),
      });
      setSearchedContributor(selectedContributor);
      setContributor(null);
    } catch {
      // React Query conserva el error de la consulta; evitar una promesa no
      // controlada cuando el componente dispara la búsqueda desde el botón.
    }
  };

  return {
    contributor,
    searchedContributor,
    selectorOpen,
    setSelectorOpen,
    printOpen,
    setPrintOpen,
    loading,
    results: puData,
    selectContributor,
    search,
  };
}
