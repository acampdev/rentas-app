import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { 
  valorUnitarioService, 
  UpdateValorUnitarioDTO,
  CrearValorUnitarioApiDTO 
} from '../services/valorUnitarioService';
import { ValorUnitario } from '../models/ValorUnitario';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de valores unitarios con React Query
 */
export const useValoresUnitarios = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);

  // Query: Listar valores por año
  const {
    data: valoresUnitarios = [] as ValorUnitario[],
    isLoading: loading,
    error,
    refetch: cargarValores
  } = useQuery({
    queryKey: ['valores-unitarios', anio],
    queryFn: () => valorUnitarioService.consultarValoresUnitarios({ anio }),
    placeholderData: (prev) => prev
  });

  // Query: Estadísticas
  const { data: estadisticas = null } = useQuery({
    queryKey: ['valores-unitarios-stats', anio],
    queryFn: () => valorUnitarioService.obtenerEstadisticas(anio)
  });

  // Mutación: Crear (Sin Auth)
  const mutationCrear = useMutation({
    mutationFn: (datos: CrearValorUnitarioApiDTO) => valorUnitarioService.crearValorUnitarioSinAuth(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valores-unitarios'] });
      NotificationService.success('Valor unitario registrado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al registrar valor unitario');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: UpdateValorUnitarioDTO }) => 
      valorUnitarioService.actualizarValorUnitario(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valores-unitarios'] });
      NotificationService.success('Valor unitario actualizado correctamente');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (id: string) => valorUnitarioService.eliminarValorUnitario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valores-unitarios'] });
      NotificationService.success('Valor unitario eliminado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al eliminar valor unitario');
    }
  });

  return {
    valoresUnitarios,
    loading,
    error: error ? (error as Error).message : null,
    anio,
    setAnio,
    estadisticas,
    
    // Acciones
    cargarValores: () => cargarValores(),
    crearValorUnitario: mutationCrear.mutateAsync,
    actualizarValorUnitario: mutationActualizar.mutateAsync,
    eliminarValorUnitario: mutationEliminar.mutateAsync,
    
    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};
