import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { predioService } from './predioService';

const validPredioPayload = {
  anio: 2026,
  codPredio: null,
  numeroFinca: 10,
  otroNumero: '',
  codClasificacion: '0502',
  estPredio: '2501',
  codTipoPredio: '2601',
  codCondicionPropiedad: '2701',
  codDireccion: 10,
  codUsoPredio: 1,
  fechaAdquisicion: '2026-08-26',
  numeroCondominos: 1,
  codListaConductor: '1401',
  codUbicacionAreaVerde: 1,
  areaTerreno: 120,
  totalAreaConstruccion: null,
  valorTotalConstruccion: null,
  valorTerreno: null,
  autoavaluo: null,
  codEstado: '0201',
  codUsuario: 17,
};

describe('PredioService filter API contract', () => {
  beforeEach(() => {
    sessionStorage.setItem('auth_user', JSON.stringify({ codUsuario: 17 }));
    sessionStorage.setItem('auth_token', 'token-predio');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
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

  it('conserva el mensaje informativo devuelto al registrar un predio', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      success: true,
      message: 'Predio registrado por el API',
      data: { codPredio: '202640', anio: 2026, areaTerreno: 120 },
    })));

    const result = await predioService.crearPredio(validPredioPayload);

    expect(result.operationMessage).toBe('Predio registrado por el API');
    expect(result.codPredio).toBe('202640');
  });

  it('prioriza data cuando el API devuelve allí el mensaje real', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      success: true,
      message: 'Operation Success!',
      data: 'El predio fue actualizado correctamente.',
    })));

    const result = await predioService.crearPredio(validPredioPayload);

    expect(result.operationMessage).toBe(
      'El predio fue actualizado correctamente.',
    );
  });

  it('usa PUT y conserva el código real al actualizar un predio', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      success: true,
      message: 'Predio actualizado por el API',
      data: { codPredio: '202630', anio: 2026, areaTerreno: 125 },
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await predioService.actualizarPredio({
      ...validPredioPayload,
      codPredio: '202630',
      areaTerreno: 125,
    });

    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'PUT' });
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toMatchObject({
      codPredio: '202630',
      areaTerreno: 125,
    });
    expect(result.operationMessage).toBe('Predio actualizado por el API');
  });
});
