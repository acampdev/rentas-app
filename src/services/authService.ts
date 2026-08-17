import { NotificationService } from '../components/utils/Notification';
import { buildApiUrl, getApiHeaders, getAuthToken, getStoredAuthUser } from '../config/api.unified.config';
import { AuthCredentials, AuthResponse, RegisterData, RegisterResponse, AuthUserStored } from '../models/Auth';
import { ROLE_BY_CODE } from '../config/accessControl';
import apiClient, { ApiClientError } from './apiClient';

// Configuración de autenticación
const AUTH_CONFIG = {
  TOKEN_RENEWAL_THRESHOLD_MINUTES: 30,
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register'
  }
} as const;

type AuthApiPayload = Record<string, unknown> & {
  token?: string;
  access_token?: string;
  accessToken?: string;
  expiresAt?: string | number;
  expires_at?: string | number;
  expiresIn?: string | number;
  expires_in?: string | number;
  codRol?: string | number;
  username?: string;
  roles?: unknown;
  rol?: unknown;
  codUsuario?: string | number;
  userId?: string | number;
  nombreCompleto?: string;
  user?: {
    id?: string | number;
    roles?: unknown;
    rol?: unknown;
    nombreCompleto?: string;
  };
};

const decodeJwtExpiry = (token: string): Date | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized)) as { exp?: number };
    return decoded.exp ? new Date(decoded.exp * 1000) : null;
  } catch {
    return null;
  }
};

