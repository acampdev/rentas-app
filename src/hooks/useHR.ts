import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { hrService, HRQueryParams } from '../services/hrService';

/**
 * Hook para gestionar Hoja de Resumen (HR) con React Query
 */
export const useHR = (paramsIniciales?: HRQueryParams) => {
  const [params, setParams] = useState<HRQueryParams>(paramsIniciales || {});

  const {
    data: hrData = [],
    isLoading: loading,
    error,
    refetch: _buscarHR
  } = useQuery({
    queryKey: ['hr', params],
    queryFn: async () => {
      if (!params.codContribuyente) return [];
      return hrService.buscarHR(params);
    },
    enabled: !!params.codContribuyente,
    placeholderData: (prev) => prev
  });

  return {
    hrData,
    loading,
    error: error ? (error as Error).message : null,
    buscarHR: (newParams: HRQueryParams) => {
      setParams(newParams);
      return Promise.resolve([]);
    },
    limpiarHR: () => setParams({})
  };
};

export default useHR;
