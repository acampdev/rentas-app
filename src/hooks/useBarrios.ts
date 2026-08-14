import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useMemo } from 'react';
import { barrioService, BarrioData } from '../services/barrioService';
import { Barrio, BarrioFormData } from '../models/Barrio';
import { NotificationService } from '../components/utils/Notification';

const adaptToModel = (data: BarrioData): Barrio => ({
  id: data.codigo,
  nombre: data.nombre,
  codSector: data.codSector || 0,
  descripcion: data.descripcion,
  estado: data.estado || 'ACTIVO',
  fechaRegistro: data.fechaRegistro,
  fechaModificacion: data.fechaModificacion
});

/**
 * Hook para gestión de barrios con React Query
 */
export const useBarrios = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSector, setFiltroSector] = useState<number | null>(null);

  // Query para listar todos los barrios
  const {
    data: barrios = [],
    isLoading: loading,
    error,
    refetch: cargarBarrios
  } = useQuery({
    queryKey: ['barrios'],
    queryFn: async () => {
      const data = await barrioService.obtenerTodos();
      return data.map(adaptToModel);
    }
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: { nombre?: string; nombreBarrio?: string; codSector: number; descripcion?: string }) => 
      barrioService.crearBarrio(datos),
    onSuccess: (createdData: BarrioData) => {
      const createdBarrio = adaptToModel(createdData);
      queryClient.setQueryData(['barrios'], (oldBarrios: Barrio[] | undefined) => {
        if (!oldBarrios) return [createdBarrio];
        const filtered = oldBarrios.filter(b => b.id !== createdBarrio.id && b.id !== 0);
        return [...filtered, createdBarrio];
      });
      queryClient.invalidateQueries({ queryKey: ['barrios'] });
      NotificationService.success('Barrio creado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al crear barrio');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: { nombre?: string; nombreBarrio?: string; codSector?: number; descripcion?: string; estado?: string } }) => 
      barrioService.actualizarBarrio(id, datos),
    onSuccess: (updatedData: BarrioData) => {
      const updatedBarrio = adaptToModel(updatedData);
      queryClient.setQueryData(['barrios'], (oldBarrios: Barrio[] | undefined) => {
        if (!oldBarrios) return [updatedBarrio];
        return oldBarrios.map(b => b.id === updatedBarrio.id ? updatedBarrio : b);
      });
      queryClient.invalidateQueries({ queryKey: ['barrios'] });
      NotificationService.success('Barrio actualizado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al actualizar barrio');
    }
  });

  // Mutación: Eliminar (Lógico)
  const mutationEliminar = useMutation({
    mutationFn: (id: number) => barrioService.eliminarBarrio(id),
    onSuccess: (_, idEliminado) => {
      queryClient.setQueryData(['barrios'], (oldBarrios: Barrio[] | undefined) => {
        if (!oldBarrios) return [];
        return oldBarrios.filter(b => b.id !== idEliminado);
      });
      queryClient.invalidateQueries({ queryKey: ['barrios'] });
      NotificationService.success('Barrio desactivado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al desactivar barrio');
    }
  });

  // Filtrado local memoizado
  const memoizedBarrios = useMemo(() => {
    let result = [...barrios];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter(b => b.nombre.toLowerCase().includes(t));
    }
    if (filtroSector) {
      result = result.filter(b => b.codSector === filtroSector);
    }
    return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [barrios, searchTerm, filtroSector]);

  return {
    barrios: memoizedBarrios,
    loading,
    error: error ? (error as Error).message : null,
    searchTerm,
    setSearchTerm,
    filtroSector,
    setFiltroSector,
    
    // Acciones
    cargarBarrios,
    crearBarrio: mutationCrear.mutateAsync,
    actualizarBarrio: mutationActualizar.mutateAsync,
    eliminarBarrio: mutationEliminar.mutateAsync,
    
    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};
