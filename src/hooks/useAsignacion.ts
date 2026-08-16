// src/hooks/useAsignacion.ts
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '../components/utils/Notification';
import { asignacionService, type AsignacionQueryParams, type CreateAsignacionAPIDTO } from '../services/asignacionService';

const hasQueryParams = (params: AsignacionQueryParams): boolean => params.anio !== undefined || params.codContribuyente !== undefined;

const getErrorMessage = (error: unknown, fallback: string): string => (error instanceof Error && error.message ? error.message : fallback);

export const useAsignacion = (paramsIniciales: AsignacionQueryParams = {}) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<AsignacionQueryParams>(paramsIniciales);

  const query = useQuery({
    queryKey: ['asignaciones', params],
    queryFn: () => asignacionService.buscarAsignaciones(params),
    enabled: hasQueryParams(params),
    placeholderData: (previousData) => previousData
  });

  const buscarAsignaciones = useCallback(
    async (newParams: AsignacionQueryParams) => {
      const normalizedParams: AsignacionQueryParams = {
        ...(newParams.anio !== undefined && newParams.anio !== '' ? { anio: newParams.anio } : {}),
        ...(newParams.codContribuyente !== undefined && newParams.codContribuyente !== '' ? { codContribuyente: newParams.codContribuyente } : {})
      };
      setParams(normalizedParams);
      return queryClient.fetchQuery({
        queryKey: ['asignaciones', normalizedParams],
        queryFn: () => asignacionService.buscarAsignaciones(normalizedParams)
      });
    },
    [queryClient]
  );

  const mutationCrear = useMutation({
    mutationFn: (datos: CreateAsignacionAPIDTO) => asignacionService.crearAsignacionAPI(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      NotificationService.success('Asignación de predio creada correctamente');
    },
    onError: (error: unknown) => {
      NotificationService.error(getErrorMessage(error, 'Error al crear la asignación de predio'));
    }
  });

  const mutationActualizar = useMutation({
    mutationFn: (datos: CreateAsignacionAPIDTO) => asignacionService.actualizarAsignacionAPI(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      NotificationService.success('Asignación de predio actualizada correctamente');
    },
    onError: (error: unknown) => {
      NotificationService.error(getErrorMessage(error, 'Error al actualizar la asignación de predio'));
    }
  });

  const mutationDesasignar = useMutation({
    mutationFn: (datos: CreateAsignacionAPIDTO) => asignacionService.desasignarAPI(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      NotificationService.success('Desasignación realizada correctamente');
    },
    onError: (error: unknown) => {
      NotificationService.error(getErrorMessage(error, 'Error al desasignar el predio'));
    }
  });

  const prevalidarBeneficioPensionista = useCallback(
    (codContribuyente: number | string) => asignacionService.prevalidarBeneficioPensionista(codContribuyente),
    []
  );

  const prevalidarBeneficioAdultoMayor = useCallback(
    (codContribuyente: number | string) => asignacionService.prevalidarBeneficioAdultoMayor(codContribuyente),
    []
  );

  const limpiarAsignaciones = useCallback(() => setParams({}), []);
  const limpiarError = useCallback(() => {
    void queryClient.resetQueries({ queryKey: ['asignaciones'] });
  }, [queryClient]);

  return {
    asignaciones: query.data ?? [],
    loading: query.isFetching,
    error: query.error ? getErrorMessage(query.error, 'Error al consultar las asignaciones') : null,
    buscarAsignaciones,
    crearAsignacionAPI: mutationCrear.mutateAsync,
    actualizarAsignacionAPI: mutationActualizar.mutateAsync,
    desasignarAPI: mutationDesasignar.mutateAsync,
    prevalidarBeneficioPensionista,
    prevalidarBeneficioAdultoMayor,
    limpiarAsignaciones,
    limpiarError,
    isCreating: mutationCrear.isPending || mutationActualizar.isPending || mutationDesasignar.isPending
  };
};

export default useAsignacion;
