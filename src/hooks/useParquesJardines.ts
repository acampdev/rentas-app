import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { parquesJardinesService, ParquesJardinesData, CrearParquesJardinesDTO } from '../services/parquesJardinesService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de arbitrios de parques y jardines con React Query
 */
export const useParquesJardines = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);

  // Query: Listar
  const {
    data: parquesJardines = [],
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['parques-jardines', anio],
    queryFn: () => parquesJardinesService.listar(anio),
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CrearParquesJardinesDTO) => parquesJardinesService.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parques-jardines', anio] });
      NotificationService.success('Arbitrio registrado correctamente');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: CrearParquesJardinesDTO) => parquesJardinesService.actualizar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parques-jardines', anio] });
      NotificationService.success('Arbitrio actualizado correctamente');
    }
  });

  return {
    parquesJardines,
    loading,
    anio,
    setAnio,
    
    // Acciones
    listarParquesJardines: (params?: { anio?: number }) => { if (params?.anio) setAnio(params.anio); return Promise.resolve(); },
    crearParquesJardines: mutationCrear.mutateAsync,
    actualizarParquesJardines: mutationActualizar.mutateAsync,
    
    recargar: async () => { await refetch(); },
    
    // Estados
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending
  };
};
