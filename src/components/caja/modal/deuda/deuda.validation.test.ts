import { describe, expect, it } from 'vitest';
import { mapTributoNameToCode, parsePositiveAmount } from './deuda.validation';

describe('debt validation utilities', () => {
  it('maps known tax names to backend codes', () => {
    expect(mapTributoNameToCode('Impuesto predial')).toBe(1);
    expect(mapTributoNameToCode('Parques y jardines')).toBe(4);
  });

  it('accepts only positive payment amounts', () => {
    expect(parsePositiveAmount('S/. 120.50')).toBe(120.5);
    expect(parsePositiveAmount('0')).toBeNull();
  });
});
