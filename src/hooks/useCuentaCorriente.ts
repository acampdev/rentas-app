import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
  cuentaCorrienteService,
  EstadoCuentaAnual,
  EstadoCuentaDetalle
} from '../services/cuentaCorrienteService';

/**
 * Hook para gestionar la Cuenta Corriente y Estado de Cuenta con React Query
 */
export const useCuentaCorriente = (codContribuyenteInicial?: number | string) => {
  const [codContribuyente, setCodContribuyente] = useState<number | string | undefined>(codContribuyenteInicial);
  const [anioDetalle, setAnioDetalle] = useState<number | null>(null);

  // Query para Estado de Cuenta Anual
  const {
    data: estadoCuentaAnual = [],
    isLoading: loadingEstadoCuenta,
    isFetching: fetchingEstadoCuenta,
    error: errorEstadoCuenta,
    refetch: cargarEstadoCuenta
  } = useQuery({
    queryKey: ['estado-cuenta-anual', codContribuyente],
    queryFn: async () => {
      if (!codContribuyente) return [];
      return cuentaCorrienteService.listarEstadoCuenta(codContribuyente);
    },
    enabled: !!codContribuyente,
    placeholderData: (prev) => prev
  });

  // Query para Detalle de Estado de Cuenta
  const {
    data: estadoCuentaDetalle = [],
    isLoading: loadingDetalle,
    error: errorDetalle,
    refetch: cargarDetalleEstadoCuenta
  } = useQuery({
    queryKey: ['estado-cuenta-detalle', codContribuyente, anioDetalle],
    queryFn: async () => {
      if (!codContribuyente || !anioDetalle) return [];
      return cuentaCorrienteService.listarDetalleEstadoCuenta(codContribuyente, anioDetalle);
    },
    enabled: !!codContribuyente && !!anioDetalle,
    placeholderData: (prev) => prev
  });

  const seleccionarContribuyente = useCallback((id: number | string) => {
    setCodContribuyente(id);
    setAnioDetalle(null);
  }, []);

  const verDetalleAnio = useCallback((anio: number) => {
    setAnioDetalle(anio);
  }, []);

  const limpiarTodo = useCallback(() => {
    setCodContribuyente(undefined);
    setAnioDetalle(null);
  }, []);

  return {
    // Estados de Estado de Cuenta Anual
    estadoCuentaAnual,
    loadingEstadoCuenta: loadingEstadoCuenta || fetchingEstadoCuenta,
    errorEstadoCuenta: errorEstadoCuenta ? (errorEstadoCuenta as Error).message : null,

    // Estados de Detalle
    estadoCuentaDetalle,
    loadingDetalle,
    errorDetalle: errorDetalle ? (errorDetalle as Error).message : null,

    // Variables de control
    codContribuyente,
    anioDetalle,

    // Funciones
    seleccionarContribuyente,
    verDetalleAnio,
    cargarEstadoCuenta,
    cargarDetalleEstadoCuenta,
    limpiarTodo,
    
    // Manteniendo compatibilidad con nombres antiguos
    cargarDetalle: verDetalleAnio,
    limpiarDetalle: () => setAnioDetalle(null),
    limpiarEstadoCuenta: () => setCodContribuyente(undefined)
  };
};
