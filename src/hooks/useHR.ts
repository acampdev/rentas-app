import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { hrService, HRQueryParams } from "../services/hrService";

const HR_CACHE_TIME = 30_000;

const normalizeHRParams = (params: HRQueryParams): HRQueryParams => ({
  codContribuyente: String(params.codContribuyente || "").trim(),
});

/**
 * Hook para gestionar Hoja de Resumen (HR) con React Query
 */
export const useHR = (paramsIniciales?: HRQueryParams) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<HRQueryParams>(paramsIniciales || {});
  const [searching, setSearching] = useState(false);

  const {
    data: hrData = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["hr", params],
    queryFn: async () => {
      if (!params.codContribuyente) return [];
      return hrService.buscarHR(params);
    },
    // Buscar ejecuta la consulta explícitamente. Así una sola pulsación espera
    // la respuesta real y no depende de un segundo render del componente.
    enabled: false,
    placeholderData: (prev) => prev,
    staleTime: HR_CACHE_TIME,
  });

  return {
    hrData,
    loading: searching || isLoading || isFetching,
    error: error ? (error as Error).message : null,
    buscarHR: async (newParams: HRQueryParams) => {
      const normalizedParams = normalizeHRParams(newParams);
      if (!normalizedParams.codContribuyente) return [];

      setParams(normalizedParams);
      setSearching(true);
      try {
        return await queryClient.fetchQuery({
          queryKey: ["hr", normalizedParams],
          queryFn: () => hrService.buscarHR(normalizedParams),
          staleTime: HR_CACHE_TIME,
        });
      } finally {
        setSearching(false);
      }
    },
    limpiarHR: () => setParams({}),
  };
};

export default useHR;
