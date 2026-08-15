// src/hooks/useTransferencia.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '../components/utils/Notification';
import {
  transferenciaService,
  type BuscarTransferenciaPredioParams,
  type CreateTransferenciaPredioDTO,
  type UpdateTransferenciaPredioDTO
} from '../services/transferenciaService';

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message ? error.message : fallback;

export const useTransferencia = () => {
  const queryClient = useQueryClient();

  const buscarMutation = useMutation({
    mutationFn: (filtros: BuscarTransferenciaPredioParams) => transferenciaService.buscar(filtros),
    onError: (error: unknown) => {
      NotificationService.error(getErrorMessage(error, 'No se pudieron consultar las transferencias'));
    }
  });

  const crearMutation = useMutation({
    mutationFn: (datos: CreateTransferenciaPredioDTO) => transferenciaService.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferenciasPredio'] });
      NotificationService.success('Transferencia registrada correctamente');
    },
    onError: (error: unknown) => {
      NotificationService.error(getErrorMessage(error, 'No se pudo registrar la transferencia'));
    }
  });

  const actualizarMutation = useMutation({
    mutationFn: (datos: UpdateTransferenciaPredioDTO) => transferenciaService.actualizar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferenciasPredio'] });
      NotificationService.success('Transferencia actualizada correctamente');
    },
    onError: (error: unknown) => {
      NotificationService.error(getErrorMessage(error, 'No se pudo actualizar la transferencia'));
    }
  });

  return {
    transferencias: buscarMutation.data ?? [],
    buscarTransferencias: buscarMutation.mutateAsync,
    crearTransferencia: crearMutation.mutateAsync,
    actualizarTransferencia: actualizarMutation.mutateAsync,
    limpiarResultados: buscarMutation.reset,
    isSearching: buscarMutation.isPending,
    isCreating: crearMutation.isPending,
    isUpdating: actualizarMutation.isPending,
    searchError: buscarMutation.error
  };
};
