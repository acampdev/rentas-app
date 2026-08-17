import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { aperturaCajaService } from './aperturaCajaService';
import { depreciacionService } from './depreciacionService';
import { direccionService } from './direccionService';
import { vencimientoService } from './vencimientoService';
import type { ApiClientError } from './apiClient';

const errorResponse = (status: number, message: string) =>
  Response.json({ message }, { status });

describe('propagación de errores en servicios operativos', () => {
  beforeEach(() => {
    window.sessionStorage.setItem('auth_user', JSON.stringify({ codUsuario: 17 }));
  });

  afterEach(() => {
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([
    [401, () => direccionService.getAll(), 'Sesión vencida'],
    [403, () => depreciacionService.consultar(2026, '0101'), 'Acceso restringido'],
    [500, () => vencimientoService.obtenerPorAnio(2026), 'Fallo interno'],
    [401, () => aperturaCajaService.obtenerPorUsuario(17), 'Token inválido'],
    [500, () => aperturaCajaService.listarPorUsuario(17), 'Caja no disponible'],
  ])('propaga HTTP %s en vez de devolver un resultado vacío', async (status, operation, message) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(status, message)));

    await expect(operation()).rejects.toMatchObject<ApiClientError>({
      statusCode: status,
      message,
    });
  });

  it('conserva una lista vacía cuando la respuesta exitosa realmente no contiene registros', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true, data: [] })));

    await expect(depreciacionService.consultar(2026, '0101')).resolves.toEqual([]);
  });

  it('trata únicamente el 404 de apertura como ausencia válida', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(404, 'No existe apertura')));

    await expect(aperturaCajaService.obtenerPorUsuario(17)).resolves.toBeNull();
    await expect(aperturaCajaService.listarPorUsuario(17)).resolves.toEqual([]);
  });
});
