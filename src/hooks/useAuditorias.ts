import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { auditoriaService, AuditoriaItem } from '../services/auditoriaService';
import { NotificationService } from '../components/utils/Notification';

export interface UseAuditoriasReturn {
  auditorias: AuditoriaItem[];
  loading: boolean;
  error: string | null;
  cargarAuditorias: () => Promise<void>;
}

export const useAuditorias = (): UseAuditoriasReturn => {
  const queryClient = useQueryClient();

  const {
    data: auditorias = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['auditorias'],
    queryFn: async () => {
      return await auditoriaService.obtenerAuditorias();
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const cargarAuditorias = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['auditorias'] });
      await refetch();
      NotificationService.success('Auditorías cargadas correctamente');
    } catch (err: any) {
      NotificationService.error(err.message || 'Error al cargar auditorías');
    }
  }, [queryClient, refetch]);

  return {
    auditorias,
    loading,
    error: error ? (error as Error).message : null,
    cargarAuditorias,
  };
};

export default useAuditorias;
