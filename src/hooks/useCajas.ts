import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {  useState } from 'react';
import { 
  cajaService, 
  CajaData, 
  CreateCajaDTO, 
  UpdateCajaDTO, 
  ListarCajaParams 
} from '../services/cajaService';
import { NotificationService } from '../components/utils/Notification';

export interface CajaListItem {
  codCaja: number;
  numcaja: string;
  descripcion: string;
  estado: string;
  usuario: string | null;
}

const mapToListItem = (data: CajaData): CajaListItem => ({
  codCaja: data.codCaja,
  numcaja: data.numcaja,
  descripcion: data.descripcion,
  estado: data.estado,
  usuario: data.usuario
});

/**
 * Hook para gestionar cajas con React Query
 */
export const useCajas = () => {
  const queryClient = useQueryClient();
  // Sin filtros iniciales: el selector de asignación debe recibir el catálogo completo.
  const [params, setParams] = useState<ListarCajaParams>({});

  // Query para listar cajas
  const {
    data: cajas = [],
    isLoading: loading,
    error,
    refetch: cargarCajas
  } = useQuery({
    queryKey: ['cajas', params],
    queryFn: () => cajaService.listar(params),
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateCajaDTO) => cajaService.insertar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      NotificationService.success('Caja creada correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al crear caja');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdateCajaDTO) => cajaService.actualizar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      NotificationService.success('Caja actualizada correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al actualizar caja');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (codCaja: number) => cajaService.eliminar({ codCaja }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      NotificationService.success('Caja eliminada correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al eliminar caja');
    }
  });

  return {
    cajas,
    loading,
    error: error ? (error as Error).message : null,

    // Métodos de carga y búsqueda
    cargarCajas,
    buscarCajas: (newParams: ListarCajaParams) => setParams(newParams),
    buscarPorDescripcion: (descripcion: string) => setParams({ descripcion }),
    buscarPorUsuario: (codUsuario: number) => setParams({ codUsuario }),

    // Métodos CRUD
    crearCaja: mutationCrear.mutateAsync,
    actualizarCaja: mutationActualizar.mutateAsync,
    eliminarCaja: mutationEliminar.mutateAsync,
    
    obtenerCaja: (codCaja: number) => cajas.find(c => c.codCaja === codCaja) || null,

    // Utilidades
    obtenerCajasDisponibles: () => cajas.filter(c => c.estado === 'DISPONIBLE'),
    obtenerListaFormateada: () => cajas.map(mapToListItem),
    estaDisponible: (codCaja: number) => cajas.find(c => c.codCaja === codCaja)?.estado === 'DISPONIBLE',
    convertirAListItem: mapToListItem,

    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};
