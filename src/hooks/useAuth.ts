import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { getAuthToken, getStoredAuthUser } from '../config/api.unified.config';
import { RegisterData, RegisterResponse, AuthUserStored } from '../models/Auth';
import { AuthCredentials, AuthUser, AuthResult } from '../models/Auth';

/**
 * Hook para gestionar la autenticación del usuario
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const checkAuth = useCallback(() => {
    const storedUser = getStoredAuthUser();
    const storedToken = getAuthToken();

    if (storedUser && storedToken && !authService.isTokenExpired()) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUserStored;
        const authUser: AuthUser = {
          id: parsedUser.id,
          username: parsedUser.username,
          nombreCompleto: parsedUser.nombreCompleto,
          roles: parsedUser.roles,
          codRol: parsedUser.codRol,
          token: storedToken
        };
        setUser(authUser);
        setAuthToken(storedToken);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error restoring session:', e);
        void authService.logout();
      }
    } else if (authService.isTokenExpired()) {
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: AuthCredentials): Promise<AuthResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.login(credentials);

      if (result.success && result.user && result.token) {
        const authUser: AuthUser = {
          id: result.user.id,
          username: result.user.username,
          nombreCompleto: result.user.nombreCompleto || result.user.username,
          roles: result.user.roles || ['USER'],
          codRol: result.user.codRol,
          token: result.token
        };
        setUser(authUser);
        setAuthToken(result.token);
        setIsAuthenticated(true);
        return { success: true, user: authUser, token: result.token };
      }
      const msg = result.message || 'Error al iniciar sesión';
      setError(msg);
      return { success: false, error: msg };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const logoutRequest = authService.logout();
    setUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);
    setError(null);
    await logoutRequest;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      setLoading(true);
      setError(null);
      return await authService.register(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al registrar';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const renewToken = useCallback(async () => {
    const renewed = await authService.refreshToken();
    if (renewed) {
      setAuthToken(getAuthToken());
    }
    return renewed;
  }, []);

  return {
    user,
    authToken,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    renewToken,
    getTokenRemainingTime: () => `${authService.getTokenRemainingTime()}m`,
    isTokenExpired: authService.isTokenExpired.bind(authService)
  };
};

export default useAuth;
