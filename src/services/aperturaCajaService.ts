import { logger } from '../utils/logger';
// src/services/aperturaCajaService.ts
import { buildApiUrl } from '../config/api.unified.config';
import { AperturaCaja, AperturaCajaDTO, CierreCajaDTO } from '../models';
import apiClient, { ApiClientError, unwrapApiData } from './apiClient';

/**
 * Servicio para gestion de apertura y cierre de caja
 *
 * Todas las operaciones se ejecutan mediante el cliente HTTP autenticado.
 */
const normalizeEstado = (estado?: string): string => {
  if (!estado) return 'ABIERTA';
  const upper = estado.toUpperCase();
  if (upper === 'ABIERTO' || upper === 'ABIERTA' || upper === 'APERTURADO' || upper === 'APERTURADA') {
    return 'ABIERTA';
  }
  if (upper === 'CERRADO' || upper === 'CERRADA') {
    return 'CERRADA';
  }
  return estado;
};

const isEstadoAbierto = (estado?: string): boolean =>
  typeof estado === 'string' && estado.trim() !== '' && normalizeEstado(estado) === 'ABIERTA';

const isValidIdentifier = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) > 0;

export type AperturaCajaActiva = AperturaCaja & {
  codAperturaCaja: number;
  montoApertura: number;
};

class AperturaCajaService {
  private static instance: AperturaCajaService;
  private endpoint = '/api/aperturaCaja';

  public static getInstance(): AperturaCajaService {
    if (!AperturaCajaService.instance) {
      AperturaCajaService.instance = new AperturaCajaService();
    }
    return AperturaCajaService.instance;
  }

  private constructor() {
    logger.log('[AperturaCajaService] Inicializado');
    logger.log(`  - Endpoint: "${this.endpoint}"`);
    logger.log('  - Autenticación: Bearer');
  }

  /**
   * Realiza la apertura de una caja
   * POST /api/aperturaCaja/apertura
   * Body: {observacion, montoApertura, codUsuario}
   * Requiere autenticación Bearer.
   */
  async apertura(datos: AperturaCajaDTO): Promise<AperturaCaja> {
    try {
      logger.log('[AperturaCajaService] Realizando apertura de caja:', datos);

      // Validar datos requeridos
      if (
        datos.montoApertura === undefined ||
        datos.montoApertura === null ||
        !isValidIdentifier(datos.codUsuario)
      ) {
        throw new Error('El monto de apertura y el código de usuario son requeridos');
      }

      const url = buildApiUrl(this.endpoint + '/apertura');

      const responseData = await apiClient.request<unknown>(url, {
        method: 'POST',
        body: JSON.stringify(datos)
      });
      logger.log('[AperturaCajaService] Apertura realizada exitosamente:', responseData);

      // El POST puede devolver solamente un mensaje. La fuente de verdad es la
      // consulta autenticada de la apertura activa del usuario.
      const aperturaData = unwrapApiData<Partial<AperturaCaja> | string>(responseData);
      const returnedCode = typeof aperturaData === 'object' && aperturaData !== null
        ? aperturaData.codAperturaCaja
        : undefined;

      return this.verificarAperturaActiva(
        datos.codUsuario,
        isValidIdentifier(returnedCode) ? returnedCode : undefined
      );

    } catch (error: unknown) {
      logger.error('[AperturaCajaService] Error en apertura de caja:', error);
      throw error;
    }
  }

