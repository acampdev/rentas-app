import { useMemo, useState } from "react";
import { usePU } from "../../../hooks/usePU";
import { logger } from "../../../utils/logger";
import type { PUContributor } from "./pu.types";

export function usePUView() {
  const { puData, loading, buscarPU, limpiarPU } = usePU();
  const [contributor, setContributor] = useState<PUContributor | null>(null);
  const [propertyCode, setPropertyCode] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const selectContributor = (data: PUContributor) => {
    logger.log("🔍 [PU] Contribuyente seleccionado:", data);
    setContributor({
      ...data,
      nombreCompleto: data.contribuyente || data.nombreCompleto || "",
    });
    setPropertyCode("");
    setSelectorOpen(false);
    limpiarPU();
  };

  const search = () => {
    if (!contributor?.codigo || !propertyCode) return;
    void buscarPU({
      codContribuyente: String(contributor.codigo),
      codPredio: propertyCode.trim(),
    });
  };

  const results = useMemo(
    () =>
      propertyCode
        ? puData.filter(({ codPredio }) =>
            codPredio.trim().includes(propertyCode.trim()),
          )
        : puData,
    [puData, propertyCode],
  );

  return {
    contributor,
    propertyCode,
    setPropertyCode,
    selectorOpen,
    setSelectorOpen,
    printOpen,
    setPrintOpen,
    loading,
    results,
    selectContributor,
    search,
  };
}
