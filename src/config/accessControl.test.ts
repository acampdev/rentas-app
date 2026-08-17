import { describe, expect, it } from 'vitest';
import {
  canAccessPath,
  getAllowedRolesForPath,
  getUserRoles,
  hasAllowedRole
} from './accessControl';

describe('route access matrix', () => {
  it('uses the role code when the API user has no roles array', () => {
    expect(getUserRoles({ codRol: 3 })).toEqual(['CAJERO']);
  });

  it('normalizes the inherited ADMIN alias', () => {
    expect(hasAllowedRole(['admin'], ['ADMINISTRADOR'])).toBe(true);
  });

  it('matches dynamic protected routes', () => {
    expect(getAllowedRolesForPath('/predio/editar/2026/202630')).toContain('SUPERVISOR');
    expect(canAccessPath('/predio/editar/2026/202630', ['CAJERO'])).toBe(false);
  });

  it.each([
    ['/mantenedores/ipm', ['SUPERVISOR'], true],
    ['/mantenedores/ipm', ['USER'], false],
    ['/caja/apertura', ['CAJERO'], true],
    ['/caja/asignacion', ['CAJERO'], false],
    ['/sistema/auditoria', ['AUDITOR'], true],
    ['/sistema/respaldo', ['AUDITOR'], false],
    ['/usuarios/consulta', ['ADMINISTRADOR'], true]
  ] as const)('evaluates %s for %s', (path, roles, expected) => {
    expect(canAccessPath(path, roles)).toBe(expected);
  });
});
