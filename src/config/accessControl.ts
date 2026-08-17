import type { UserRole } from './constants';

export const ADMIN_ROLES = ['ADMINISTRADOR'] as const satisfies readonly UserRole[];
export const CASH_OPERATION_ROLES = ['CAJERO', 'SUPERVISOR'] as const satisfies readonly UserRole[];
export const CASH_MANAGEMENT_ROLES = ['SUPERVISOR'] as const satisfies readonly UserRole[];
export const CASH_REPORT_ROLES = ['CAJERO', 'SUPERVISOR', 'GERENTE'] as const satisfies readonly UserRole[];
export const AUDIT_ROLES = ['AUDITOR', 'GERENTE'] as const satisfies readonly UserRole[];
export const AUTHENTICATED_ROLES = ['USER', 'CAJERO', 'SUPERVISOR', 'GERENTE', 'AUDITOR'] as const satisfies readonly UserRole[];
export const TAX_READ_ROLES = ['USER', 'CAJERO', 'SUPERVISOR', 'GERENTE', 'AUDITOR'] as const satisfies readonly UserRole[];
export const TAX_OPERATION_ROLES = ['USER', 'SUPERVISOR', 'GERENTE'] as const satisfies readonly UserRole[];
export const TAX_MANAGEMENT_ROLES = ['SUPERVISOR', 'GERENTE'] as const satisfies readonly UserRole[];
export const COACTIVE_COLLECTION_ROLES = ['SUPERVISOR', 'GERENTE'] as const satisfies readonly UserRole[];

export const ROLE_BY_CODE: Readonly<Record<number, UserRole>> = {
  1: 'ADMINISTRADOR',
  2: 'USER',
  3: 'CAJERO',
  4: 'SUPERVISOR'
};

type AllowedRoles = readonly UserRole[];

interface RouteAccessRule {
  pattern: string;
  allowedRoles: AllowedRoles;
}

const rules = (allowedRoles: AllowedRoles, patterns: readonly string[]): RouteAccessRule[] =>
  patterns.map(pattern => ({ pattern, allowedRoles }));

export const ROUTE_ACCESS_RULES: readonly RouteAccessRule[] = [
  ...rules(AUTHENTICATED_ROLES, ['/dashboard', '/perfil', '/buscar']),
  ...rules(TAX_OPERATION_ROLES, [
    '/contribuyente/nuevo',
    '/contribuyente/editar/:id',
    '/contribuyente/deduccion-beneficio',
    '/predio/nuevo',
    '/predio/editar/:anio/:codPredio',
    '/predio/asignacion/nuevo',
    '/predio/pisos/registro',
    '/predio/transferencia/alcabala',
    '/cuenta-corriente/cargo/nuevo',
    '/cuenta-corriente/abono/nuevo',
    '/fraccionamiento/solicitud',
    '/fraccionamiento/nuevo',
    '/persona/nueva'
  ]),
  ...rules(TAX_READ_ROLES, [
    '/contribuyente/consulta',
    '/predio/consulta',
    '/predio/asignacion/consulta',
    '/predio/pisos/consulta',
    '/predio/puhr/consulta-pu-hr',
    '/predio/transferencia/reporte-alcabala',
    '/cuenta-corriente/consulta',
    '/reportes/contribuyentes',
    '/reportes/predios',
    '/reportes/cuentas',
    '/reportes/recaudacion',
    '/fraccionamiento/consulta',
    '/fraccionamiento/reportes',
    '/persona/consulta'
  ]),
  ...rules(CASH_OPERATION_ROLES, [
    '/caja/apertura',
    '/caja/cierre',
    '/caja/cobro',
    '/caja/movimiento',
    '/caja/consultas'
  ]),
  ...rules(CASH_MANAGEMENT_ROLES, ['/caja/asignacion']),
  ...rules(CASH_REPORT_ROLES, ['/caja/reportes']),
  ...rules(TAX_MANAGEMENT_ROLES, [
    '/fraccionamiento/aprobacion',
    '/fraccionamiento/cronograma',
    '/fraccionamiento/cronograma/:id',
    '/mantenedores/sectores',
    '/mantenedores/barrios',
    '/mantenedores/direcciones',
    '/mantenedores/calles',
    '/mantenedores/aranceles',
    '/mantenedores/valores-unitarios',
    '/mantenedores/resolucion-interes',
    '/mantenedores/uit',
    '/mantenedores/ipm',
    '/mantenedores/alcabala',
    '/mantenedores/depreciacion',
    '/mantenedores/arbitrios',
    '/mantenedores/escalas/registro-tim',
    '/mantenedores/escalas/vencimiento',
    '/mantenedores/escalas/interes'
  ]),
  ...rules(COACTIVE_COLLECTION_ROLES, [
    '/coactiva',
    '/coactiva/expedientes',
    '/coactiva/resoluciones',
    '/coactiva/notificaciones'
  ]),
  ...rules(AUDIT_ROLES, ['/sistema/auditoria']),
  ...rules(ADMIN_ROLES, [
    '/mantenedores/caja/cajas',
    '/sistema/usuarios',
    '/sistema/roles',
    '/sistema/permisos',
    '/sistema/configuracion',
    '/sistema/respaldo',
    '/usuarios/crear-cuenta',
    '/usuarios/consulta',
    '/usuarios/recuperar-password',
    '/usuarios/otras-opciones',
    '/migracion',
    '/migracion/importar',
    '/migracion/exportar',
    '/migracion/historial',
    '/configuracion'
  ])
];