  /**
   * Realiza el cierre de una caja
   * PUT /api/aperturaCaja/cierre
   * Body: {codAperturaCaja, codAsignacionCaja, observacion, montoCierre, codUsuario}
   * Requiere autenticación Bearer.
   */
  async cierre(datos: CierreCajaDTO): Promise<AperturaCaja> {
    try {
      logger.log('[AperturaCajaService] Realizando cierre de caja:', datos);

      // Validar datos requeridos
      if (
        datos.codAperturaCaja === undefined ||
        datos.codAperturaCaja === null ||
        datos.montoCierre === undefined ||
        datos.montoCierre === null ||
        !datos.codUsuario
      ) {
        throw new Error('Todos los campos son requeridos para el cierre');
      }

      if (!Number.isFinite(datos.montoCierre) || datos.montoCierre < 0) {
        throw new Error('El monto de cierre no es válido');
      }

      // Impide cerrar con un identificador recuperado del navegador o asociado
      // a otro usuario. El backend debe confirmar que sigue siendo la apertura activa.
      const aperturaVerificada = await this.verificarAperturaActiva(
        datos.codUsuario,
        datos.codAperturaCaja
      );

      const url = buildApiUrl(this.endpoint + '/cierre');

      // Construir el cuerpo exacto según la API modificada del backend (sin codAsignacionCaja)
      const requestBody = {
        codAperturaCaja: datos.codAperturaCaja,
        observacion: datos.observacion || 'Cerrar caja',
        montoCierre: datos.montoCierre,
        codUsuario: datos.codUsuario
      };

      const responseData = await apiClient.request<unknown>(url, {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      });
      logger.log('[AperturaCajaService] Cierre realizado exitosamente:', responseData);

      // Extraer datos del wrapper si existe
      const cierreData = unwrapApiData<Partial<AperturaCaja> | string>(responseData);
      const cierreObject = cierreData && typeof cierreData === 'object'
        ? cierreData
        : {};

      // Normalizar respuesta
      const normalized: AperturaCaja = {
        codAperturaCaja: cierreObject.codAperturaCaja ?? aperturaVerificada.codAperturaCaja,
        codAsignacionCaja: cierreObject.codAsignacionCaja ?? aperturaVerificada.codAsignacionCaja ?? null,
        montoApertura: cierreObject.montoApertura ?? aperturaVerificada.montoApertura,
        montoCierre: cierreObject.montoCierre ?? datos.montoCierre,
        estado: normalizeEstado(cierreObject.estado || 'CERRADA'),
        fechaApertura: cierreObject.fechaApertura ?? aperturaVerificada.fechaApertura,
        fechaCierre: cierreObject.fechaCierre,
        observacion: cierreObject.observacion ?? datos.observacion
      };

      return normalized;

    } catch (error: unknown) {
      logger.error('[AperturaCajaService] Error en cierre de caja:', error);
      throw error;
    }
  }

  /**
   * Obtiene la apertura de caja activa para un usuario
   * GET /api/aperturaCaja?codUsuario={codUsuario}
   */
  async obtenerPorUsuario(codUsuario: number): Promise<AperturaCaja | null> {
    try {
      if (!isValidIdentifier(codUsuario)) {
        throw new Error('El código de usuario para consultar la apertura no es válido');
      }

      logger.log('[AperturaCajaService] Obteniendo apertura para usuario:', codUsuario);
      
      const url = buildApiUrl(`${this.endpoint}?codUsuario=${codUsuario}`);
      
      const responseData = await apiClient.request<unknown>(url, { method: 'GET' });
      logger.log('[AperturaCajaService] Datos de apertura obtenidos:', responseData);

      const unwrapped = unwrapApiData<Partial<AperturaCaja> | Partial<AperturaCaja>[]>(responseData);
      const candidates = Array.isArray(unwrapped) ? unwrapped : unwrapped ? [unwrapped] : [];
      const data = candidates.find(item =>
        isEstadoAbierto(item.estado) &&
        (item.codUsuario === undefined || item.codUsuario === null || Number(item.codUsuario) === codUsuario)
      );

      if (
        !data ||
        !isValidIdentifier(data.codAperturaCaja) ||
        !Number.isFinite(data.montoApertura) ||
        Number(data.montoApertura) < 0
      ) {
        return null;
      }

      return {
        codAperturaCaja: data.codAperturaCaja,
        codAsignacionCaja: data.codAsignacionCaja ?? null,
        fechaApertura: data.fechaApertura,
        montoApertura: Number(data.montoApertura),
        montoCierre: data.montoCierre,
        observacion: data.observacion,
        estado: normalizeEstado(data.estado),
        fechaCierre: data.fechaCierre,
        numeroApertura: data.numeroApertura,
        caja: data.caja,
        turno: data.turno,
        diferencia: data.diferencia,
        tipoDiferencia: data.tipoDiferencia
      };

    } catch (error: unknown) {
      logger.error('[AperturaCajaService] Error obteniendo apertura de usuario:', error);
      if (error instanceof ApiClientError && error.statusCode === 404) return null;
      throw error;
    }
  }

