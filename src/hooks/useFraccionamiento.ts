import { logger } from '../utils/logger';
// src/hooks/useFraccionamiento.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { fraccionamientoService } from '../services/fraccionamientoService';
import { NotificationService } from '../components/utils/Notification';
import type {
  
  CreateFraccionamientoDTO,
  AprobacionFraccionamientoForm,
  FraccionamientoFiltros
} from '../types/fraccionamiento.types';

/**
 * Hook para gestión de Fraccionamientos con React Query
 */
export const useFraccionamiento = (
  filtrosIniciales: FraccionamientoFiltros = {},
  options?: { enabledList?: boolean; enabledStats?: boolean }
) => {
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState<FraccionamientoFiltros>(filtrosIniciales);

  // Query: Listar solicitudes
  const {
    data: fraccionamientos = [],
    isLoading: loading,
    error,
    refetch: obtenerSolicitudes
  } = useQuery({
    queryKey: ['fraccionamientos', filtros],
    queryFn: () => fraccionamientoService.getAll(filtros),
    enabled: options?.enabledList ?? true
  });

  // Query: Estadísticas
  const { data: estadisticas = null } = useQuery({
    queryKey: ['fraccionamientos-stats'],
    queryFn: () => fraccionamientoService.obtenerEstadisticas(),
    enabled: options?.enabledStats ?? true
  });

  // Mutación: Crear solicitud
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateFraccionamientoDTO) => fraccionamientoService.create(datos),
    onSuccess: (data) => {
      logger.log('🎉 [useFraccionamiento] Mutation onSuccess recibida del API:', data);
      queryClient.invalidateQueries({ queryKey: ['fraccionamientos'] });
      NotificationService.success('Solicitud de fraccionamiento registrada');
    },
    onError: (err: any) => {
      logger.error('💥 [useFraccionamiento] Mutation onError recibida del API:', err);
      NotificationService.error(err.message || 'Error al registrar solicitud');
    }
  });

  // Mutación: Aprobar
  const mutationAprobar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: AprobacionFraccionamientoForm }) => 
      fraccionamientoService.aprobarSolicitud(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraccionamientos'] });
      NotificationService.success('Fraccionamiento aprobado correctamente');
    }
  });

  // Mutación: Cancelar
  const mutationCancelar = useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => 
      fraccionamientoService.cancelarFraccionamiento(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraccionamientos'] });
      NotificationService.success('Fraccionamiento cancelado correctamente');
    }
  });

  const obtenerCronogramaContribuyente = useCallback(
    (codContribuyente: number | string) => queryClient.fetchQuery({
      queryKey: ['fraccionamiento-cronograma-contribuyente', codContribuyente],
      queryFn: () => fraccionamientoService.listarCronogramaContribuyente(codContribuyente)
    }),
    [queryClient]
  );

  return {
    fraccionamientos,
    estadisticas,
    loading,
    cargando: loading, // Alias compatibilidad
    error: error ? (error as Error).message : null,
    
    // Acciones
    obtenerSolicitudes,
    buscar: (nuevosFiltros: FraccionamientoFiltros) => {
      setFiltros(nuevosFiltros);
    },
    crearSolicitud: mutationCrear.mutateAsync,
    aprobarSolicitud: mutationAprobar.mutateAsync,
    rechazarSolicitud: (id: number, motivo: string) => 
      mutationAprobar.mutateAsync({ id, datos: { id, aprobado: false, motivoRechazo: motivo } }),
    cancelarFraccionamiento: (id: number, motivo: string) => mutationCancelar.mutateAsync({ id, motivo }),
    
    // Utilidades
    obtenerDeudas: (codigo: string) => 
      queryClient.fetchQuery({
        queryKey: ['fraccionamiento-deudas', codigo],
        queryFn: () => fraccionamientoService.obtenerDeudasContribuyente(codigo)
      }),
    obtenerCronograma: (anio: number, codResolucion: number) => 
      queryClient.fetchQuery({
        queryKey: ['fraccionamiento-cronograma', anio, codResolucion],
        queryFn: () => fraccionamientoService.obtenerCronograma(anio, codResolucion)
      }),
    obtenerCronogramaContribuyente
  };
};

export default useFraccionamiento;
