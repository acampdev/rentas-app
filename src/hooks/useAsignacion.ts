import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { asignacionService, AsignacionPredio, AsignacionQueryParams, CreateAsignacionAPIDTO } from '../services/asignacionService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestionar asignaciones de predio con React Query
 */
export const useAsignacion = (paramsIniciales?: AsignacionQueryParams) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<AsignacionQueryParams>(paramsIniciales || {});
  console.log('🧪 [useAsignacion] Render del hook, params actuales:', params);

  // Query para listar asignaciones
  const {
    data: asignaciones = [],
    isLoading: loading,
    error,
    refetch: buscarAsignaciones
  } = useQuery({
    queryKey: ['asignaciones', params],
    queryFn: async () => {
      console.log('🧪 [useAsignacion] queryFn ejecutándose con params:', params);
      // Evitar llamar al API con parámetros vacíos para no provocar errores 403 o consultas masivas innecesarias
      if (!params.codPredio && !params.codContribuyente && !params.anio) {
        console.log('🧪 [useAsignacion] queryFn omitiendo llamada API (params vacíos)');
        return [];
      }
      try {
        const data = await asignacionService.buscarAsignaciones(params);
        console.log('🧪 [useAsignacion] queryFn resultado API:', data);
        return data;
      } catch (err) {
        console.error('🧪 [useAsignacion] queryFn error API:', err);
        throw err;
      }
    },
    placeholderData: (prev) => prev
  });

  // Mutación para crear asignación
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateAsignacionAPIDTO) => asignacionService.crearAsignacionAPI(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      NotificationService.success('Asignación de predio creada correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al crear asignación de predio');
    }
  });

  // Mutación para actualizar asignación
  const mutationActualizar = useMutation({
    mutationFn: (datos: CreateAsignacionAPIDTO) => asignacionService.actualizarAsignacionAPI(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      NotificationService.success('Asignación de predio actualizada correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al actualizar asignación de predio');
    }
  });

  // Mutación para desasignar predio
  const mutationDesasignar = useMutation({
    mutationFn: (datos: CreateAsignacionAPIDTO) => asignacionService.desasignarAPI(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      NotificationService.success('Desasignación realizada correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al desasignar el predio');
    }
  });

  return {
    asignaciones,
    loading,
    error: error ? (error as Error).message : null,
    
    // Acciones
    buscarAsignaciones: (newParams: AsignacionQueryParams) => {
      setParams(newParams);
      return Promise.resolve();
    },
    obtenerAsignacionPorId: (id: number) => 
      queryClient.fetchQuery({
        queryKey: ['asignacion', id],
        queryFn: () => asignacionService.obtenerAsignacionPorId(id)
      }),
    crearAsignacionAPI: mutationCrear.mutateAsync,
    actualizarAsignacionAPI: mutationActualizar.mutateAsync,
    desasignarAPI: mutationDesasignar.mutateAsync,
    limpiarAsignaciones: () => setParams({}),
    limpiarError: () => {},
    
    // Estados de mutación
    isCreating: mutationCrear.isPending || mutationActualizar.isPending || mutationDesasignar.isPending
  };
};

export default useAsignacion;
