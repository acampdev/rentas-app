import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { aperturaCajaService } from './aperturaCajaService';
import { depreciacionService } from './depreciacionService';
import { direccionService } from './direccionService';
import { vencimientoService } from './vencimientoService';
import { predioService } from './predioService';
import { pisoService } from './pisoService';
import { personaService } from './personaService';
import { uitService } from './uitService';
import { sectorService } from './SectorService';
import { constanteService } from './constanteService';
import { interesService } from './interesService';
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

  it.each([
    [401, () => predioService.obtenerPredios(), 'Sesión de predios vencida'],
    [403, () => pisoService.consultarPisos({ anio: 2026 }), 'Pisos restringidos'],
    [401, () => personaService.obtenerPorId(8), 'Persona no autorizada'],
    [403, () => uitService.listarUITs(2026), 'UIT restringida'],
    [401, () => sectorService.obtenerTodos(), 'Sector no autorizado'],
    [500, () => constanteService.listarConstantesPorPadre('4100'), 'Constantes no disponibles'],
    [500, () => interesService.obtenerPorAnio(2026), 'Intereses no disponibles'],
  ])('propaga HTTP %s desde los catálogos auditados', async (status, operation, message) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(status, message)));

    await expect(operation()).rejects.toMatchObject<ApiClientError>({
      statusCode: status,
      message,
    });
  });

  it.each([
    [() => personaService.listarPersona('4101', '12345678')],
    [() => constanteService.listarConstantesPorPadre('4100')],
    [() => interesService.obtenerPorAnio(2026)],
  ])('propaga success false aunque el servidor responda HTTP 200', async (operation) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      success: false,
      data: 'La operación de consulta fue rechazada',
    })));

    await expect(operation()).rejects.toMatchObject<ApiClientError>({
      statusCode: 200,
      message: 'La operación de consulta fue rechazada',
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

  it.each([
    [() => predioService.obtenerPredios(), []],
    [() => pisoService.consultarPisos({ anio: 2026 }), []],
    [() => personaService.obtenerPorId(8), null],
    [() => uitService.listarUITs(2026), []],
    [() => sectorService.obtenerTodos(), []],
    [() => constanteService.listarConstantesPorPadre('4100'), []],
    [() => interesService.obtenerPorAnio(2026), []],
  ])('mantiene 404 como ausencia válida en la consulta', async (operation, expected) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(404, 'No existen registros')));

    await expect(operation()).resolves.toEqual(expected);
  });
});
