// src/hooks/useTim.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timService, TimFilters, UpdateTimDTO, DeleteTimDTO } from '../services/timService';
import { NotificationService } from '../components/utils/Notification';

export const useTim = (filtros?: TimFilters) => {
  const queryClient = useQueryClient();

  // Query: Buscar/Listar TIM
  const {
    data: timList = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tim-list', filtros],
    queryFn: () => filtros ? timService.obtenerTim(filtros) : Promise.resolve([]),
    enabled: !!filtros && Object.keys(filtros).length > 0,
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: any) => timService.crearTim(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tim-list'] });
      NotificationService.success('TIM registrado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(`Error al registrar TIM: ${err.message || 'Intente de nuevo.'}`);
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdateTimDTO) => timService.actualizarTim(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tim-list'] });
      NotificationService.success('TIM actualizado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(`Error al actualizar TIM: ${err.message || 'Intente de nuevo.'}`);
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (datos: DeleteTimDTO) => timService.eliminarTim(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tim-list'] });
      NotificationService.success('TIM eliminado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(`Error al eliminar TIM: ${err.message || 'Intente de nuevo.'}`);
    }
  });

  return {
    timList,
    loading,
    error: error ? (error as Error).message : null,
    
    // Acciones
    buscarTim: () => refetch(),
    crearTim: mutationCrear.mutateAsync,
    actualizarTim: mutationActualizar.mutateAsync,
    eliminarTim: mutationEliminar.mutateAsync,
    
    // Estados de carga de mutaciones
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};

export const useTimComboOptions = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['tim-combo-options'],
    queryFn: () => timService.listarCboTim(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const options = data.map((item: any) => ({
    value: item.codTributo,
    label: item.tributoTim || `Tributo ${item.codTributo}`
  }));

  return {
    options,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
};