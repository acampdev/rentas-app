import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {  useState } from 'react';
import { depreciacionService } from '../services/depreciacionService';
import { NotificationService } from '../components/utils/Notification';

/**
 * Hook para gestión de Depreciación con React Query
 */
export const useDepreciacion = (anioInicial: number = new Date().getFullYear(), codTipoCasaInicial: string = '0501') => {
  const queryClient = useQueryClient();
  const [anio, setAnio] = useState(anioInicial);
  const [codTipoCasa, setCodTipoCasa] = useState(codTipoCasaInicial);

  // Query: Consultar
  const {
    data: depreciaciones = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['depreciaciones', anio, codTipoCasa],
    queryFn: () => depreciacionService.consultar(anio, codTipoCasa),
    placeholderData: (prev) => prev
  });

  // Mutación: Guardar (Crear o Actualizar)
  const mutationGuardar = useMutation({
    mutationFn: (datos: any) => {
      const { isEditMode, ...payload } = datos;
      if (isEditMode) {
        return depreciacionService.actualizar(payload);
      } else {
        return depreciacionService.crear(payload);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['depreciaciones', anio, codTipoCasa] });
      NotificationService.success(
        variables.isEditMode 
          ? 'Depreciación actualizada correctamente' 
          : 'Depreciación registrada correctamente'
      );
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al guardar depreciación');
    }
  });

  return {
    depreciaciones,
    loading,
    error: error ? (error as Error).message : null,
    anio,
    setAnio,
    codTipoCasa,
    setCodTipoCasa,
    
    // Acciones
    consultarDepreciaciones: () => refetch(),
    crearDepreciacion: mutationGuardar.mutateAsync,
    guardarDepreciacion: mutationGuardar.mutateAsync,
    
    // Estados
    isCreating: mutationGuardar.isPending
  };
};
