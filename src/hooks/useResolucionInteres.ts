// hooks/useResolucionInteres.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { resolucionInteresService, ResolucionInteresData, CreateResolucionInteresDTO, UpdateResolucionInteresDTO } from '../services/resolucionInteresService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de Resoluciones de Interés con React Query
 */
export const useResolucionesInteres = () => {
  const queryClient = useQueryClient();

  // Query: Listar
  const {
    data: resoluciones = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['resoluciones-interes'],
    queryFn: () => resolucionInteresService.obtenerTodas(),
    enabled: false, // Deshabilitar consulta automática para evitar error 403 Forbidden en carga
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateResolucionInteresDTO) => resolucionInteresService.crearResolucion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resoluciones-interes'] });
      NotificationService.success('Resolución registrada correctamente');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdateResolucionInteresDTO) => resolucionInteresService.actualizarResolucion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resoluciones-interes'] });
      NotificationService.success('Resolución actualizada correctamente');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (id: number) => resolucionInteresService.eliminarResolucion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resoluciones-interes'] });
      NotificationService.success('Resolución eliminada correctamente');
    }
  });

  return {
    resoluciones,
    loading,
    error: error ? (error as Error).message : null,
    
    // Acciones
    cargarResoluciones: () => refetch(),
    crearResolucion: mutationCrear.mutateAsync,
    actualizarResolucion: mutationActualizar.mutateAsync,
    eliminarResolucion: mutationEliminar.mutateAsync,
    
    // Estados
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending
  };
};
