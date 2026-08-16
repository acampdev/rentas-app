import { afterEach, describe, expect, it, vi } from 'vitest';
import { predioService } from './predioService';

describe('PredioService filter API contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses /api/predio/all with codPredioBase and anio', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([{
      codPredio: '202630',
      codPredioBase: '30',
      anio: 2026,
      areaTerreno: 200
    }]));
    vi.stubGlobal('fetch', fetchMock);

    const predios = await predioService.buscarPrediosConFiltros({
      codPredioBase: '30',
      anio: 2026,
      parametroBusqueda: 'ignorado'
    });

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'http://26.161.18.122:8085/api/predio/all?codPredioBase=30&anio=2026'
    );
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('parametroBusqueda');
    expect(predios[0]).toMatchObject({ codPredioBase: '30', anio: 2026 });
  });
});
