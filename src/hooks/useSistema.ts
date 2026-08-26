import { useQuery } from '@tanstack/react-query';
import { sistemaService } from '../services/sistemaService';
import { getApiErrorMessage } from '../services/apiClient';

/**
 * Hook para gestión administrativa del sistema con React Query
 */
export const useSistema = () => {
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

  const error = errorRoles ?? errorAuditoria;

  return {
    roles,
    auditoria,
    loading: loadingRoles || loadingAuditoria,
    error,
    errorMessage: error ? getApiErrorMessage(error) : null,
    
    // Acciones
    cargarRoles,
    cargarAuditoria,
  };
};

export default useSistema;