const normalizePath = (path: string): string => {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
};

const matchesRoute = (pattern: string, path: string): boolean => {
  const patternSegments = normalizePath(pattern).split('/').filter(Boolean);
  const pathSegments = normalizePath(path).split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) return false;

  return patternSegments.every((segment, index) =>
    segment.startsWith(':') || segment === pathSegments[index]
  );
};

export const normalizeRole = (role: string): string => {
  const normalized = role
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  return normalized === 'ADMIN' ? 'ADMINISTRADOR' : normalized;
};

interface UserWithRoles {
  roles?: unknown;
  codRol?: unknown;
}

export const getUserRoles = (user?: UserWithRoles | null): string[] => {
  if (!user) return [];

  const rawRoles = Array.isArray(user.roles)
    ? user.roles
    : user.roles !== null && user.roles !== undefined
      ? [user.roles]
      : [];

  const normalizedRoles = rawRoles.flatMap(role => {
    if (typeof role === 'string') return [normalizeRole(role)];
    if (!role || typeof role !== 'object') return [];

    const roleObject = role as Record<string, unknown>;
    const name = roleObject.nombre ?? roleObject.codigo ?? roleObject.rol;
    return typeof name === 'string' ? [normalizeRole(name)] : [];
  });

  const roleFromCode = ROLE_BY_CODE[Number(user.codRol)];
  if (roleFromCode) normalizedRoles.push(normalizeRole(roleFromCode));

  return [...new Set(normalizedRoles.filter(Boolean))];
};

export const getAllowedRolesForPath = (path: string): AllowedRoles | undefined =>
  ROUTE_ACCESS_RULES.find(rule => matchesRoute(rule.pattern, path))?.allowedRoles;

export const hasAllowedRole = (
  userRoles: readonly string[],
  allowedRoles?: readonly string[]
): boolean => {
  if (!allowedRoles?.length) return true;

  const normalizedUserRoles = new Set(userRoles.map(normalizeRole));
  if (normalizedUserRoles.has('ADMINISTRADOR')) return true;

  return allowedRoles.some(role => normalizedUserRoles.has(normalizeRole(role)));
};

export const canAccessPath = (path: string, userRoles: readonly string[]): boolean =>
  Boolean(getAllowedRolesForPath(path)) && hasAllowedRole(userRoles, getAllowedRolesForPath(path));
