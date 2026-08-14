// src/context/AuthContext.tsx
import { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { AuthUser, AuthCredentials, AuthResult } from '../models/Auth';
import useAuth from '../hooks/useAuth';
import { getAuthToken } from '../config/api.unified.config';

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  logout: () => void;
  renewToken: () => Promise<boolean>;
  checkSession: () => Promise<boolean>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

// Definir explícitamente el tipo de las props
interface AuthProviderProps {
  children: ReactNode;
}

// Componente proveedor de autenticación
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  const { authToken, renewToken } = auth;
  
  // Estado para indicar si hemos verificado la sesión
  
  // Para depuración
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthProvider state:', { 
        isAuthenticated: auth.isAuthenticated, 
        user: auth.user?.username || 'none',
        loading: auth.loading,
        tokenInMemory: !!auth.authToken,
        tokenInStorage: !!getAuthToken()
      });
    }
  }, [auth.isAuthenticated, auth.user, auth.loading, auth.authToken]);

  // Función para verificar la sesión (memoizada)
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      // Si no hay token, no hay sesión
      if (!authToken && !getAuthToken()) {
        return false;
      }
      
      // Verificar si el token ha expirado
      const tokenExpiry = sessionStorage.getItem('auth_token_expiry');
      if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
        // Intentar renovar el token
        const renewed = await renewToken();
        return renewed;
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      return false;
    }
  }, [authToken, renewToken]);

  // Función mejorada para login
  const login = async (credentials: AuthCredentials): Promise<AuthResult> => {
    try {
      return await auth.login(credentials);
    } catch (error) {
      console.error('Error en login desde AuthContext:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido en login' 
      };
    }
  };

  // Crear un objeto que cumpla exactamente con el tipo AuthContextType
  const authContextValue: AuthContextType = {
    user: auth.user || null,
    token: auth.authToken,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login,
    logout: auth.logout,
    renewToken: auth.renewToken,
    checkSession
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
