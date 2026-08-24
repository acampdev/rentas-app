import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AUTH_SESSION_EXPIRED_EVENT } from '../services/authSession';
import useAuth from './useAuth';

const authServiceMock = vi.hoisted(() => ({
  isTokenExpired: vi.fn(() => false),
  login: vi.fn(),
  logout: vi.fn(async () => undefined),
  refreshToken: vi.fn(async () => false),
  register: vi.fn(),
  getTokenRemainingTime: vi.fn(() => 30)
}));

vi.mock('../services/authService', () => ({
  authService: authServiceMock,
  default: authServiceMock
}));

vi.mock('../components/utils/Notification', () => ({
  NotificationService: {
    error: vi.fn()
  }
}));

describe('useAuth - invalidación global de sesión', () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('deja de mostrar al usuario como autenticado al recibir el evento de 401', async () => {
    sessionStorage.setItem('auth_token', 'token-vigente');
    sessionStorage.setItem('auth_user', JSON.stringify({
      id: '17',
      username: 'cajero',
      nombreCompleto: 'Cajero de prueba',
      roles: ['CAJERO']
    }));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    act(() => {
      window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, {
        detail: {
          message: 'Token expirado',
          statusCode: 401
        }
      }));
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.authToken).toBeNull();
    expect(result.current.error).toBe('Token expirado');
  });
});
