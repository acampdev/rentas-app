import { describe, expect, it } from 'vitest';
import type { EstadoCuentaAnual } from '../../../services/cuentaCorrienteService';
import {
  buildSolicitudDTO,
  calculateOutstandingDebt,
  createInitialSolicitudValues,
  filterPreviousYearDebts,
} from './solicitudFraccionamiento.adapters';

describe('solicitudFraccionamiento adapters', () => {
  it('filters current debts and totals only previous years', () => {
    const details = [
      { anio: 2025, saldoNeto: 25.5 },
      { anio: 2026, saldoNeto: 100 },
    ] as EstadoCuentaAnual[];
    const previous = filterPreviousYearDebts(details, 2026);
    expect(previous).toHaveLength(1);
    expect(calculateOutstandingDebt(previous)).toBe(25.5);
  });

  it('builds the API payload without changing its contract', () => {
    const dto = buildSolicitudDTO({
      contribuyente: { codigo: '6', nombre: 'Contribuyente' },
      values: { ...createInitialSolicitudValues('8501', '4101'), deudaInsoluta: '120.50', numDocumento: '12345678' },
      tipoFraccionamientoOptions: [],
      tipoDocumentoOptions: [],
      codUsuario: 17,
      currentYear: 2026,
    });
    expect(dto).toMatchObject({
      codContribuyente: 6,
      tipoResolucion: '8501',
      deudaInsoluta: 120.5,
      tipoDocumento: '4101',
      numDocumento: '12345678',
      codUsuario: 17,
      anio: 2026,
    });
  });
});
