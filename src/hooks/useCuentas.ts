import { useCallback, useState } from 'react';

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
  cargarTodasCuentas: () => Promise<void>;
  buscarCuentas: (termino: string, anio?: number) => Promise<void>;
  obtenerCuentaPorId: (codCuenta: number) => Promise<CuentaData | null>;
  crearCuenta: (datos: CreateCuentaDTO) => Promise<CuentaData | null>;
  actualizarCuenta: (codCuenta: number, datos: UpdateCuentaDTO) => Promise<CuentaData | null>;
  eliminarCuenta: (codCuenta: number) => Promise<void>;
  obtenerMovimientos: (codCuenta: number) => Promise<MovimientoCuenta[]>;
}

export const CUENTAS_NO_DISPONIBLE =
  'Módulo no disponible: las cuentas corrientes todavía no están conectadas a una API municipal.';

export const useCuentas = (): UseCuentasResult => {
  const [error, setError] = useState<string | null>(null);

  const marcarNoDisponible = useCallback(() => {
    setError(CUENTAS_NO_DISPONIBLE);
  }, []);

  const cargarTodasCuentas = useCallback(async () => {
    marcarNoDisponible();
  }, [marcarNoDisponible]);

  const buscarCuentas = useCallback(async (_termino: string, _anio?: number) => {
    marcarNoDisponible();
  }, [marcarNoDisponible]);

  const obtenerCuentaPorId = useCallback(async (_codCuenta: number) => {
    marcarNoDisponible();
    return null;
  }, [marcarNoDisponible]);

  const crearCuenta = useCallback(async (_datos: CreateCuentaDTO) => {
    marcarNoDisponible();
    return null;
  }, [marcarNoDisponible]);

  const actualizarCuenta = useCallback(async (_codCuenta: number, _datos: UpdateCuentaDTO) => {
    marcarNoDisponible();
    return null;
  }, [marcarNoDisponible]);

  const eliminarCuenta = useCallback(async (_codCuenta: number) => {
    marcarNoDisponible();
    throw new Error(CUENTAS_NO_DISPONIBLE);
  }, [marcarNoDisponible]);

  const obtenerMovimientos = useCallback(async (_codCuenta: number) => {
    marcarNoDisponible();
    return [];
  }, [marcarNoDisponible]);

  return {
    cuentas: [],
    loading: false,
    error,
    cargarTodasCuentas,
    buscarCuentas,
    obtenerCuentaPorId,
    crearCuenta,
    actualizarCuenta,
    eliminarCuenta,
    obtenerMovimientos,
  };
};
