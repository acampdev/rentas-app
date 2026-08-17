import { describe, expect, it } from 'vitest';
import { determinarNumeroPiso, extraerAnioYCodigoBase, parseFechaConstruccion, validatePisoForm } from './registrosPisos.validation';

describe('RegistrosPisos validation', () => {
  it('parses API dates without UTC displacement', () => {
    const date = parseFechaConstruccion('2024-03-15T00:00:00');
    expect([date?.getFullYear(), date?.getMonth(), date?.getDate()]).toEqual([2024, 2, 15]);
  });

  it('extracts year and base code', () => {
    expect(extraerAnioYCodigoBase('2024123')).toEqual({ anio: 2024, codigoBase: '123' });
  });

  it('returns field errors for an incomplete form', () => {
    expect(validatePisoForm({
      descripcion: '', fechaConstruccion: null, estadoConservacion: '', areaConstruida: '0', materialPredominante: '',
    }, false)).toMatchObject({ predio: expect.any(String), descripcion: expect.any(String), areaConstruida: expect.any(String) });
  });

  it('normalizes descriptive floor numbers', () => {
    expect(determinarNumeroPiso('Sótano')).toBe(-1);
    expect(determinarNumeroPiso('4')).toBe(4);
  });

  it('accepts a complete floor form', () => {
    expect(validatePisoForm({
      descripcion: '2',
      fechaConstruccion: new Date(2026, 1, 20),
      estadoConservacion: '9401',
      areaConstruida: '160',
      materialPredominante: '0701',
    }, true)).toEqual({});
  });

  it('rejects negative or non-numeric floors', () => {
    expect(validatePisoForm({
      descripcion: '-1',
      fechaConstruccion: new Date(),
      estadoConservacion: '9401',
      areaConstruida: '20',
      materialPredominante: '0701',
    }, true).descripcion).toContain('mayor o igual a 0');
  });
});
