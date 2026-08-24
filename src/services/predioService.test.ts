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
      '/api/predio/all?codPredioBase=30&anio=2026'
    );
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('parametroBusqueda');
    expect(predios[0]).toMatchObject({ codPredioBase: '30', anio: 2026 });
  });

  it('normalizes and deduplicates predio usage options returned by the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      data: [
        { codUso: 10, descripcion: 'Comercio', codGrupoUso: 2 },
        { codUso: 10, descripcion: 'Comercio duplicado', codGrupoUso: 2 },
        { codUsoPredio: 11, descripcionUso: 'Industria', codGrupoUso: 3 },
        { codUso: null, descripcion: '' }
      ]
    }));
    vi.stubGlobal('fetch', fetchMock);

    const usos = await predioService.obtenerUsosPredio();

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      '/api/predio/usos'
    );
    expect(usos).toEqual([
      { codUsoPredio: 10, codGrupoUso: 2, descripcionUso: 'Comercio' },
      { codUsoPredio: 11, codGrupoUso: 3, descripcionUso: 'Industria' }
    ]);
  });
});
