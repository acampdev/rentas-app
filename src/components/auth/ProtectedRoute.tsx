import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: readonly string[];
}

const normalizeRole = (role: string): string => {
  const normalized = role
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  return normalized === 'ADMIN' ? 'ADMINISTRADOR' : normalized;
};

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * Redirige al login si no hay sesión y muestra 403 si falta el rol requerido.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuthContext();
  const location = useLocation();
  
  // Mientras se verifica la autenticación, no mostramos nada para evitar saltos visuales
  if (loading) {
    return null;
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length) {
    const storedRoles: unknown = user?.roles;
    const roleList = Array.isArray(storedRoles)
      ? storedRoles.filter((role): role is string => typeof role === 'string')
      : typeof storedRoles === 'string'
        ? [storedRoles]
        : [];
    const userRoles = new Set(roleList.map(normalizeRole));
    const requiredRoles = allowedRoles.map(normalizeRole);
    const isAdministrator = userRoles.has('ADMINISTRADOR');
    const hasRequiredRole = requiredRoles.some(role => userRoles.has(role));

    if (!isAdministrator && !hasRequiredRole) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
          <section className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-600">Error 403</p>
            <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Acceso no autorizado</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Tu usuario no tiene uno de los roles requeridos para acceder a esta sección.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Volver al inicio
            </Link>
          </section>
        </main>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
