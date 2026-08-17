import { describe, expect, it } from 'vitest';
import { predioSchema } from './usePredioForm';

describe('Predio form validation', () => {
  it('accepts the minimum complete property data', () => {
    expect(predioSchema.safeParse({
      anio: 2026,
      condicionPropiedad: '2701',
      conductor: '1401',
      areaTerreno: 200
    }).success).toBe(true);
  });

  it('rejects missing ownership/conductor and a negative area', () => {
    const result = predioSchema.safeParse({
      anio: 2026,
      condicionPropiedad: '',
      conductor: '',
      areaTerreno: -1
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(['condicionPropiedad', 'conductor', 'areaTerreno'])
      );
    }
  });

  it('rejects years outside the supported range', () => {
    expect(predioSchema.safeParse({
      anio: 1800,
      condicionPropiedad: '2701',
      conductor: '1401',
      areaTerreno: 20
    }).success).toBe(false);
  });
});
