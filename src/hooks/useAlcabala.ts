import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { alcabalaService, AlcabalaData, CreateAlcabalaDTO, UpdateAlcabalaDTO } from '../services/alcabalaService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de Alcabala con React Query
 */
export const useAlcabala = () => {
  const queryClient = useQueryClient();
  const [anioFiltro, setAnioFiltro] = useState<number | null>(null);

  // Query: Listar alcabalas (por defecto consulta últimos años en el servicio)
  const {
    data: alcabalas = [],
    isLoading: loading,
    error,
    refetch: cargarAlcabalas
  } = useQuery({
    queryKey: ['alcabalas', anioFiltro],
    queryFn: async () => {
      if (anioFiltro) {
        const item = await alcabalaService.obtenerPorAnio(anioFiltro);
        return item ? [item] : [];
      }
      // Por ahora simulamos "obtener todas" consultando últimos 10 años secuencialmente en el servicio
      // (según lógica original del servicio)
      const results = [];
      const currentYear = new Date().getFullYear();
      for (let i = 0; i < 5; i++) {
        const item = await alcabalaService.obtenerPorAnio(currentYear - i);
        if (item) results.push(item);
      }
      return results;
    }
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateAlcabalaDTO) => alcabalaService.crearAlcabala(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alcabalas'] });
      NotificationService.success('Tasa de Alcabala registrada');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al registrar alcabala');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: UpdateAlcabalaDTO }) => 
      alcabalaService.actualizarAlcabala(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alcabalas'] });
      NotificationService.success('Tasa de Alcabala actualizada');
    }
  });

  return {
    alcabalas,
    loading,
    error: error ? (error as Error).message : null,
    setAnioFiltro,
    
    // Acciones
    crearAlcabala: mutationCrear.mutateAsync,
    actualizarAlcabala: mutationActualizar.mutateAsync,
    buscarPorAnio: (anio: number | null) => setAnioFiltro(anio),
    
    // Estados
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    
    // Utils (compatibilidad)
    aniosDisponibles: Array.from({ length: 10 }, (_, i) => ({
      value: new Date().getFullYear() - i,
      label: (new Date().getFullYear() - i).toString()
    }))
  };
};
