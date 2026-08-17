import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usuarioService } from './usuarioService';

describe('UsuarioService API contracts', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('auth_token', 'token-cajero');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it('verifies supervisor/cashier credentials using POST', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      success: true,
      message: 'Operation Success!',
      data: 'Usuario correcto.'
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(usuarioService.verificarSupervisorCajero('davila', '13579')).resolves.toBe(true);

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'http://26.161.18.122:8085/api/usuario/verificarSupervisorCajero?username=davila&password=13579'
    );
    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.method).toBe('POST');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer token-cajero');
  });

  it('preserves the API message when supervisor credentials are rejected', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      success: false,
      message: 'Operation Failed!',
      data: 'Usuario incorrecto.'
    })));

    await expect(usuarioService.verificarSupervisorCajero('davila', 'incorrecta')).rejects.toMatchObject({
      statusCode: 200,
      message: 'Operation Failed!'
    });
  });

  it('does not hide an authorization failure as invalid credentials', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(
      { message: 'Acceso denegado' },
      { status: 403 }
    )));

    await expect(usuarioService.verificarSupervisorCajero('davila', '13579')).rejects.toMatchObject({
      statusCode: 403,
      message: 'Acceso denegado'
    });
  });
});
