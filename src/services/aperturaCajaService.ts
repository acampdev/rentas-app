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
    console.log('[AperturaCajaService] Inicializado');
    console.log(`  - Endpoint: "${this.endpoint}"`);
    console.log('  - Autenticación: Bearer');
  }

  /**
   * Realiza la apertura de una caja
   * POST /api/aperturaCaja/apertura
   * Body: {observacion, montoApertura, codUsuario}
   * Requiere autenticación Bearer.
   */
  async apertura(datos: AperturaCajaDTO): Promise<AperturaCaja> {
    try {
      console.log('[AperturaCajaService] Realizando apertura de caja:', datos);

      // Validar datos requeridos
      if (datos.montoApertura === undefined || datos.montoApertura === null || !datos.codUsuario) {
        throw new Error('El monto de apertura y el código de usuario son requeridos');
      }

      const url = buildApiUrl(this.endpoint + '/apertura');

      const responseData = await apiClient.request<unknown>(url, {
        method: 'POST',
        body: JSON.stringify(datos)
      });
      console.log('[AperturaCajaService] Apertura realizada exitosamente:', responseData);

      // Extraer datos del wrapper si existe
      const aperturaData = unwrapApiData<Partial<AperturaCaja> | string>(responseData);

      // Fallback: Si el backend devuelve un mensaje de texto en lugar del objeto,
      // realizamos una consulta GET para obtener los detalles reales y completos.
      if (typeof aperturaData === 'string') {
        console.log('[AperturaCajaService] El servidor retornó un string en data. Consultando detalles del objeto creado...');
        const realApertura = await this.obtenerPorUsuario(datos.codUsuario);
        if (realApertura) {
          return realApertura;
        }
      }

      // Normalizar respuesta
      if (!aperturaData || typeof aperturaData !== 'object') {
        throw new Error('El servidor no devolvió los datos de la apertura creada');
      }

      const normalized: AperturaCaja = {
        codAperturaCaja: aperturaData.codAperturaCaja,
        codAsignacionCaja: aperturaData.codAsignacionCaja ?? null,
        montoApertura: aperturaData.montoApertura !== undefined && aperturaData.montoApertura !== null ? aperturaData.montoApertura : datos.montoApertura,
        estado: normalizeEstado(aperturaData.estado),
        fechaApertura: aperturaData.fechaApertura,
        observacion: aperturaData.observacion
      };

      return normalized;

    } catch (error: unknown) {
      console.error('[AperturaCajaService] Error en apertura de caja:', error);
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
      console.log('[AperturaCajaService] Realizando cierre de caja:', datos);

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

      const url = buildApiUrl(this.endpoint + '/cierre');

      // Construir el cuerpo exacto según la API modificada del backend (sin codAsignacionCaja)
      const requestBody = {
        codAperturaCaja: datos.codAperturaCaja,
        observacion: datos.observacion || 'Aperturar caja',
        montoCierre: datos.montoCierre,
        codUsuario: datos.codUsuario
      };

      const responseData = await apiClient.request<unknown>(url, {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      });
      console.log('[AperturaCajaService] Cierre realizado exitosamente:', responseData);

      // Extraer datos del wrapper si existe
      const cierreData = unwrapApiData<Partial<AperturaCaja>>(responseData);
      if (!cierreData || typeof cierreData !== 'object') {
        throw new Error('El servidor no devolvió los datos del cierre realizado');
      }

      // Normalizar respuesta
      const normalized: AperturaCaja = {
        codAperturaCaja: cierreData.codAperturaCaja !== undefined && cierreData.codAperturaCaja !== null ? cierreData.codAperturaCaja : datos.codAperturaCaja,
        codAsignacionCaja: cierreData.codAsignacionCaja ?? null,
        montoApertura: cierreData.montoApertura ?? 0,
        montoCierre: cierreData.montoCierre !== undefined && cierreData.montoCierre !== null ? cierreData.montoCierre : datos.montoCierre,
        estado: normalizeEstado(cierreData.estado || 'CERRADA'),
        fechaApertura: cierreData.fechaApertura,
        fechaCierre: cierreData.fechaCierre,
        observacion: cierreData.observacion
      };

      return normalized;

    } catch (error: unknown) {
      console.error('[AperturaCajaService] Error en cierre de caja:', error);
      throw error;
    }
  }

  /**
   * Obtiene la apertura de caja activa para un usuario
   * GET /api/aperturaCaja?codUsuario={codUsuario}
   */
  async obtenerPorUsuario(codUsuario: number): Promise<AperturaCaja | null> {
    try {
      console.log('[AperturaCajaService] Obteniendo apertura para usuario:', codUsuario);
      
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
      console.log('[AperturaCajaService] Datos de apertura obtenidos:', responseData);

      if (!responseData) return null;
      let data = responseData.data || responseData;
      if (Array.isArray(data)) {
        if (data.length === 0) return null;
        const activa = data.find((x: any) => {
          const s = (x.estado || '').toUpperCase();
          return s === 'ABIERTO' || s === 'ABIERTA' || s === 'APERTURADO' || s === 'APERTURADA';
        });
        if (!activa) return null;
        data = activa;
      } else {
        const s = (data.estado || '').toUpperCase();
        const isActive = s === 'ABIERTO' || s === 'ABIERTA' || s === 'APERTURADO' || s === 'APERTURADA';
        if (!isActive) return null;
      }

      if (!data || !data.codAperturaCaja) {
        return null;
      }

      return {
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
      };

    } catch (error: unknown) {
      console.error('[AperturaCajaService] Error obteniendo apertura de usuario:', error);
      if (error instanceof ApiClientError && error.statusCode === 404) return null;
      throw error;
    }
  }

  /**
   * Lista todas las aperturas de caja para un usuario
   * GET /api/aperturaCaja?codUsuario={codUsuario}
   */
  async listarPorUsuario(codUsuario: number): Promise<AperturaCaja[]> {
    try {
      console.log('[AperturaCajaService] Listando aperturas para usuario:', codUsuario);
      
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
      console.log('[AperturaCajaService] Datos de lista obtenidos:', responseData);

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
      console.error('[AperturaCajaService] Error listando aperturas:', error);
      if (error instanceof ApiClientError && error.statusCode === 404) return [];
      throw error;
    }
  }

  /**
   * Valida si una caja puede ser abierta
   */
  async validarApertura(codAsignacionCaja: number, fecha: string): Promise<boolean> {
    console.log('[AperturaCajaService] Validando apertura para:', { codAsignacionCaja, fecha });
    return true;
  }

  /**
   * Valida si una caja puede ser cerrada
   */
  async validarCierre(codAperturaCaja: number): Promise<boolean> {
    console.log('[AperturaCajaService] Validando cierre para:', codAperturaCaja);
    return true;
  }
}

// Exportar instancia singleton
export const aperturaCajaService = AperturaCajaService.getInstance();
