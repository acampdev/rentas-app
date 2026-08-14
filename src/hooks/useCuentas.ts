// src/hooks/useCuentas.ts
import { useState, useCallback } from 'react';
import { NotificationService } from '../components/utils/Notification';

// Interfaces
export interface CuentaData {
  codCuenta: number;
  numeroCuenta: string;
  codPredio: string;
  contribuyente: string;
  anio: number;
  saldo: number;
  estado: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateCuentaDTO {
  codPredio: string;
  contribuyente: string;
  anio: number;
  saldoInicial?: number;
  estado?: string;
}

export interface UpdateCuentaDTO extends Partial<CreateCuentaDTO> {
  saldo?: number;
}

export interface MovimientoCuenta {
  id: number;
  fecha: string;
  concepto: string;
  tipo: 'Cargo' | 'Abono' | string;
  importe: number;
  saldoAnterior: number;
  saldoActual: number;
}

interface UseCuentasResult {
  cuentas: CuentaData[];
  loading: boolean;
  error: string | null;
  
  // Operaciones
  cargarTodasCuentas: () => Promise<void>;
  buscarCuentas: (termino: string, anio?: number) => Promise<void>;
  obtenerCuentaPorId: (codCuenta: number) => Promise<CuentaData | null>;
  crearCuenta: (datos: CreateCuentaDTO) => Promise<CuentaData | null>;
  actualizarCuenta: (codCuenta: number, datos: UpdateCuentaDTO) => Promise<CuentaData | null>;
  eliminarCuenta: (codCuenta: number) => Promise<void>;
  obtenerMovimientos: (codCuenta: number) => Promise<MovimientoCuenta[]>;
}

/**
 * Hook para gestionar cuentas corrientes
 */
export const useCuentas = (): UseCuentasResult => {
  const [cuentas, setCuentas] = useState<CuentaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todas las cuentas
   */
  const cargarTodasCuentas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [useCuentas] Cargando todas las cuentas...');
      
      // Simular datos de ejemplo mientras se implementa la API
      const cuentasEjemplo: CuentaData[] = [
        {
          codCuenta: 1,
          numeroCuenta: 'CC-2025-001',
          codPredio: '20258',
          contribuyente: 'Juan Pérez Rodríguez',
          anio: 2025,
          saldo: 1250.50,
          estado: 'Activo',
          fechaCreacion: '2025-01-15'
        },
        {
          codCuenta: 2,
          numeroCuenta: 'CC-2025-002', 
          codPredio: '20259',
          contribuyente: 'María García López',
          anio: 2025,
          saldo: 0.00,
          estado: 'Activo',
          fechaCreacion: '2025-01-20'
        },
        {
          codCuenta: 3,
          numeroCuenta: 'CC-2024-045',
          codPredio: '20245',
          contribuyente: 'Empresa Constructora SAC',
          anio: 2024,
          saldo: 850.75,
          estado: 'Activo',
          fechaCreacion: '2024-12-10'
        },
        {
          codCuenta: 4,
          numeroCuenta: 'CC-2025-003',
          codPredio: '20260',
          contribuyente: 'Carlos Mendoza Silva',
          anio: 2025,
          saldo: 0.00,
          estado: 'Cerrada',
          fechaCreacion: '2025-02-01'
        }
      ];
      
      // Simular delay del API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCuentas(cuentasEjemplo);
      console.log('✅ [useCuentas] Cuentas cargadas:', cuentasEjemplo.length);
      
    } catch (err: unknown) {
      const errorObj = err as Error;
      const mensaje = errorObj.message || 'Error al cargar las cuentas';
      console.error('❌ [useCuentas] Error cargando cuentas:', err);
      setError(mensaje);
      NotificationService.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar cuentas por término y año
   */
  const buscarCuentas = useCallback(async (termino: string, anio?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [useCuentas] Buscando cuentas:', { termino, anio });
      
      // Simular búsqueda filtrada
      await cargarTodasCuentas();
      
    } catch (err: unknown) {
      const errorObj = err as Error;
      const mensaje = errorObj.message || 'Error al buscar cuentas';
      console.error('❌ [useCuentas] Error buscando cuentas:', err);
      setError(mensaje);
      NotificationService.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, [cargarTodasCuentas]);

  /**
   * Obtener cuenta por ID
   */
  const obtenerCuentaPorId = useCallback(async (codCuenta: number): Promise<CuentaData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [useCuentas] Obteniendo cuenta por ID:', codCuenta);
      
      // Buscar en las cuentas ya cargadas
      const cuentaEncontrada = cuentas.find(c => c.codCuenta === codCuenta);
      
      if (cuentaEncontrada) {
        return cuentaEncontrada;
      }
      
      // Si no está en memoria, cargar todas y buscar
      await cargarTodasCuentas();
      return cuentas.find(c => c.codCuenta === codCuenta) || null;
      
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error('❌ [useCuentas] Error obteniendo cuenta:', err);
      setError(errorObj.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cuentas, cargarTodasCuentas]);

  /**
   * Crear nueva cuenta
   */
  const crearCuenta = useCallback(async (datos: CreateCuentaDTO): Promise<CuentaData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('➕ [useCuentas] Creando cuenta:', datos);
      
      // Simular creación
      const nuevaCuenta: CuentaData = {
        codCuenta: Math.max(...cuentas.map(c => c.codCuenta), 0) + 1,
        numeroCuenta: `CC-${datos.anio}-${String(cuentas.length + 1).padStart(3, '0')}`,
        codPredio: datos.codPredio,
        contribuyente: datos.contribuyente,
        anio: datos.anio,
        saldo: datos.saldoInicial || 0,
        estado: datos.estado || 'Activo',
        fechaCreacion: new Date().toISOString()
      };
      
      setCuentas(prev => [...prev, nuevaCuenta]);
      NotificationService.success('Cuenta creada exitosamente');
      
      return nuevaCuenta;
      
    } catch (err: unknown) {
      const errorObj = err as Error;
      const mensaje = errorObj.message || 'Error al crear la cuenta';
      console.error('❌ [useCuentas] Error creando cuenta:', err);
      setError(mensaje);
      NotificationService.error(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cuentas]);

  /**
   * Actualizar cuenta existente
   */
  const actualizarCuenta = useCallback(async (codCuenta: number, datos: UpdateCuentaDTO): Promise<CuentaData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 [useCuentas] Actualizando cuenta:', codCuenta, datos);
      
      // Simular actualización
      setCuentas(prev => prev.map(cuenta => 
        cuenta.codCuenta === codCuenta 
          ? { 
              ...cuenta, 
              ...datos, 
              fechaModificacion: new Date().toISOString() 
            }
          : cuenta
      ));
      
      const cuentaActualizada = cuentas.find(c => c.codCuenta === codCuenta);
      NotificationService.success('Cuenta actualizada exitosamente');
      
      return cuentaActualizada || null;
      
    } catch (err: unknown) {
      const errorObj = err as Error;
      const mensaje = errorObj.message || 'Error al actualizar la cuenta';
      console.error('❌ [useCuentas] Error actualizando cuenta:', err);
      setError(mensaje);
      NotificationService.error(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cuentas]);

  /**
   * Eliminar cuenta (cambio de estado lógico)
   */
  const eliminarCuenta = useCallback(async (codCuenta: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ [useCuentas] Eliminando cuenta:', codCuenta);
      
      // Simular eliminación (cambio de estado)
      setCuentas(prev => prev.map(cuenta => 
        cuenta.codCuenta === codCuenta 
          ? { 
              ...cuenta, 
              estado: 'Inactiva',
              fechaModificacion: new Date().toISOString() 
            }
          : cuenta
      ));
      
      NotificationService.success('Cuenta eliminada exitosamente');
      
    } catch (err: unknown) {
      const errorObj = err as Error;
      const mensaje = errorObj.message || 'Error al eliminar la cuenta';
      console.error('❌ [useCuentas] Error eliminando cuenta:', err);
      setError(mensaje);
      NotificationService.error(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener movimientos de una cuenta
   */
  const obtenerMovimientos = useCallback(async (codCuenta: number): Promise<MovimientoCuenta[]> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 [useCuentas] Obteniendo movimientos de cuenta:', codCuenta);
      
      // Simular movimientos de ejemplo
      const movimientosEjemplo: MovimientoCuenta[] = [
        {
          id: 1,
          fecha: '2025-01-15',
          concepto: 'Impuesto Predial 2025',
          tipo: 'Cargo',
          importe: 500.00,
          saldoAnterior: 0.00,
          saldoActual: 500.00
        },
        {
          id: 2,
          fecha: '2025-01-20',
          concepto: 'Pago en efectivo',
          tipo: 'Abono',
          importe: -200.00,
          saldoAnterior: 500.00,
          saldoActual: 300.00
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return movimientosEjemplo;
      
    } catch (err: unknown) {
      const errorObj = err as Error;
      const mensaje = errorObj.message || 'Error al obtener movimientos';
      console.error('❌ [useCuentas] Error obteniendo movimientos:', err);
      setError(mensaje);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estados
    cuentas,
    loading,
    error,
    
    // Operaciones
    cargarTodasCuentas,
    buscarCuentas,
    obtenerCuentaPorId,
    crearCuenta,
    actualizarCuenta,
    eliminarCuenta,
    obtenerMovimientos
  };
};