import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from './apiClient';
import { mantenedorCajaService } from './mantenedorCajaService';

describe('MantenedorCajaService mutation responses', () => {
  beforeEach(() => {
    sessionStorage.setItem('auth_user', JSON.stringify({ codUsuario: 17 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('acepta una confirmación válida y deja la recarga al consumidor', async () => {
    const requestSpy = vi.spyOn(apiClient, 'request').mockResolvedValue({
      success: true,
      data: 'Operation Success!'
    });

    await expect(mantenedorCajaService.insertar({ descripcion: 'Caja principal' }))
      .resolves.toBeUndefined();

    expect(requestSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('rechaza una respuesta incompleta en lugar de fabricar la caja 999', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValue({});

    await expect(mantenedorCajaService.insertar({ descripcion: 'Caja principal' }))
      .rejects.toThrow('respuesta incompleta');
  });

  it('propaga el mensaje de una operación rechazada por el API', async () => {
    vi.spyOn(apiClient, 'request').mockRejectedValue(
      new Error('No se pudo registrar la caja.')
    );

    await expect(mantenedorCajaService.insertar({ descripcion: 'Caja principal' }))
      .rejects.toThrow('No se pudo registrar la caja.');
  });
});
