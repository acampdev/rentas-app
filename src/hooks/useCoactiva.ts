import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coactivaService } from '../services/coactivaService';
import { CreateExpedienteDTO } from '../models/Coactiva';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de Cobranza Coactiva con React Query
 */
export const useCoactiva = () => {
  const queryClient = useQueryClient();

  // Query: Listar Expedientes
  const {
    data: expedientes = [],
    isLoading: loadingExpedientes,
    error: errorExpedientes,
    refetch: cargarExpedientes
  } = useQuery({
    queryKey: ['coactiva-expedientes'],
    queryFn: () => coactivaService.getAll()
  });

  // Query: Listar Notificaciones
  const {
    data: notificaciones = [],
    isLoading: loadingNotificaciones,
    refetch: cargarNotificaciones
  } = useQuery({
    queryKey: ['coactiva-notificaciones'],
    queryFn: () => coactivaService.listarNotificaciones()
  });

  // Query: Listar Resoluciones
  const {
    data: resoluciones = [],
    isLoading: loadingResoluciones,
    refetch: cargarResoluciones
  } = useQuery({
    queryKey: ['coactiva-resoluciones'],
    queryFn: () => coactivaService.listarResoluciones()
  });

  // Mutación: Crear Expediente
  const mutationCrearExpediente = useMutation({
    mutationFn: (datos: CreateExpedienteDTO) => coactivaService.create(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coactiva-expedientes'] });
      NotificationService.success('Expediente registrado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al registrar expediente');
    }
  });

  return {
    expedientes,
    notificaciones,
    resoluciones,
    loading: loadingExpedientes || loadingNotificaciones || loadingResoluciones,
    error: errorExpedientes ? (errorExpedientes as Error).message : null,
    
    // Acciones
    cargarExpedientes,
    cargarNotificaciones,
    cargarResoluciones,
    crearExpediente: mutationCrearExpediente.mutateAsync,
    
    // Estados de mutación
    isCreating: mutationCrearExpediente.isPending
  };
};

export default useCoactiva;
