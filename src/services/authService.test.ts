import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from './authService';

const jwtWithExpiry = (expiresAtSeconds: number) => {
  const payload = btoa(JSON.stringify({ exp: expiresAtSeconds }));
  return `header.${payload}.signature`;
};

describe('AuthService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('inicia sesión, normaliza el usuario y guarda token y expiración', async () => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const token = jwtWithExpiry(expiry);
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      token,
      codUsuario: 17,
      username: 'cramos              ',
      codRol: 3,
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await authService.login({ username: 'cramos', password: 'secreto' });

    expect(result).toMatchObject({ success: true, token });
    expect(result.user).toMatchObject({ id: '17', username: 'cramos', codRol: 3 });
    expect(sessionStorage.getItem('auth_token')).toBe(token);
    expect(JSON.parse(sessionStorage.getItem('auth_user') ?? '{}')).toMatchObject({
      id: '17',
      username: 'cramos',
    });
    expect(sessionStorage.getItem('auth_token_expiry')).toBeTruthy();

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.method).toBe('POST');
    expect(new Headers(options.headers).has('Authorization')).toBe(false);
  });

  it('no crea sesión cuando el API rechaza las credenciales', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      Response.json({ message: 'Unauthorized' }, { status: 401 })
    ));

    await expect(authService.login({ username: 'incorrecto', password: 'mala' })).resolves.toEqual({
      success: false,
      message: 'Usuario o contraseña incorrectos',
    });
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(sessionStorage.getItem('auth_user')).toBeNull();
  });

  it('renueva el token conservando el usuario autenticado', async () => {
    sessionStorage.setItem('auth_token', 'token-anterior');
    sessionStorage.setItem('auth_user', JSON.stringify({
      id: '17', username: 'cramos', nombreCompleto: 'Carlos Ramos', roles: ['CAJERO'],
    }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      token: 'token-renovado',
      expiresIn: 1800,
    })));

    await expect(authService.refreshToken()).resolves.toBe(true);
    expect(sessionStorage.getItem('auth_token')).toBe('token-renovado');
    expect(JSON.parse(sessionStorage.getItem('auth_user') ?? '{}').id).toBe('17');
  });

  it('informa que no renovó cuando el servidor rechaza la petición', async () => {
    sessionStorage.setItem('auth_token', 'token-anterior');
    sessionStorage.setItem('auth_user', JSON.stringify({
      id: '17', username: 'cramos', nombreCompleto: 'Carlos Ramos', roles: ['CAJERO'],
    }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      Response.json({ message: 'Sesión vencida' }, { status: 401 })
    ));

    await expect(authService.refreshToken()).resolves.toBe(false);
    expect(sessionStorage.getItem('auth_token')).toBe('token-anterior');
  });

  it('cierra la sesión local aunque el backend no responda correctamente', async () => {
    sessionStorage.setItem('auth_token', 'token-activo');
    sessionStorage.setItem('auth_user', JSON.stringify({ id: '17' }));
    sessionStorage.setItem('auth_token_expiry', new Date(Date.now() + 60_000).toISOString());
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      Response.json({ message: 'Servidor no disponible' }, { status: 500 })
    ));

    await authService.logout();

    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(sessionStorage.getItem('auth_user')).toBeNull();
    expect(sessionStorage.getItem('auth_token_expiry')).toBeNull();
    expect(sessionStorage.getItem('explicit_logout')).toBe('true');
  });
});
