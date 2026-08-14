import { describe, expect, it } from 'vitest';
import type { Predio } from '../../models/Predio';
import { formatPredioDireccion, sortPrediosByCode } from './selectorPredio.utils';

describe('selectorPredio utilities', () => {
  it('formats a structured address', () => {
    expect(formatPredioDireccion({
      nombreTipoVia: 'Av.', nombreVia: 'Lima', cuadra: '2', loteInicial: 4, loteFinal: 4,
      nombreBarrio: 'Centro', nombreSector: 'Norte',
    })).toBe('Av. Lima, Cuadra 2, Lote 4, Centro, Sector Norte');
  });

  it('sorts numeric property codes in both directions', () => {
    const predios = [{ codPredioBase: '10' }, { codPredioBase: '2' }] as Predio[];
    expect(sortPrediosByCode(predios, 'asc').map(item => item.codPredioBase)).toEqual(['2', '10']);
    expect(sortPrediosByCode(predios, 'desc').map(item => item.codPredioBase)).toEqual(['10', '2']);
  });
});
