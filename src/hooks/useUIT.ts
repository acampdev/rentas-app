import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { uitService, UITData, CreateUITDTO, UpdateUITDTO } from '../services/uitService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestionar valores UIT con React Query
 */
export const useUIT = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anioSeleccionado, setAnioSeleccionado] = useState(anioInicial);

  // Query: Listar UITs por año
  const {
    data: uits = [],
    isLoading: loading,
    error,
    refetch: cargarUITs
  } = useQuery({
    queryKey: ['uits', anioSeleccionado],
    queryFn: () => uitService.listarUITs(anioSeleccionado),
    placeholderData: (prev) => prev
  });

  // Query: UIT Vigente
  const { data: uitVigente = null } = useQuery({
    queryKey: ['uit-vigente'],
    queryFn: () => uitService.obtenerVigente(),
    staleTime: 1000 * 60 * 60 // 1 hora
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateUITDTO) => uitService.crearUIT(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uits'] });
      queryClient.invalidateQueries({ queryKey: ['uit-vigente'] });
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdateUITDTO) => 
      uitService.actualizarUIT(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uits'] });
      queryClient.invalidateQueries({ queryKey: ['uit-vigente'] });
      NotificationService.success('Valor UIT actualizado correctamente');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (id: number) => uitService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uits'] });
      NotificationService.success('Valor UIT eliminado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al eliminar valor UIT');
    }
  });

  return {
    uits,
    uitVigente,
    loading,
    error: error ? (error as Error).message : null,
    anioSeleccionado,
    setAnioSeleccionado,
    
    // Acciones
    cargarUITs: () => cargarUITs(),
    crearUIT: mutationCrear.mutateAsync,
    actualizarUIT: mutationActualizar.mutateAsync,
    eliminarUIT: mutationEliminar.mutateAsync,
    
    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending,
    
    // Utils (Manteniendo compatibilidad)
    aniosDisponibles: Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + 2 - i),
    seleccionarUIT: () => {},
    handleAnioChange: (a: number) => setAnioSeleccionado(a)
  };
};
