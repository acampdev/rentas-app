// src/hooks/useTurnos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { 
  turnoService, 
  TurnoData, 
  CreateTurnoDTO, 
  UpdateTurnoDTO,
  ListarTurnoParams 
} from '../services/turnoService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de turnos con React Query
 */
export const useTurnos = () => {
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState<ListarTurnoParams>({});

  // Query: Listar Turnos
  const {
    data: turnos = [],
    isLoading: loading,
    error,
    refetch: cargarTurnos
  } = useQuery({
    queryKey: ['turnos', filtros],
    queryFn: () => turnoService.listar(filtros)
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateTurnoDTO) => turnoService.insertar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
      NotificationService.success('Turno creado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al crear turno');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdateTurnoDTO) => turnoService.actualizar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
      NotificationService.success('Turno actualizado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al actualizar turno');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (codTurno: number) => turnoService.eliminar({ codTurno }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
      NotificationService.success('Turno eliminado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al eliminar turno');
    }
  });

  return {
    turnos,
    loading,
    error: error ? (error as Error).message : null,
    
    // Acciones
    setFiltros,
    cargarTurnos,
    crearTurno: mutationCrear.mutateAsync,
    actualizarTurno: mutationActualizar.mutateAsync,
    eliminarTurno: mutationEliminar.mutateAsync,
    
    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};

export default useTurnos;
