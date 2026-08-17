import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { puService, PUQueryParams } from '../services/puService';

/**
 * Hook para gestionar Predio Urbano (PU) con React Query
 */
export const usePU = (paramsIniciales?: PUQueryParams) => {
  const [params, setParams] = useState<PUQueryParams>(paramsIniciales || {});

  const {
    data: puData = [],
    isLoading: loading,
    error,
    refetch: _buscarPU
  } = useQuery({
    queryKey: ['pu', params],
    queryFn: async () => {
      if (!params.codContribuyente || !params.codPredio) return [];
      return puService.buscarPU(params);
    },
    enabled: !!params.codContribuyente && !!params.codPredio,
    placeholderData: (prev) => prev
  });

  return {
    puData,
    loading,
    error: error ? (error as Error).message : null,
    buscarPU: (newParams: PUQueryParams) => {
      setParams(newParams);
      return Promise.resolve([]);
    },
    limpiarPU: () => setParams({})
  };
};

export default usePU;
