// src/hooks/useAperturaCajas.ts
import { useState, useCallback } from 'react';
import { NotificationService } from '../components/utils/Notification';
import {
  aperturaCajaService
} from '../services/aperturaCajaService';
import { AperturaCaja, AperturaCajaDTO, CierreCajaDTO } from '../models';

/**
 * Hook para gestionar apertura y cierre de cajas
 * Todas las operaciones requieren la sesión autenticada del cliente HTTP.
 */
export const useAperturaCajas = () => {
  const [aperturaActual, setAperturaActual] = useState<AperturaCaja | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Realiza la apertura de una caja
   */
  const abrirCaja = useCallback(async (datos: AperturaCajaDTO): Promise<AperturaCaja | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useAperturaCajas] Abriendo caja:', datos);

      // Validar datos
      if (datos.montoApertura === undefined || datos.montoApertura === null || !datos.codUsuario) {
        throw new Error('El monto de apertura y el usuario son requeridos');
      }

      // Validar que el monto sea positivo
      if (datos.montoApertura < 0) {
        throw new Error('El monto de apertura debe ser mayor o igual a 0');
      }

      // Realizar apertura
      const apertura = await aperturaCajaService.apertura(datos);

      // Guardar apertura actual
      setAperturaActual(apertura);

      NotificationService.success('Caja abierta correctamente');

      return apertura;

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al abrir caja';
      console.error('[useAperturaCajas] Error al abrir caja:', error);
      setError(message);
      NotificationService.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Realiza el cierre de una caja
   */
  const cerrarCaja = useCallback(async (datos: CierreCajaDTO): Promise<AperturaCaja | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useAperturaCajas] Cerrando caja:', datos);

      // Validar datos
      if (
        datos.codAperturaCaja === undefined ||
        datos.codAperturaCaja === null ||
        datos.montoCierre === undefined ||
        datos.montoCierre === null ||
        !datos.codUsuario
      ) {
        throw new Error('Todos los campos son requeridos para el cierre');
      }

      // Realizar cierre
      const cierre = await aperturaCajaService.cierre(datos);

      // Limpiar apertura actual
      setAperturaActual(null);

      NotificationService.success('Caja cerrada correctamente');

      return cierre;

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al cerrar caja';
      console.error('[useAperturaCajas] Error al cerrar caja:', error);
      setError(message);
      NotificationService.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene la apertura activa de un usuario del servidor
   */
  const obtenerAperturaUsuario = useCallback(async (codUsuario: number): Promise<AperturaCaja | null> => {
    try {
      setLoading(true);
      setError(null);
      const apertura = await aperturaCajaService.obtenerPorUsuario(codUsuario);
      if (apertura) {
        setAperturaActual(apertura);
      }
      return apertura;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al obtener apertura';
      console.error('[useAperturaCajas] Error al obtener apertura:', error);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lista todas las aperturas de caja de un usuario del servidor
   */
  const listarAperturasUsuario = useCallback(async (codUsuario: number): Promise<AperturaCaja[]> => {
    try {
      setLoading(true);
      setError(null);
      const lista = await aperturaCajaService.listarPorUsuario(codUsuario);
      return lista;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al listar aperturas';
      console.error('[useAperturaCajas] Error al listar aperturas:', error);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Valida si se puede realizar una apertura
   */
  const validarApertura = useCallback(async (codAsignacionCaja: number, fecha: string): Promise<boolean> => {
    try {
      console.log('[useAperturaCajas] Validando apertura...');

      // Validar que no haya una apertura activa
      if (aperturaActual && aperturaActual.estado === 'ABIERTA') {
        NotificationService.warning('Ya existe una caja abierta. Debe cerrarla antes de abrir otra.');
        return false;
      }

      const esValida = await aperturaCajaService.validarApertura(codAsignacionCaja, fecha);

      if (!esValida) {
        NotificationService.warning('No se puede realizar la apertura de caja en este momento');
      }

      return esValida;

    } catch (error: unknown) {
      console.error('[useAperturaCajas] Error validando apertura:', error);
      return false;
    }
  }, [aperturaActual]);

  /**
   * Valida si se puede realizar un cierre
   */
  const validarCierre = useCallback(async (codAperturaCaja: number, codUsuario: number): Promise<boolean> => {
    try {
      console.log('[useAperturaCajas] Validando cierre...');

      // Validar que haya una apertura activa
      if (!aperturaActual || aperturaActual.estado !== 'ABIERTA') {
        NotificationService.warning('No hay una caja abierta para cerrar');
        return false;
      }

      const esValido = await aperturaCajaService.validarCierre(codAperturaCaja, codUsuario);

      if (!esValido) {
        NotificationService.warning('No se puede realizar el cierre de caja en este momento');
      }

      return esValido;

    } catch (error: unknown) {
      console.error('[useAperturaCajas] Error validando cierre:', error);
      return false;
    }
  }, [aperturaActual]);

  /**
   * Limpia el estado de la apertura actual
   */
  const limpiarAperturaActual = useCallback(() => {
    setAperturaActual(null);
    setError(null);
  }, []);

  /**
   * Establece una apertura como actual (util para cargar estado guardado)
   */
  const setearAperturaActual = useCallback((apertura: AperturaCaja | null) => {
    setAperturaActual(apertura);
  }, []);

  /**
   * Verifica si hay una caja abierta actualmente
   */
  const tieneCajaAbierta = useCallback((): boolean => {
    return aperturaActual !== null && aperturaActual.estado === 'ABIERTA';
  }, [aperturaActual]);

  /**
   * Obtiene el codigo de la apertura actual
   */
  const obtenerCodAperturaActual = useCallback((): number | null => {
    return aperturaActual?.codAperturaCaja || null;
  }, [aperturaActual]);

  /**
   * Obtiene el monto de apertura actual
   */
  const obtenerMontoAperturaActual = useCallback((): number | null => {
    return aperturaActual?.montoApertura || null;
  }, [aperturaActual]);

  return {
    // Estado
    aperturaActual,
    loading,
    error,

    // Operaciones principales
    abrirCaja,
    cerrarCaja,

    // Validaciones
    validarApertura,
    validarCierre,

    // Utilidades
    limpiarAperturaActual,
    setearAperturaActual,
    tieneCajaAbierta,
    obtenerCodAperturaActual,
    obtenerMontoAperturaActual,
    obtenerAperturaUsuario,
    listarAperturasUsuario
  };
};
