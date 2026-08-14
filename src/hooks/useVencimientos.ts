import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { vencimientoService, VencimientoData } from '../services/vencimientoService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de Vencimientos con React Query
 */
export const useVencimientos = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);

  // Query: Listar por año
  const {
    data: vencimientos = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vencimientos', anio],
    queryFn: () => vencimientoService.obtenerPorAnio(anio),
    placeholderData: (prev) => prev
  });

  // Mutación: Generar vencimientos para un año
  const mutationCrear = useMutation({
    mutationFn: (a: number) => vencimientoService.crearVencimientos(a),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vencimientos', anio] });
      NotificationService.success('Vencimientos generados correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al generar vencimientos');
    }
  });

  return {
    vencimientos,
    loading,
    error: error ? (error as Error).message : null,
    anio,
    setAnio,
    
    // Acciones
    cargarVencimientos: () => refetch(),
    crearVencimientos: (a: number) => mutationCrear.mutateAsync(a),
    
    // Estados
    isCreating: mutationCrear.isPending,

    // Compatibilidad
    data: vencimientos,
    refetch: () => refetch()
  };
};

// Aliases para compatibilidad con componentes antiguos si es necesario
export const useVencimientosPorAnio = (anio: number | null) => useVencimientos(anio || new Date().getFullYear());
export const useCreateVencimientos = () => {
  const { crearVencimientos, isCreating } = useVencimientos();
  return { mutate: crearVencimientos, loading: isCreating };
};
