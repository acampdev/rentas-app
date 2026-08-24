export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

export interface AuthSessionExpiredDetail {
  message: string;
  statusCode: 401;
}

interface ClearStoredAuthSessionOptions {
  explicitLogout?: boolean;
}

const AUTH_STORAGE_KEYS = ['auth_token', 'auth_token_expiry', 'auth_user'] as const;

export const clearStoredAuthSession = (
  options: ClearStoredAuthSessionOptions = {}
): void => {
  if (typeof window === 'undefined') return;

  AUTH_STORAGE_KEYS.forEach((key) => {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
  });

  if (options.explicitLogout) {
    window.sessionStorage.setItem('explicit_logout', 'true');
  } else {
    window.sessionStorage.removeItem('explicit_logout');
  }
};

export const invalidateSessionFromUnauthorized = (message: string): boolean => {
  if (typeof window === 'undefined') return false;

  const hadAuthenticatedSession = Boolean(
    window.sessionStorage.getItem('auth_token') ||
    window.sessionStorage.getItem('auth_user') ||
    window.localStorage.getItem('auth_token') ||
    window.localStorage.getItem('auth_user')
  );

  clearStoredAuthSession();

  // La primera respuesta 401 elimina la sesión. Las respuestas concurrentes
  // posteriores ya no encuentran credenciales y no duplican el evento.
  if (!hadAuthenticatedSession) return false;

  window.dispatchEvent(new CustomEvent<AuthSessionExpiredDetail>(
    AUTH_SESSION_EXPIRED_EVENT,
    {
      detail: {
        message,
        statusCode: 401
      }
    }
  ));

  return true;
};
