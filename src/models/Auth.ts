/**
 * Modelo para las credenciales de autenticación
 */
export interface AuthCredentials {
  username: string;
  password: string;
}

/**
 * Respuesta de la API de autenticación
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    nombreCompleto?: string;
    roles?: string[];
    codRol?: number;
  };
  message?: string;
}

/**
 * Datos para el registro de usuario
 */
export interface RegisterData {
  username: string;
  nombrePersona: string;
  documento: string;
  codEstado: string;
  password: string;
  role: string;
}

/**
 * Respuesta de la API de registro
 */
export interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    nombrePersona: string;
    documento: string;
    role: string;
  };
  message?: string;
}

/**
 * Modelo para representar el usuario autenticado en la aplicación
 */
export interface AuthUser {
  id: string;
  username: string;
  nombreCompleto: string;
  roles: string[];
  codRol?: number;
  token?: string;
}

/**
 * Interfaz para los datos de usuario guardados en storage
 */
export interface AuthUserStored {
  id: string;
  username: string;
  nombreCompleto: string;
  roles: string[];
  codRol?: number;
}

/**
 * Resultado de un intento de autenticación
 */
export interface AuthResult {
  success: boolean;
  user?: AuthUser | null;
  error?: string;
  token?: string;
}

/**
 * Estado de autenticación de la aplicación
 */
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
