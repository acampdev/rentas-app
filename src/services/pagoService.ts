// src/services/pagoService.ts
import { buildApiUrl, getApiHeaders } from '../config/api.unified.config';

export interface SaldoDeudaItem {
  codTributo: number;
  anio: number;
  periodo: number;
  abono: number;
}

export interface PagoOrdinarioDTO {
  codAperturaCaja: number;
  codContribuyente: number;
  montoPagoTotal: number;
  codMedioPago: string;
  codTipoAbono: string;
  saldosDeuda: SaldoDeudaItem[];
}

export interface SaldoDeudaFraccionamientoItem {
  codTributo: number;
  anio: number;
  periodo: number;
  abono: number;
  anioResolucion: number;
  codResolucion: number;
  numeroCuota: number;
}

export interface PagoCuotaFraccionamientoDTO {
  codAperturaCaja: number;
  codContribuyente: number;
  montoPagoTotal: number;
  codMedioPago: string;
  codTipoAbono: string;
  saldosDeuda: SaldoDeudaFraccionamientoItem[];
}

class PagoService {
  private static instance: PagoService;
  private endpoint = '/api/pago';

  public static getInstance(): PagoService {
    if (!PagoService.instance) {
      PagoService.instance = new PagoService();
    }
    return PagoService.instance;
  }

  private constructor() {
    console.log('[PagoService] Inicializado');
  }

  /**
   * Registra un pago ordinario
   * POST /api/pago/pagoOrdinario
   */
  async registrarPagoOrdinario(datos: PagoOrdinarioDTO): Promise<any> {
    try {
      console.log('[PagoService] Registrando Pago Ordinario:', datos);
      const url = buildApiUrl(`${this.endpoint}/pagoOrdinario`);

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: getApiHeaders(true),
        body: JSON.stringify(datos)
      });

      console.log(`[PagoService] Respuesta pagoOrdinario: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PagoService] Error del servidor en pagoOrdinario:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('[PagoService] Datos de respuesta del servidor (JSON) para pagoOrdinario:', responseData);

      if (responseData && responseData.success === false) {
        console.error('[PagoService] Error de negocio retornado por el servidor:', responseData.message);
        throw new Error(responseData.message || 'El servidor rechazó el procesamiento del pago.');
      }

      return responseData.data || responseData;
    } catch (error: unknown) {
      console.error('[PagoService] Error al registrar pago ordinario:', error);
      throw error;
    }
  }

  /**
   * Registra un pago de cuota de fraccionamiento
   * POST /api/pago/pagoCuotaFraccionamiento
   */
  async registrarPagoCuotaFraccionamiento(datos: PagoCuotaFraccionamientoDTO): Promise<any> {
    try {
      console.log('[PagoService] Registrando Pago Cuota Fraccionamiento:', datos);
      const url = buildApiUrl(`${this.endpoint}/pagoCuotaFraccionamiento`);

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: getApiHeaders(true),
        body: JSON.stringify(datos)
      });

      console.log(`[PagoService] Respuesta pagoCuotaFraccionamiento: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PagoService] Error del servidor en pagoCuotaFraccionamiento:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('[PagoService] Datos de respuesta del servidor (JSON) para pagoCuotaFraccionamiento:', responseData);

      if (responseData && responseData.success === false) {
        console.error('[PagoService] Error de negocio retornado por el servidor:', responseData.message);
        throw new Error(responseData.message || 'El servidor rechazó el procesamiento del pago de fraccionamiento.');
      }

      return responseData.data || responseData;
    } catch (error: unknown) {
      console.error('[PagoService] Error al registrar pago cuota fraccionamiento:', error);
      throw error;
    }
  }
}

export const pagoService = PagoService.getInstance();
