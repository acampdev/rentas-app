import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { aperturaCajaService } from './aperturaCajaService';

const activeOpening = (codAperturaCaja = 22) => ({
  success: true,
  data: [{
    codAperturaCaja,
    codAsignacionCaja: 8,
    codUsuario: 17,
    montoApertura: 250,
    montoCierre: 300,
    estado: 'ABIERTA',
    caja: 'CAJA 04'
  }]
});

describe('AperturaCajaService - integridad de la apertura operativa', () => {
  beforeEach(() => {
    sessionStorage.setItem('auth_token', 'token-caja');
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('confirma con el servidor que la apertura pertenece al usuario y sigue activa', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(activeOpening()));
    vi.stubGlobal('fetch', fetchMock);

    await expect(aperturaCajaService.verificarAperturaActiva(17, 22)).resolves.toMatchObject({
      codAperturaCaja: 22,
      montoApertura: 250,
      estado: 'ABIERTA'
    });

    expect(String(fetchMock.mock.calls[0][0])).toContain('/api/aperturaCaja?codUsuario=17');
  });

  it('rechaza un código del navegador que no coincide con la apertura activa', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(activeOpening(22)));
    vi.stubGlobal('fetch', fetchMock);

    await expect(aperturaCajaService.verificarAperturaActiva(17, 999)).rejects.toThrow(
      'La apertura seleccionada ya no coincide con la apertura activa del usuario'
    );
  });

  it('no intenta cerrar cuando la apertura enviada no coincide con el servidor', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(activeOpening(22)));
    vi.stubGlobal('fetch', fetchMock);

    await expect(aperturaCajaService.cierre({
      codAperturaCaja: 999,
      codAsignacionCaja: null,
      observacion: 'Cerrar caja',
      montoCierre: 300,
      codUsuario: 17
    })).rejects.toThrow('La apertura seleccionada ya no coincide');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls[0][1] as RequestInit).method).toBe('GET');
  });

  it('conserva un monto cero real y solo envía el cierre después de verificar', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json(activeOpening(22)))
      .mockResolvedValueOnce(Response.json({
        success: true,
        data: {
          codAperturaCaja: 22,
          codAsignacionCaja: 8,
          montoApertura: 250,
          montoCierre: 0,
          estado: 'CERRADA'
        }
      }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(aperturaCajaService.cierre({
      codAperturaCaja: 22,
      codAsignacionCaja: 8,
      observacion: 'Cerrar caja',
      montoCierre: 0,
      codUsuario: 17
    })).resolves.toMatchObject({ codAperturaCaja: 22, montoCierre: 0 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const closeRequest = fetchMock.mock.calls[1][1] as RequestInit;
    expect(closeRequest.method).toBe('PUT');
    expect(JSON.parse(String(closeRequest.body))).toMatchObject({
      codAperturaCaja: 22,
      montoCierre: 0,
      codUsuario: 17
    });
  });

  it('acepta el mensaje textual que devuelve el backend después de cerrar', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json(activeOpening(22)))
      .mockResolvedValueOnce(Response.json({
        success: true,
        message: 'Operation Success!',
        data: 'Caja CAJA19 cerrada correctamente. Monto inicial: S/ 560.00 | Monto cierre: S/ 560.00'
      }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(aperturaCajaService.cierre({
      codAperturaCaja: 22,
      codAsignacionCaja: 8,
      observacion: 'Cerrar caja',
      montoCierre: 560,
      codUsuario: 17
    })).resolves.toMatchObject({
      codAperturaCaja: 22,
      codAsignacionCaja: 8,
      montoApertura: 250,
      montoCierre: 560,
      estado: 'CERRADA'
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rechaza una respuesta activa sin identificador o monto verificable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      success: true,
      data: [{ estado: 'ABIERTA', caja: 'CAJA SIN DATOS' }]
    })));

    await expect(aperturaCajaService.verificarAperturaActiva(17)).rejects.toThrow(
      'No existe una apertura de caja activa'
    );
  });

  it('rechaza una apertura que el servidor atribuye a otro usuario', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      success: true,
      data: [{
        codAperturaCaja: 22,
        codUsuario: 18,
        montoApertura: 250,
        estado: 'ABIERTA'
      }]
    })));

    await expect(aperturaCajaService.verificarAperturaActiva(17, 22)).rejects.toThrow(
      'No existe una apertura de caja activa'
    );
  });
});
