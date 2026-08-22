import { afterEach, describe, expect, it, vi } from 'vitest';
import apiClient, { ApiClientError } from './apiClient';

const stubAuthenticatedWindow = () => {
  vi.stubGlobal('window', {
    sessionStorage: {
      getItem: vi.fn((key: string) => key === 'auth_token' ? 'token-central' : null)
    }
  });
};

describe('ApiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('adds Bearer, cookies and serializes JSON bodies', async () => {
    stubAuthenticatedWindow();
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal('fetch', fetchMock);

    await apiClient.request('/api/prueba', {
      method: 'POST',
      body: { nombre: 'Registro' }
    });

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = new Headers(options.headers);
    expect(headers.get('Authorization')).toBe('Bearer token-central');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(options.credentials).toBe('include');
    expect(options.body).toBe(JSON.stringify({ nombre: 'Registro' }));
  });

  it('keeps Bearer but lets the browser set the FormData boundary', async () => {
    stubAuthenticatedWindow();
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal('fetch', fetchMock);
    const formData = new FormData();
    formData.append('archivo', new Blob(['contenido']), 'prueba.txt');

    await apiClient.fetch('/api/upload', { method: 'POST', body: formData });

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = new Headers(options.headers);
    expect(headers.get('Authorization')).toBe('Bearer token-central');
    expect(headers.has('Content-Type')).toBe(false);
    expect(options.body).toBe(formData);
  });

  it.each([
    [{ mensaje: 'Mensaje del API' }, 'Mensaje del API'],
    [{ data: 'Detalle dentro de data' }, 'Detalle dentro de data'],
    [{ detail: 'Detalle estándar' }, 'Detalle estándar'],
    [{ errors: { campo: ['Campo inválido'] } }, 'Campo inválido'],
    [{ errors: 'Validación general' }, 'Validación general'],
    [{ errors: ['Primer error', 'Segundo error'] }, 'Primer error'],
    [{ errors: { documento: 'Documento requerido' } }, 'Documento requerido']
  ])('normalizes API error payloads', async (payload, expectedMessage) => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(payload, { status: 400 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.request('/api/prueba')).rejects.toMatchObject<ApiClientError>({
      statusCode: 400,
      message: expectedMessage
    });
  });

  it('preserves normalized validation details in ApiClientError', async () => {
    const payload = {
      mensaje: 'Solicitud inválida',
      errors: {
        documento: 'Documento requerido',
        persona: ['Persona inválida', 'Persona inactiva']
      }
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(payload, { status: 422 })));

    try {
      await apiClient.request('/api/prueba');
      throw new Error('La petición debía fallar');
    } catch (error) {
      expect(error).toMatchObject<ApiClientError>({
        statusCode: 422,
        message: 'Solicitud inválida',
        errors: {
          documento: ['Documento requerido'],
          persona: ['Persona inválida', 'Persona inactiva']
        }
      });
    }
  });

  it('rejects a business error returned with HTTP 200', async () => {
    const payload = {
      success: false,
      mensaje: 'La operación fue rechazada',
      data: 'Detalle de la validación'
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(payload)));

    await expect(apiClient.request('/api/prueba')).rejects.toMatchObject<ApiClientError>({
      statusCode: 200,
      message: 'La operación fue rechazada',
      data: payload
    });
  });

  it('uses the real data detail when the API only returns a generic failure message', async () => {
    const payload = {
      success: false,
      message: 'Operation Failed!',
      data: 'No existe deuda pendiente para el periodo indicado.'
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(payload)));

    await expect(apiClient.request('/api/prueba')).rejects.toMatchObject<ApiClientError>({
      statusCode: 200,
      message: 'No existe deuda pendiente para el periodo indicado.',
      data: payload
    });
  });
});
