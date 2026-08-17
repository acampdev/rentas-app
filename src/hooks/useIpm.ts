import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { NotificationService } from '../components/utils/Notification';
import { ipmService, type IPMWriteDTO } from '../services/ipmService';

export const useIpm = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anioSeleccionado, setAnioSeleccionado] = useState(anioInicial);
  const { data: registros = [], isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['ipm', anioSeleccionado],
    queryFn: () => ipmService.listarPorAnio(anioSeleccionado),
    placeholderData: (previous) => previous
  });

  const crearMutation = useMutation({
    mutationFn: (datos: IPMWriteDTO) => ipmService.crear(datos),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ipm'] });
      NotificationService.success('Registro IPM creado correctamente');
    },
    onError: (err: Error) => NotificationService.error(err.message || 'No se pudo crear el registro IPM')
  });

  const actualizarMutation = useMutation({
    mutationFn: (datos: IPMWriteDTO) => ipmService.actualizar(datos),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ipm'] });
      NotificationService.success('Registro IPM actualizado correctamente');
    },
    onError: (err: Error) => NotificationService.error(err.message || 'No se pudo actualizar el registro IPM')
  });

  const buscarPorAnio = useCallback((anio: number) => {
    if (anio === anioSeleccionado) void refetch();
    else setAnioSeleccionado(anio);
  }, [anioSeleccionado, refetch]);

  return {
    registros,
    anioSeleccionado,
    setAnioSeleccionado,
    buscarPorAnio,
    recargar: refetch,
    crearIPM: crearMutation.mutateAsync,
    actualizarIPM: actualizarMutation.mutateAsync,
    loading: isLoading || isFetching,
    isSaving: crearMutation.isPending || actualizarMutation.isPending,
    error: error instanceof Error ? error.message : null
  };
};
