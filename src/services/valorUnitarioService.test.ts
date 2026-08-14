import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  VALOR_UNITARIO_API_URL,
  valorUnitarioService
} from './valorUnitarioService';

const apiItems = [{
  codigoValorUnitario: '202411011001100101',
  anio: 2024,
  codCategoria: 'ESTRUCTURAS',
  codSubcategoria: '100101',
  codLetra: 'A',
  costo: 120
}];

describe('ValorUnitarioService API contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses the backend URL and the anio query parameter', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(apiItems));
    vi.stubGlobal('fetch', fetchMock);

    const valores = await valorUnitarioService.consultarValoresUnitarios({ anio: 2024 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${VALOR_UNITARIO_API_URL}?anio=2024`);
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('a%C3%B1o');
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('localhost:3000');
    expect(valores[0].id).toBe('202411011001100101');
  });

  it('uses the same correct URL for the statistics query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(apiItems));
    vi.stubGlobal('fetch', fetchMock);

    await valorUnitarioService.obtenerEstadisticas(2024);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${VALOR_UNITARIO_API_URL}?anio=2024`);
  });
});
