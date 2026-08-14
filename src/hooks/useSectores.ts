import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useMemo } from 'react';
import { sectorService, SectorData, CreateSectorDTO, UpdateSectorDTO } from '../services/SectorService';
import { Sector } from '../models/Sector';
import { NotificationService } from '../components/utils/Notification';

const adaptToModel = (data: SectorData): Sector => ({
  id: data.codSector,
  nombre: data.nombreSector,
  cuadrante: data.codCuadrante,
  nombreCuadrante: data.nombreCuadrante,
  codUnidadUrbana: data.codUnidadUrbana,
  unidadUrbana: data.unidadUrbana,
  estado: 'ACTIVO'
});

/**
 * Hook para gestión de sectores con React Query
 */
export const useSectores = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Query: Listar Sectores
  const {
    data: rawSectores = [],
    isLoading: loading,
    error,
    refetch: cargarSectores
  } = useQuery({
    queryKey: ['sectores'],
    queryFn: async () => {
      const data = await sectorService.obtenerTodos();
      return data.map(adaptToModel);
    }
  });

  // Query: Cuadrantes
  const { data: cuadrantes = [], isLoading: loadingCuadrantes } = useQuery({
    queryKey: ['cuadrantes'],
    queryFn: () => sectorService.obtenerCuadrantes(),
    staleTime: Infinity // Datos casi estáticos
  });

  // Query: Unidades Urbanas
  const { data: unidadesUrbanas = [], isLoading: loadingUnidadesUrbanas } = useQuery({
    queryKey: ['unidades-urbanas'],
    queryFn: () => sectorService.obtenerUnidadesUrbanas(),
    staleTime: Infinity
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: any) => {
      const apiPayload: CreateSectorDTO = {
        codUnidadUrbana: Number(datos.codUnidadUrbana),
        nombreSector: datos.nombre,
        codCuadrante: Number(datos.cuadrante)
      };
      return sectorService.crearSector(apiPayload);
    },
    onSuccess: (createdData: SectorData, variables: any) => {
      const id = createdData?.codSector || 0;
      const nombre = variables.nombre;
      const cuadrante = Number(variables.cuadrante);
      const codUnidadUrbana = Number(variables.codUnidadUrbana);

      // Buscar nombres descriptivos en las listas cargadas
      const c = cuadrantes?.find(item => item.codCuadrante === cuadrante);
      const nombreCuadrante = c ? c.abreviatura : '';

      const u = unidadesUrbanas?.find(item => item.codUnidadUrbana === codUnidadUrbana);
      const unidadUrbana = u ? u.descripcionUnidadUrbana : '';

      const createdSector: Sector = {
        id,
        nombre,
        cuadrante,
        nombreCuadrante,
        codUnidadUrbana,
        unidadUrbana,
        estado: 'ACTIVO'
      };

      queryClient.setQueryData(['sectores'], (oldSectores: Sector[] | undefined) => {
        if (!oldSectores) return [createdSector];
        // Filtrar cualquier duplicado temporal o incompleto por seguridad
        const filtered = oldSectores.filter(s => s.id !== id && s.id !== 0);
        return [...filtered, createdSector];
      });

      queryClient.invalidateQueries({ queryKey: ['sectores'] });
      NotificationService.success('Sector creado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al crear sector');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: any }) => {
      const apiPayload: UpdateSectorDTO = {
        codSector: id,
        nombreSector: datos.nombre,
        codCuadrante: Number(datos.cuadrante),
        codUnidadUrbana: Number(datos.codUnidadUrbana)
      };
      return sectorService.actualizarSector(id, apiPayload);
    },
    onSuccess: (_updatedData: SectorData, variables: { id: number; datos: any }) => {
      const id = variables.id;
      const nombre = variables.datos.nombre;
      const cuadrante = Number(variables.datos.cuadrante);
      const codUnidadUrbana = Number(variables.datos.codUnidadUrbana);

      // Buscar nombres descriptivos en las listas cargadas
      const c = cuadrantes?.find(item => item.codCuadrante === cuadrante);
      const nombreCuadrante = c ? c.abreviatura : '';

      const u = unidadesUrbanas?.find(item => item.codUnidadUrbana === codUnidadUrbana);
      const unidadUrbana = u ? u.descripcionUnidadUrbana : '';

      const updatedSector: Sector = {
        id,
        nombre,
        cuadrante,
        nombreCuadrante,
        codUnidadUrbana,
        unidadUrbana,
        estado: 'ACTIVO'
      };

      queryClient.setQueryData(['sectores'], (oldSectores: Sector[] | undefined) => {
        if (!oldSectores) return [updatedSector];
        return oldSectores.map(s => s.id === id ? updatedSector : s);
      });

      queryClient.invalidateQueries({ queryKey: ['sectores'] });
      NotificationService.success('Sector actualizado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al actualizar sector');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (id: number) => sectorService.delete(id),
    onSuccess: (_, idEliminado) => {
      queryClient.setQueryData(['sectores'], (oldSectores: Sector[] | undefined) => {
        if (!oldSectores) return [];
        return oldSectores.filter(s => s.id !== idEliminado);
      });
      queryClient.invalidateQueries({ queryKey: ['sectores'] });
      NotificationService.success('Sector eliminado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al eliminar sector');
    }
  });

  // Filtrado local memoizado
  const memoizedSectores = useMemo(() => {
    let result = [...rawSectores];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter(s => s.nombre.toLowerCase().includes(t));
    }
    return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [rawSectores, searchTerm]);

  return {
    sectores: memoizedSectores,
    loading,
    error: error ? (error as Error).message : null,
    searchTerm,
    setSearchTerm,
    cuadrantes,
    loadingCuadrantes,
    unidadesUrbanas,
    loadingUnidadesUrbanas,

    // Acciones
    cargarSectores,
    crearSector: mutationCrear.mutateAsync,
    actualizarSector: mutationActualizar.mutateAsync,
    eliminarSector: mutationEliminar.mutateAsync,
    
    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};
