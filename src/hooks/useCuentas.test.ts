import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CUENTAS_NO_DISPONIBLE, useCuentas } from './useCuentas';
import type { CuentaData, MovimientoCuenta } from './useCuentas';

describe('useCuentas sin API operativa', () => {
  it('no devuelve cuentas simuladas y expone el estado no disponible', async () => {
    const { result } = renderHook(() => useCuentas());

    await act(async () => {
      await result.current.cargarTodasCuentas();
    });

    expect(result.current.cuentas).toEqual([]);
    expect(result.current.error).toBe(CUENTAS_NO_DISPONIBLE);
  });

  it('no genera movimientos ni cuentas ficticias', async () => {
    const { result } = renderHook(() => useCuentas());
    let cuenta: CuentaData | null | undefined;
    let movimientos: MovimientoCuenta[] | undefined;

    await act(async () => {
      cuenta = await result.current.crearCuenta({
        codPredio: '20261',
        contribuyente: 'No persistir',
        anio: 2026,
      });
      movimientos = await result.current.obtenerMovimientos(1);
    });

    expect(cuenta).toBeNull();
    expect(movimientos).toEqual([]);
    expect(result.current.cuentas).toEqual([]);
  });
});
