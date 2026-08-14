import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { 
  arancelService, 
  CrearArancelApiDTO,
  ActualizarArancelApiDTO
} from '../services/arancelService';
import { Arancel } from '../models/Arancel';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de aranceles con React Query
 */
export const useAranceles = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);
  const [busqueda, setBusqueda] = useState('a');

  // Query: Listar Aranceles
  const {
    data: aranceles = [] as Arancel[],
    isLoading: loading,
    error,
    refetch: cargarAranceles
  } = useQuery({
    queryKey: ['aranceles', anio, busqueda],
    queryFn: () => arancelService.listarArancelesGeneral({ anio, parametroBusqueda: busqueda }),
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CrearArancelApiDTO) => arancelService.crearArancelSinAuth(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aranceles'] });
      NotificationService.success('Arancel registrado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al registrar arancel');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: (datos: ActualizarArancelApiDTO) => arancelService.actualizarArancelSinAuth(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aranceles'] });
      NotificationService.success('Arancel actualizado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al actualizar arancel');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (id: number) => arancelService.eliminarArancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aranceles'] });
    }
  });

  return {
    aranceles,
    loading,
    error: error ? (error as Error).message : null,
    anio,
    setAnio,
    busqueda,
    setBusqueda,
    
    // Acciones
    cargarAranceles,
    crearArancel: mutationCrear.mutateAsync,
    actualizarArancel: mutationActualizar.mutateAsync,
    eliminarArancel: mutationEliminar.mutateAsync,
    
    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};
