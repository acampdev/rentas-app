// hooks/useUsuarios.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { NotificationService } from '../components/utils/Notification';
import {
  usuarioService,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  CambiarClaveDTO,
  ListarUsuariosParams
} from '../services/usuarioService';

/**
 * Hook para gestionar usuarios con React Query
 */
export const useUsuarios = (paramsIniciales: ListarUsuariosParams = { parametroBusqueda: '' }) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<ListarUsuariosParams>(paramsIniciales);

  // Query para listar usuarios
  const {
    data: usuarios = [],
    isLoading: loading,
    error,
    refetch: cargarUsuarios
  } = useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuarioService.listar(params),
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateUsuarioDTO) => usuarioService.insertar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      NotificationService.success('Usuario creado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al crear usuario');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdateUsuarioDTO) => usuarioService.actualizar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      NotificationService.success('Usuario actualizado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al actualizar usuario');
    }
  });

  // Mutación: Cambiar Clave
  const mutationCambiarClave = useMutation({
    mutationFn: (datos: CambiarClaveDTO) => usuarioService.cambiarClave(datos),
    onSuccess: () => {
      NotificationService.success('Clave cambiada correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al cambiar clave');
    }
  });

  // Mutación: Dar de Baja
  const mutationDarBaja = useMutation({
    mutationFn: (codUsuario: number) => usuarioService.darBaja({ codUsuario }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      NotificationService.success('Usuario dado de baja correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al dar de baja usuario');
    }
  });

  // Mutación: Activar
  const mutationActivar = useMutation({
    mutationFn: (codUsuario: number) => usuarioService.activar({ codUsuario }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      NotificationService.success('Usuario activado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al activar usuario');
    }
  });

  // Verificar Supervisor state y callback
  const [verificandoSupervisor, setVerificandoSupervisor] = useState(false);

  const verificarSupervisor = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setVerificandoSupervisor(true);
      const esValido = await usuarioService.verificarSupervisorCajero(username, password);
      return esValido;
    } catch (err: any) {
      NotificationService.error(err.message || 'Error al verificar supervisor');
      return false;
    } finally {
      setVerificandoSupervisor(false);
    }
  }, []);

  const cargarUsuariosConParams = useCallback((newParams?: ListarUsuariosParams) => {
    if (newParams) setParams(newParams);
    else void cargarUsuarios();
  }, [cargarUsuarios]);

  const buscarUsuarios = useCallback((parametroBusqueda: string) => {
    setParams({ parametroBusqueda });
  }, []);

  return {
    usuarios,
    loading,
    error: error ? (error as Error).message : null,

    // Métodos de carga y búsqueda
    cargarUsuarios: cargarUsuariosConParams,
    buscarUsuarios,

    // Métodos CRUD (Promesas)
    crearUsuario: mutationCrear.mutateAsync,
    actualizarUsuario: mutationActualizar.mutateAsync,
    cambiarClave: mutationCambiarClave.mutateAsync,
    darBajaUsuario: mutationDarBaja.mutateAsync,
    activarUsuario: mutationActivar.mutateAsync,

    // Verificar Supervisor
    verificarSupervisor,
    verificandoSupervisor,

    // Utilidades
    obtenerUsuario: (codUsuario: number) => usuarios.find(u => u.codUsuario === codUsuario) || null,
    filtrarPorEstado: (estado: string) => usuarios.filter(u => u.estado === estado),
    obtenerUsuariosActivos: () => usuarios.filter(u => u.estado === 'ACTIVO'),
    obtenerUsuariosInactivos: () => usuarios.filter(u => u.estado !== 'ACTIVO'),

    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isChangingPassword: mutationCambiarClave.isPending,
    isDeactivating: mutationDarBaja.isPending,
    isActivating: mutationActivar.isPending
  };
};
