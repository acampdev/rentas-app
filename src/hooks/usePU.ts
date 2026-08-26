import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { puService, PUQueryParams } from "../services/puService";

const PU_CACHE_TIME = 30_000;

const normalizePUParams = (params: PUQueryParams): PUQueryParams => ({
  codContribuyente: String(params.codContribuyente || "").trim(),
  ...(params.codPredio?.trim() ? { codPredio: params.codPredio.trim() } : {}),
});

/**
 * Hook para gestionar Predio Urbano (PU) con React Query
 */
export const usePU = (paramsIniciales?: PUQueryParams) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<PUQueryParams>(paramsIniciales || {});
  const [searching, setSearching] = useState(false);

  const {
    data: puData = [],
    isLoading,
    isFetching,
    error,
    refetch: _buscarPU,
  } = useQuery({
    queryKey: ["pu", params],
    queryFn: async () => {
      if (!params.codContribuyente) return [];
      return puService.buscarPU(params);
    },
    // La consulta se ejecuta exclusivamente mediante el botón Buscar. Esto
    // evita duplicar la petición al cambiar params y al llamar fetchQuery.
    enabled: false,
    placeholderData: (prev) => prev,
    staleTime: PU_CACHE_TIME,
  });

  return {
    puData,
    loading: searching || isLoading || isFetching,
    error: error ? (error as Error).message : null,
    buscarPU: async (newParams: PUQueryParams) => {
      const normalizedParams = normalizePUParams(newParams);

      setParams(normalizedParams);
      setSearching(true);
      try {
        return await queryClient.fetchQuery({
          queryKey: ["pu", normalizedParams],
          queryFn: () => puService.buscarPU(normalizedParams),
          staleTime: PU_CACHE_TIME,
        });
      } finally {
        setSearching(false);
      }
    },
    precargarPU: (newParams: PUQueryParams) => {
      const normalizedParams = normalizePUParams(newParams);
      if (!normalizedParams.codContribuyente) return Promise.resolve();
      return queryClient.prefetchQuery({
        queryKey: ["pu", normalizedParams],
        queryFn: () => puService.buscarPU(normalizedParams),
        staleTime: PU_CACHE_TIME,
      });
    },
    limpiarPU: () => setParams({}),
  };
};

export default usePU;
