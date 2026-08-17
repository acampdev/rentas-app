import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {  useState } from 'react';
import { limpiezaPublicaService, CreateLimpiezaPublicaDTO } from '../services/limpiezaPublicaService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de arbitrios de limpieza pública con React Query
 */
export const useLimpiezaPublica = (anioInicial: number = new Date().getFullYear()) => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);

  // Query: Listar Limpieza Publica (Normal)
  const {
    data: limpiezaPublica = [],
    isLoading: loadingNormal,
    refetch: refetchNormal
  } = useQuery({
    queryKey: ['limpieza-publica', anio, 'normal'],
    queryFn: () => limpiezaPublicaService.listar(anio, 'normal'),
    placeholderData: (prev) => prev
  });

  // Query: Listar Limpieza Publica (Otros)
  const {
    data: limpiezaPublicaOtros = [],
    isLoading: loadingOtros,
    refetch: refetchOtros
  } = useQuery({
    queryKey: ['limpieza-publica', anio, 'otros'],
    queryFn: () => limpiezaPublicaService.listar(anio, 'otros'),
    placeholderData: (prev) => prev
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: ({ datos, tipo }: { datos: CreateLimpiezaPublicaDTO; tipo: 'normal' | 'otros' }) => 
      limpiezaPublicaService.crear(datos, tipo),
    onSuccess: (_, { tipo }) => {
      queryClient.invalidateQueries({ queryKey: ['limpieza-publica', anio, tipo] });
      NotificationService.success('Arbitrio registrado correctamente');
    }
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: ({ datos, tipo }: { datos: CreateLimpiezaPublicaDTO; tipo: 'normal' | 'otros' }) => 
      limpiezaPublicaService.actualizar(datos, tipo),
    onSuccess: (_, { tipo }) => {
      queryClient.invalidateQueries({ queryKey: ['limpieza-publica', anio, tipo] });
      NotificationService.success('Arbitrio actualizado correctamente');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (id: number) => limpiezaPublicaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limpieza-publica'] });
      NotificationService.success('Arbitrio eliminado correctamente');
    }
  });

  return {
    limpiezaPublica,
    limpiezaPublicaOtros,
    loading: loadingNormal || loadingOtros || mutationEliminar.isPending,
    anio,
    setAnio,
    
    // Acciones
    crearLimpiezaPublica: (datos: CreateLimpiezaPublicaDTO) => mutationCrear.mutateAsync({ datos, tipo: 'normal' }),
    crearLimpiezaPublicaOtros: (datos: CreateLimpiezaPublicaDTO) => mutationCrear.mutateAsync({ datos, tipo: 'otros' }),
    actualizarLimpiezaPublica: (datos: CreateLimpiezaPublicaDTO) => mutationActualizar.mutateAsync({ datos, tipo: 'normal' }),
    actualizarLimpiezaPublicaOtros: (datos: CreateLimpiezaPublicaDTO) => mutationActualizar.mutateAsync({ datos, tipo: 'otros' }),
    eliminarLimpiezaPublica: (id: number) => mutationEliminar.mutateAsync(id),
    
    recargar: async () => { await Promise.all([refetchNormal(), refetchOtros()]); },
    
    // Estados
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};
