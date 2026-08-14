import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { serenazgoService, SerenazgoData, CrearSerenazgoDTO } from '../services/serenazgoService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de arbitrios de serenazgo con React Query
 */
export const useSerenazgo = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);

  // Query: Listar
  const {
    data: serenazgo = [],
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['serenazgo', anio],
    queryFn: () => serenazgoService.listar(anio),
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CrearSerenazgoDTO) => serenazgoService.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serenazgo', anio] });
      NotificationService.success('Arbitrio registrado correctamente');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: CrearSerenazgoDTO) => serenazgoService.actualizar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serenazgo', anio] });
      NotificationService.success('Arbitrio actualizado correctamente');
    }
  });

  return {
    serenazgo,
    loading,
    anio,
    setAnio,
    
    // Acciones
    listarSerenazgo: (params?: { anio?: number }) => { if (params?.anio) setAnio(params.anio); return Promise.resolve(); },
    crearSerenazgo: mutationCrear.mutateAsync,
    actualizarSerenazgo: mutationActualizar.mutateAsync,
    
    recargar: async () => { await refetch(); },
    
    // Estados
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending
  };
};
