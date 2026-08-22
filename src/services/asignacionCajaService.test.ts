import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from './apiClient';
import { asignacionCajaService } from './asignacionCajaService';

describe('AsignacionCajaService supervisor authorization', () => {
  beforeEach(() => {
    sessionStorage.setItem('auth_user', JSON.stringify({ codUsuario: 17 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('normaliza como números los códigos usados para editar', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValue({
      success: true,
      data: [{
        codAsignacionCaja: '9',
        codUsuario: '17',
        codCaja: '2',
        codTurno: '1',
        fecha: '2026-08-20',
        fechaStr: '2026-08-20',
        numCaja: 'CAJA 2',
        nombreUsuario: 'Cajero',
        turno: 'MAÑANA',
        estado: 'ACTIVO'
      }]
    });

    const [asignacion] = await asignacionCajaService.listar();

    expect(asignacion).toMatchObject({
      codAsignacionCaja: 9,
      codUsuario: 17,
      codCaja: 2,
      codTurno: 1
    });
  });

  it.each([
    {
      operation: 'insertar',
      method: 'POST',
      payload: {
        codUsuario: 17,
        codCaja: 2,
        codTurno: 1,
        fecha: '2026-08-20',
        usuario: '26'
      }
    },
    {
      operation: 'actualizar',
      method: 'PUT',
      payload: {
        codAsignacionCaja: 9,
        codUsuario: 17,
        codCaja: 2,
        codTurno: 1,
        usuario: '26'
      }
    },
    {
      operation: 'eliminar',
      method: 'PUT',
      payload: {
        codAsignacionCaja: 9,
        usuario: '26'
      }
    }
  ])('envía usuario en $operation', async ({ operation, method, payload }) => {
    const requestSpy = vi.spyOn(apiClient, 'request').mockResolvedValue({
      success: true,
      data: 'Operation Success!'
    });

    if (operation === 'insertar') {
      await asignacionCajaService.insertar(payload as Parameters<typeof asignacionCajaService.insertar>[0]);
    } else if (operation === 'actualizar') {
      await asignacionCajaService.actualizar(payload as Parameters<typeof asignacionCajaService.actualizar>[0]);
    } else {
      await asignacionCajaService.eliminar(payload as Parameters<typeof asignacionCajaService.eliminar>[0]);
    }

    expect(requestSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method,
        body: JSON.stringify(payload)
      })
    );
    expect(JSON.parse(String(requestSpy.mock.calls[0][1]?.body)).usuario).toBe('26');
  });

  it('rechaza una respuesta incompleta en lugar de fabricar una asignación', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValue({});

    await expect(asignacionCajaService.insertar({
      codUsuario: 17,
      codCaja: 2,
      codTurno: 1,
      fecha: '2026-08-20',
      usuario: '26'
    })).rejects.toThrow('respuesta incompleta');
  });
});
