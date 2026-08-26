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
});
