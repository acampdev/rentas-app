import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiClientError } from './apiClient';
import { sistemaService } from './sistemaService';

const errorResponse = (status: number, body: unknown) =>
  Response.json(body, { status });

describe('SistemaService error propagation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([401, 403])('does not convert HTTP %s into an empty roles list', async status => {
    const fetchMock = vi.fn().mockResolvedValue(
      errorResponse(status, { mensaje: 'Acceso no autorizado' })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(sistemaService.listarRoles()).rejects.toMatchObject<ApiClientError>({
      statusCode: status,
      message: 'Acceso no autorizado'
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not convert a configuration read error into null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      errorResponse(403, { detail: 'Configuración restringida' })
    ));

    await expect(sistemaService.obtenerConfiguracion()).rejects.toMatchObject<ApiClientError>({
      statusCode: 403,
      message: 'Configuración restringida'
    });
  });

  it('does not convert a failed update into false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      errorResponse(500, { data: 'No se pudo guardar la configuración' })
    ));

    await expect(sistemaService.actualizarConfiguracion({ nombreMunicipio: 'Municipalidad' }))
      .rejects.toMatchObject<ApiClientError>({
        statusCode: 500,
        message: 'No se pudo guardar la configuración'
      });
  });
});