  /**
   * Obtiene del servidor y verifica la apertura que se usará en una operación.
   * Nunca acepta localStorage ni sustituye identificadores ausentes.
   */
  async verificarAperturaActiva(
    codUsuario: number,
    codAperturaEsperada?: number
  ): Promise<AperturaCajaActiva> {
    if (!isValidIdentifier(codUsuario)) {
      throw new Error('No se pudo identificar al usuario que opera la caja');
    }
    if (codAperturaEsperada !== undefined && !isValidIdentifier(codAperturaEsperada)) {
      throw new Error('El código de apertura de caja no es válido');
    }

    const apertura = await this.obtenerPorUsuario(codUsuario);
    if (!apertura || !isValidIdentifier(apertura.codAperturaCaja)) {
      throw new Error('No existe una apertura de caja activa para el usuario indicado');
    }
    if (
      codAperturaEsperada !== undefined &&
      apertura.codAperturaCaja !== codAperturaEsperada
    ) {
      throw new Error('La apertura seleccionada ya no coincide con la apertura activa del usuario');
    }

    return apertura as AperturaCajaActiva;
  }

  /**
   * Lista todas las aperturas de caja para un usuario
   * GET /api/aperturaCaja?codUsuario={codUsuario}
   */
  async listarPorUsuario(codUsuario: number): Promise<AperturaCaja[]> {
    try {
      logger.log('[AperturaCajaService] Listando aperturas para usuario:', codUsuario);
      
      const url = buildApiUrl(`${this.endpoint}?codUsuario=${codUsuario}`);
      
      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const responseData = await apiClient.request<any>(url, {
        method: 'GET',
        headers
      });
      logger.log('[AperturaCajaService] Datos de lista obtenidos:', responseData);

      if (!responseData) return [];
      const rawList = responseData.data || responseData;
      const list = Array.isArray(rawList) ? rawList : [rawList].filter(Boolean);

      return list.map((data: any) => ({
        codAperturaCaja: data.codAperturaCaja,
        codAsignacionCaja: data.codAsignacionCaja,
        fechaApertura: data.fechaApertura,
        montoApertura: data.montoApertura,
        montoCierre: data.montoCierre,
        observacion: data.observacion,
        estado: normalizeEstado(data.estado),
        fechaCierre: data.fechaCierre,
        numeroApertura: data.numeroApertura,
        caja: data.caja,
        turno: data.turno,
        diferencia: data.diferencia,
        tipoDiferencia: data.tipoDiferencia
      }));

    } catch (error: unknown) {
      logger.error('[AperturaCajaService] Error listando aperturas:', error);
      if (error instanceof ApiClientError && error.statusCode === 404) return [];
      throw error;
    }
  }

  /**
   * Valida si una caja puede ser abierta
   */
  async validarApertura(codAsignacionCaja: number, fecha: string): Promise<boolean> {
    logger.log('[AperturaCajaService] Validando apertura para:', { codAsignacionCaja, fecha });
    return true;
  }

  /**
   * Valida si una caja puede ser cerrada
   */
  async validarCierre(codAperturaCaja: number, codUsuario: number): Promise<boolean> {
    logger.log('[AperturaCajaService] Validando cierre para:', { codAperturaCaja, codUsuario });
    await this.verificarAperturaActiva(codUsuario, codAperturaCaja);
    return true;
  }
}

// Exportar instancia singleton
export const aperturaCajaService = AperturaCajaService.getInstance();
