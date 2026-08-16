import { afterEach, describe, expect, it, vi } from 'vitest';
import { pisoService } from './pisoService';

describe('PisoService editing API contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the complete floor from /api/piso/all before editing', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([{
      anio: 2025,
      codPredio: '20255       ',
      codPredioBase: '5',
      codPiso: 1,
      numeroPiso: 1,
      fechaConstruccion: '2020-01-16',
      codLetraMurosColumnas: '1101',
      codEstadoConservacion: '9401',
      codMaterialEstructural: '0701',
      areaConstruida: 160,
      valorAreasComunes: 0,
      areaTotalConstruccion: 160
    }]));
    vi.stubGlobal('fetch', fetchMock);

    const piso = await pisoService.consultarPisoParaEdicion({
      anio: 2025,
      codPredioBase: '5',
      numeroPiso: 1
    });

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'http://26.161.18.122:8085/api/piso/all?anio=2025&codPredioBase=5&numeroPiso=1'
    );
    expect(piso).toMatchObject({
      anio: 2025,
      codPredio: '20255',
      codPredioBase: '5',
      codPiso: 1,
      numeroPiso: 1,
      fechaConstruccion: '2020-01-16',
      areaConstruida: 160,
      valorAreasComunes: 0,
      areaTotalConstruccion: 160
    });
  });
});