const resolveTokenExpiry = (token: string, data: AuthApiPayload): Date | null => {
  const absoluteExpiry = data.expiresAt ?? data.expires_at;
  if (absoluteExpiry !== undefined) {
    const normalizedExpiry =
      typeof absoluteExpiry === 'number' && absoluteExpiry < 1_000_000_000_000 ? absoluteExpiry * 1000 : absoluteExpiry;
    const parsed = new Date(normalizedExpiry);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const expiresIn = Number(data.expiresIn ?? data.expires_in);
  if (Number.isFinite(expiresIn) && expiresIn > 0) {
    return new Date(Date.now() + expiresIn * 1000);
  }

  return decodeJwtExpiry(token);
};

const normalizeRoles = (value: unknown): string[] => {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return values
    .map((role) => {
      if (typeof role === 'string') return role;
      if (role && typeof role === 'object') {
        const roleObject = role as Record<string, unknown>;
        const name = roleObject.nombre ?? roleObject.codigo ?? roleObject.rol;
        return typeof name === 'string' ? name : '';
      }
      return '';
    })
    .map((role) => role.trim().toUpperCase())
    .filter(Boolean);
};

export class AuthService {
  private static instance: AuthService;

  private constructor() {
    this.migrateLegacyStorage();
    console.log('🔧 [AuthService] Inicializado');
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private migrateLegacyStorage(): void {
    if (typeof window === 'undefined') return;

    for (const key of ['auth_token', 'auth_token_expiry', 'auth_user']) {
      const legacyValue = localStorage.getItem(key);
      if (legacyValue && !sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, legacyValue);
      }
      localStorage.removeItem(key);
    }
  }

  private saveTokenData(token: string, user: AuthUserStored, expiry: Date | null): void {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('auth_user', JSON.stringify(user));

    if (expiry) {
      sessionStorage.setItem('auth_token_expiry', expiry.toISOString());
    } else {
      sessionStorage.removeItem('auth_token_expiry');
    }

    console.log(
      expiry
        ? `✅ [AuthService] Sesión iniciada. Expira: ${expiry.toLocaleString()}`
        : '✅ [AuthService] Sesión iniciada; el servidor no informó expiración.'
    );
  }

  isTokenExpired(): boolean {
    if (!getAuthToken()) return true;
    const expiryStr = sessionStorage.getItem('auth_token_expiry');
    if (!expiryStr) return false;
    return new Date(expiryStr) <= new Date();
  }

  needsTokenRenewal(): boolean {
    const expiryStr = sessionStorage.getItem('auth_token_expiry');
    if (!expiryStr) return false;
    const expiry = new Date(expiryStr);
    const threshold = new Date(Date.now() + AUTH_CONFIG.TOKEN_RENEWAL_THRESHOLD_MINUTES * 60 * 1000);
    return expiry <= threshold;
  }

  getTokenRemainingTime(): number {
    const expiryStr = sessionStorage.getItem('auth_token_expiry');
    if (!expiryStr) return 0;
    const diffMs = new Date(expiryStr).getTime() - Date.now();
    return Math.max(0, Math.floor(diffMs / 60000));
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await apiClient.fetch(buildApiUrl(AUTH_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        auth: false,
        credentials: 'include',
        headers: getApiHeaders(false),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 409) throw new Error('El usuario ya existe');
        throw new Error(errorText || `Error ${response.status}`);
      }

      const responseData = await response.json();
      const userData = responseData.data || responseData.user || responseData;
      NotificationService.success(`Usuario ${data.username} registrado correctamente`);

      return {
        success: true,
        user: {
          id: userData.id || userData.codUsuario || '0',
          username: userData.username || data.username,
          nombrePersona: userData.nombrePersona || data.nombrePersona,
          documento: userData.documento || data.documento,
          role: userData.role || data.role
        }
      };
    } catch (error) {
      const message = error instanceof ApiClientError && error.statusCode === 409
        ? 'El usuario ya existe'
        : error instanceof Error ? error.message : 'Error al registrar usuario';
      NotificationService.error(message);
      return { success: false, message };
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.fetch(buildApiUrl(AUTH_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        auth: false,
        credentials: 'include',
        headers: getApiHeaders(false),
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Usuario o contraseña incorrectos');
        throw new Error(`Error ${response.status}`);
      }

      const data = (await response.json()) as AuthApiPayload;
      const token = data.token || data.access_token || data.accessToken;

      if (!token) throw new Error('No se recibió token del servidor');

      const codRol = Number(data.codRol);
      const mappedRole = Number.isInteger(codRol) ? ROLE_BY_CODE[codRol] : undefined;
      let userRoles = mappedRole
        ? [mappedRole]
        : normalizeRoles(data.roles ?? data.user?.roles ?? data.rol ?? data.user?.rol);

      if (userRoles.length === 0) userRoles = ['USER'];

      const userId = data.codUsuario ?? data.userId ?? data.user?.id;
      const numericUserId = Number(userId);

      if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
        throw new Error('El servidor no devolvió un código de usuario válido');
      }

      const responseUsername = String(data.username ?? '').trim();
      const username = responseUsername || credentials.username.trim();

      const user: AuthUserStored = {
        id: String(numericUserId),
        username,
        nombreCompleto: data.nombreCompleto?.trim() || data.user?.nombreCompleto?.trim() || username,
        roles: userRoles,
        codRol: Number.isInteger(codRol) ? codRol : undefined
      };

      this.saveTokenData(token, user, resolveTokenExpiry(token, data));
      sessionStorage.removeItem('explicit_logout');
      NotificationService.success(`Bienvenido ${user.nombreCompleto}`);

      return { success: true, token, user };
    } catch (error) {
      const message = error instanceof ApiClientError && error.statusCode === 401
        ? 'Usuario o contraseña incorrectos'
        : error instanceof Error ? error.message : 'Error al iniciar sesión';
      NotificationService.error(message);
      return { success: false, message };
    }
  }

  async refreshToken(): Promise<boolean> {
    const currentToken = getAuthToken();
    const storedUser = getStoredAuthUser();
    if (!currentToken || !storedUser) return false;

    try {
      const response = await apiClient.fetch(buildApiUrl(AUTH_CONFIG.ENDPOINTS.REFRESH), {
        method: 'POST',
        credentials: 'include',
        headers: getApiHeaders(true)
      });

      if (!response.ok) return false;

      const data = (await response.json()) as AuthApiPayload;
      const refreshedToken = data.token || data.access_token || data.accessToken;
      if (!refreshedToken) return false;

      this.saveTokenData(
        refreshedToken,
        JSON.parse(storedUser) as AuthUserStored,
        resolveTokenExpiry(refreshedToken, data)
      );
      return true;
    } catch (error) {
      console.error('[AuthService] No se pudo renovar la sesión:', error);
      return false;
    }
  }

  private clearLocalSession(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token_expiry');
    sessionStorage.removeItem('auth_user');
    sessionStorage.setItem('explicit_logout', 'true');

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_expiry');
    localStorage.removeItem('auth_user');
  }

  async logout(): Promise<void> {
    const logoutRequest = apiClient.fetch(buildApiUrl(AUTH_CONFIG.ENDPOINTS.LOGOUT), {
      method: 'POST',
      credentials: 'include',
      headers: getApiHeaders(true),
      keepalive: true
    });

    // La sesión del cliente se invalida inmediatamente, incluso si el backend
    // no está disponible o el token ya expiró.
    this.clearLocalSession();

    try {
      const response = await logoutRequest;

      if (!response.ok && response.status !== 401 && response.status !== 403) {
        const detail = await response.text();
        throw new Error(detail || `Error ${response.status} al cerrar la sesión`);
      }

      NotificationService.info('Sesión cerrada correctamente');
    } catch (error) {
      console.warn('[AuthService] No se pudo confirmar el cierre de sesión en el servidor:', error);
      NotificationService.warning('La sesión local se cerró, pero el servidor no confirmó la operación');
    }
  }
}

export const authService = AuthService.getInstance();
export default authService;
