// src/hooks/useInteres.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { interesService } from '../services/interesService';
import { CreateInteresDTO, UpdateInteresDTO, InactivarInteresDTO } from '../models/Interes';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de Intereses con React Query
 */
export const useInteres = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);

  // Query: Listar intereses por año
  const {
    data: intereses = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['intereses', anio],
    queryFn: () => interesService.obtenerPorAnio(anio),
    placeholderData: (prev) => prev
  });

  // Mutación: Crear interés
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateInteresDTO) => interesService.insertar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intereses', anio] });
      NotificationService.success('Interés guardado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al guardar el interés');
    }
  });

  // Mutación: Actualizar interés (sin ID en URL)
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdateInteresDTO) => interesService.actualizarSinId(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intereses', anio] });
      NotificationService.success('Interés actualizado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al actualizar el interés');
    }
  });

  // Mutación: Inactivar interés
  const mutationInactivar = useMutation({
    mutationFn: (datos: InactivarInteresDTO) => interesService.inactivar(datos),
    onSuccess: (mensaje) => {
      queryClient.invalidateQueries({ queryKey: ['intereses', anio] });
      NotificationService.success(mensaje);
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al inactivar el interés');
    }
  });

  return {
    intereses,
    loading,
    error: error ? (error as Error).message : null,
    anio,
    setAnio,

    // Acciones
    buscar: () => refetch(),
    crearInteres: (datos: CreateInteresDTO) => mutationCrear.mutateAsync(datos),
    actualizarInteres: (datos: UpdateInteresDTO) => mutationActualizar.mutateAsync(datos),
    inactivarInteres: (datos: InactivarInteresDTO) => mutationInactivar.mutateAsync(datos),

    // Estados de carga
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isInactivating: mutationInactivar.isPending
  };
};

export default useInteres;
