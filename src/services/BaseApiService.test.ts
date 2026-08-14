import { afterEach, describe, expect, it, vi } from 'vitest';
import BaseApiService, { ApiError } from './BaseApiService';

class TestApiService extends BaseApiService<Record<string, unknown>> {
  constructor() {
    super('/api/test', { normalizeItem: item => item }, 'test');
  }

  request(method: string, retries = 3) {
    return this.makeRequest<Record<string, unknown>>('', { method }, retries);
  }
}

const jsonResponse = (status: number, body: unknown) => new Response(
  JSON.stringify(body),
  {
    status,
    headers: { 'Content-Type': 'application/json' }
  }
);

describe('BaseApiService retry policy', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
    'does not retry a %s when the server returns a transient error',
    async method => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(503, { message: 'Unavailable' }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(new TestApiService().request(method)).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  );

  it('retries a GET after a transient status', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(503, { message: 'Unavailable' }))
      .mockResolvedValueOnce(jsonResponse(200, { success: true }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(new TestApiService().request('GET', 1)).resolves.toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([400, 401, 409])(
    'does not retry a GET after HTTP %s',
    async statusCode => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(statusCode, { message: 'Request rejected' }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(new TestApiService().request('GET')).rejects.toMatchObject({ statusCode });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  );

  it('does not cache consecutive reads outside React Query', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(200, [{ version: 1 }]))
      .mockResolvedValueOnce(jsonResponse(200, [{ version: 2 }]));
    vi.stubGlobal('fetch', fetchMock);

    const service = new TestApiService();
    await expect(service.getAll()).resolves.toEqual([{ version: 1 }]);
    await expect(service.getAll()).resolves.toEqual([{ version: 2 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
