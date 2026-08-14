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
});
