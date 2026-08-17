import { afterEach, describe, expect, it, vi } from 'vitest';
import { ipmService, type IPMWriteDTO } from './ipmService';

const payload: IPMWriteDTO = {
  anio: 2026,
  mes: '2406',
  indice: 1320.515008,
  variacionMensual: -0.96,
  variacionAcumulada: 3.58,
  usuario: null
};

describe('IPMService API contracts', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('lists IPM records by year', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([{
      anio: 2026,
      codMes: '2401',
      mes: 'Enero',
      indice: 126.084356,
      variacionMensual: 0.07,
      variacionAcumulada: 0.07,
      usuario: null
    }]));
    vi.stubGlobal('fetch', fetchMock);

    const result = await ipmService.listarPorAnio(2026);

    expect(String(fetchMock.mock.calls[0][0])).toBe('http://26.161.18.122:8085/api/ipm?anio=2026');
    expect(result[0]).toEqual({
      anio: 2026,
      codMes: '2401',
      mes: 'Enero',
      indice: 126.084356,
      variacionMensual: 0.07,
      variacionAcumulada: 0.07,
      usuario: null
    });
  });

  it.each([
    ['POST', () => ipmService.crear(payload)],
    ['PUT', () => ipmService.actualizar(payload)]
  ] as const)('sends the expected %s payload', async (method, execute) => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: payload }));
    vi.stubGlobal('fetch', fetchMock);

    await execute();

    expect(String(fetchMock.mock.calls[0][0])).toBe('http://26.161.18.122:8085/api/ipm');
    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.method).toBe(method);
    expect(JSON.parse(String(options.body))).toEqual(payload);
  });
});
