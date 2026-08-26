import { describe, expect, it } from 'vitest';
import type { Predio } from '../../models/Predio';
import {
  formatPredioDireccion,
  getPredioKey,
  getPredioRowKey,
  prepareSelectedPredio,
  sortPrediosByCode,
} from './selectorPredio.utils';

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

  it('creates a stable key and normalizes the selected property code', () => {
    const predio = {
      codPredioBase: '8', codigoPredio: '20268', codPredio: '20268', anio: 2026,
      direccion: 'Av. Lima 100', condicionPropiedad: '', conductor: '', areaTerreno: 0,
    } as Predio;

    expect(getPredioKey(predio)).toBe('8-Av. Lima 100--2026');
    expect(getPredioRowKey(predio, 0)).not.toBe(getPredioRowKey(predio, 1));
    expect(prepareSelectedPredio(predio)).toMatchObject({
      codPredioBase: '8', codigoPredio: '8', codPredio: '8',
    });
  });
});
