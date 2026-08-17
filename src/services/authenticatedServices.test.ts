import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import calleService from './calleApiService';
import { depreciacionService } from './depreciacionService';
import { vencimientoService } from './vencimientoService';

const expectAuthenticatedRequest = (fetchMock: ReturnType<typeof vi.fn>, method: string) => {
  const options = fetchMock.mock.calls[0][1] as RequestInit;
  const headers = new Headers(options.headers);

  expect(options.method).toBe(method);
  expect(options.credentials).toBe('include');
  expect(headers.get('Authorization')).toBe('Bearer token-operativo');
};

describe('servicios operativos autenticados', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('auth_token', 'token-operativo');
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it('crea una vía mediante el cliente HTTP central', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ codVia: 25 }));
    vi.stubGlobal('fetch', fetchMock);

    await calleService.create({
      nombreVia: 'Los Laureles',
      codTipoVia: '0101',
      codBarrio: 2,
      codSector: 3
    });

    expectAuthenticatedRequest(fetchMock, 'POST');
  });

  it('crea depreciación mediante el cliente HTTP central', async () => {
    const payload = {
      anio: '2026',
      codTipoCasa: '0501',
      codNivelAntiguedad: '0601',
      codMaterialEstructural: '0701',
      muyBueno: 5,
      bueno: 10,
      regular: 20,
      malo: 30
    };
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: payload }));
    vi.stubGlobal('fetch', fetchMock);

    await depreciacionService.crear(payload);

    expectAuthenticatedRequest(fetchMock, 'POST');
  });

  it('crea vencimientos mediante el cliente HTTP central', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await vencimientoService.crearVencimientos(2026);

    expectAuthenticatedRequest(fetchMock, 'POST');
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual({ anio: 2026 });
  });
});
