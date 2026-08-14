import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sistemaService } from '../services/sistemaService';
import { ConfiguracionSistema } from '../models/Sistema';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión administrativa del sistema con React Query
 */
export const useSistema = () => {
  const queryClient = useQueryClient();

  // Query: Listar Roles
  const {
    data: roles = [],
    isLoading: loadingRoles,
    refetch: cargarRoles
  } = useQuery({
    queryKey: ['sistema-roles'],
    queryFn: () => sistemaService.listarRoles()
  });

  // Query: Listar Auditoría
  const {
    data: auditoria = [],
    isLoading: loadingAuditoria,
    refetch: cargarAuditoria
  } = useQuery({
    queryKey: ['sistema-auditoria'],
    queryFn: () => sistemaService.listarAuditoria()
  });

  // Query: Configuración Global
  const {
    data: configuracion = null,
    isLoading: loadingConfig,
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
    }
  });

  return {
    roles,
    auditoria,
    configuracion,
    loading: loadingRoles || loadingAuditoria || loadingConfig,
    
    // Acciones
    cargarRoles,
    cargarAuditoria,
    cargarConfiguracion,
    actualizarConfiguracion: mutationConfig.mutateAsync,
    
    // Estados
    isUpdatingConfig: mutationConfig.isPending
  };
};

export default useSistema;
