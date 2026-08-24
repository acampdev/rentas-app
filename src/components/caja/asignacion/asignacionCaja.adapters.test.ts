import { describe, expect, it } from 'vitest';
import type { AsignacionCaja } from '../../../models/Caja';
import { parseAssignmentDate, resolveAssignmentCatalogIds } from './asignacionCaja.adapters';

describe('asignacionCaja adapters', () => {
  it('resolves omitted API codes from their catalog labels', () => {
    const asignacion = {
      codUsuario: null, codCaja: null, codTurno: null,
      nombreUsuario: 'alejito   ', numCaja: 'CAJA19', turno: 'Tarde',
    } as AsignacionCaja;
    expect(resolveAssignmentCatalogIds({
      asignacion,
      usuarios: [{ codUsuario: 4, username: 'alejito', nombrePersona: '', rol: 'CAJERO', estado: 'ACTIVO' }],
      cajas: [{ codCaja: 19, numcaja: 'CAJA19', descripcion: '', estado: 'ACTIVO', usuario: null }],
      turnos: [{ codTurno: 2, nombreTurno: 'Tarde', horario: '' }],
    })).toEqual({ codCajero: 4, codCaja: 19, codTurno: 2 });
  });

  it('parses API dates without timezone displacement', () => {
    const date = parseAssignmentDate('2026-08-20');
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 7, 20]);
  });
});
