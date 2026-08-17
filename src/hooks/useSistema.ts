import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sistemaService } from '../services/sistemaService';
import { ConfiguracionSistema } from '../models/Sistema';
import { NotificationService } from '../components/utils/Notification';
import { getApiErrorMessage } from '../services/apiClient';

/**
 * Hook para gestión administrativa del sistema con React Query
 */
export const useSistema = () => {
  const queryClient = useQueryClient();

  // Query: Listar Roles
  const {
    data: roles = [],
    isLoading: loadingRoles,
    error: errorRoles,
    refetch: cargarRoles
  } = useQuery({
    queryKey: ['sistema-roles'],
    queryFn: () => sistemaService.listarRoles()
  });

  // Query: Listar Auditoría
  const {
    data: auditoria = [],
    isLoading: loadingAuditoria,
    error: errorAuditoria,
    refetch: cargarAuditoria
  } = useQuery({
    queryKey: ['sistema-auditoria'],
    queryFn: () => sistemaService.listarAuditoria()
  });

  // Query: Configuración Global
  const {
    data: configuracion = null,
    isLoading: loadingConfig,
    error: errorConfig,
    refetch: cargarConfiguracion
  } = useQuery({
    queryKey: ['sistema-config'],
    queryFn: () => sistemaService.obtenerConfiguracion()
  });

  // Mutación: Actualizar Configuración
  const mutationConfig = useMutation({
    mutationFn: (datos: Partial<ConfiguracionSistema>) => sistemaService.actualizarConfiguracion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sistema-config'] });
      NotificationService.success('Configuración actualizada correctamente');
    },
    onError: (error: unknown) => {
      NotificationService.error(getApiErrorMessage(error, 'No se pudo actualizar la configuración'));
    }
  });

  const error = errorRoles ?? errorAuditoria ?? errorConfig ?? mutationConfig.error;

  return {
    roles,
    auditoria,
    configuracion,
    loading: loadingRoles || loadingAuditoria || loadingConfig,
    error,
    errorMessage: error ? getApiErrorMessage(error) : null,
    
    // Acciones
    cargarRoles,
    cargarAuditoria,
    cargarConfiguracion,
    actualizarConfiguracion: mutationConfig.mutateAsync,
    
    // Estados
    isUpdatingConfig: mutationConfig.isPending,
    isConfigUpdateError: mutationConfig.isError
  };
};

export default useSistema;
