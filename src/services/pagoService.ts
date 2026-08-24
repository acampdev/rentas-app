import { logger } from '../utils/logger';
// src/services/pagoService.ts
import { buildApiUrl, getApiHeaders } from '../config/api.unified.config';
import apiClient, { extractApiMessage } from './apiClient';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * En las operaciones de pago el backend suele devolver un message genérico
 * ("Operation Failed!") y colocar la causa real en data.
 */
const extractPagoOperationMessage = (payload: unknown, fallback: string): string => {
  if (isRecord(payload) && typeof payload.data === 'string' && payload.data.trim()) {
    return payload.data.trim();
  }

  return extractApiMessage(payload, fallback);
};

const normalizePagoError = (error: unknown, fallback: string): Error => {
  if (isRecord(error) && 'data' in error) {
    return new Error(extractPagoOperationMessage(error.data, fallback));
  }

  return error instanceof Error
    ? error
    : new Error(extractPagoOperationMessage(error, fallback));
};

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

export interface PagoOperationResult {
  data: unknown;
  message: string;
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
    logger.log('[PagoService] Inicializado');
  }

  /**
   * Registra un pago ordinario
   * POST /api/pago/pagoOrdinario
   */
  async registrarPagoOrdinario(datos: PagoOrdinarioDTO): Promise<PagoOperationResult> {
    try {
      logger.log('[PagoService] Registrando Pago Ordinario:', datos);
      const url = buildApiUrl(`${this.endpoint}/pagoOrdinario`);

      const responseData = await apiClient.request<unknown>(url, {
        method: 'POST',
        credentials: 'include',
        headers: getApiHeaders(true),
        body: JSON.stringify(datos)
      });

      logger.log('[PagoService] Datos de respuesta del servidor (JSON) para pagoOrdinario:', responseData);

      return {
        data: isRecord(responseData) && 'data' in responseData ? responseData.data : responseData,
        message: extractApiMessage(responseData, 'Pago ordinario registrado correctamente.')
      };
    } catch (error: unknown) {
      const normalizedError = normalizePagoError(
        error,
        'Error al registrar el pago ordinario.'
      );
      logger.error('[PagoService] Error al registrar pago ordinario:', normalizedError);
      throw normalizedError;
    }
  }

  /**
   * Registra un pago de cuota de fraccionamiento
   * POST /api/pago/pagoCuotaFraccionamiento
   */
  async registrarPagoCuotaFraccionamiento(datos: PagoCuotaFraccionamientoDTO): Promise<PagoOperationResult> {
    try {
      logger.log('[PagoService] Registrando Pago Cuota Fraccionamiento:', datos);
      const url = buildApiUrl(`${this.endpoint}/pagoCuotaFraccionamiento`);

      const responseData = await apiClient.request<unknown>(url, {
        method: 'POST',
        credentials: 'include',
        headers: getApiHeaders(true),
        body: JSON.stringify(datos)
      });

      logger.log('[PagoService] Datos de respuesta del servidor (JSON) para pagoCuotaFraccionamiento:', responseData);

      return {
        data: isRecord(responseData) && 'data' in responseData ? responseData.data : responseData,
        message: extractApiMessage(
          responseData,
          'Pago de fraccionamiento registrado correctamente.'
        )
      };
    } catch (error: unknown) {
      const normalizedError = normalizePagoError(
        error,
        'Error al registrar el pago de fraccionamiento.'
      );
      logger.error('[PagoService] Error al registrar pago cuota fraccionamiento:', normalizedError);
      throw normalizedError;
    }
  }
}

export const pagoService = PagoService.getInstance();
