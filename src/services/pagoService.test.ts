import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pagoService, type PagoCuotaFraccionamientoDTO, type PagoOrdinarioDTO } from './pagoService';

const pagoOrdinario: PagoOrdinarioDTO = {
  codAperturaCaja: 7,
  codContribuyente: 20,
  montoPagoTotal: 150,
  codMedioPago: '1801',
  codTipoAbono: '1901',
  saldosDeuda: [{ codTributo: 1, anio: 2026, periodo: 1, abono: 150 }]
};

describe('PagoService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('auth_token', 'token-caja');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it('registers an ordinary payment with authenticated identity and exact payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      success: true,
      data: { codPago: 91, numeroRecibo: '000091' }
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(pagoService.registrarPagoOrdinario(pagoOrdinario)).resolves.toEqual({
      codPago: 91,
      numeroRecibo: '000091'
    });

    expect(String(fetchMock.mock.calls[0][0])).toContain('/api/pago/pagoOrdinario');
    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.method).toBe('POST');
    expect(options.credentials).toBe('include');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer token-caja');
    expect(JSON.parse(String(options.body))).toEqual(pagoOrdinario);
  });

  it('registers a fractional-debt installment through its dedicated endpoint', async () => {
    const payload: PagoCuotaFraccionamientoDTO = {
      ...pagoOrdinario,
      saldosDeuda: [{
        ...pagoOrdinario.saldosDeuda[0],
        anioResolucion: 2026,
        codResolucion: 2,
        numeroCuota: 1
      }]
    };
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ success: true, data: { codPago: 92 } }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(pagoService.registrarPagoCuotaFraccionamiento(payload)).resolves.toEqual({ codPago: 92 });
    expect(String(fetchMock.mock.calls[0][0])).toContain('/api/pago/pagoCuotaFraccionamiento');
  });

  it('propagates the backend business message instead of reporting an empty result', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
      success: false,
      message: 'La caja se encuentra cerrada'
    })));

    await expect(pagoService.registrarPagoOrdinario(pagoOrdinario)).rejects.toThrow(
      'La caja se encuentra cerrada'
    );
  });
});
