import { logger } from '../utils/logger';
// src/services/asignacionCajaService.ts
import BaseApiService from './BaseApiService';
import apiClient, { unwrapApiList } from './apiClient';
import { buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';

/**
 * Interfaces para AsignacionCaja
 */
export interface AsignacionCajaData {
  codAsignacionCaja: number;
  codUsuario: number | null;
  codCaja: number | null;
  codTurno: number | null;
  fecha: string | null;
  terminoBusqueda: string | null;
  numCaja: string;
  nombreUsuario: string;
  turno: string;
  estado: string;
  fechaStr: string;
}

export interface CreateAsignacionCajaDTO {
  codUsuario: number;
  codCaja: number;
  codTurno: number;
  fecha: string; // formato: "2025-11-07"
  usuario: string;
}

export interface UpdateAsignacionCajaDTO {
  codAsignacionCaja: number;
  codUsuario: number;
  codCaja: number;
  codTurno: number;
  usuario: string;
}

export interface DeleteAsignacionCajaDTO {
  codAsignacionCaja: number;
  usuario: string;
}

export interface ListarAsignacionCajaParams {
  terminoBusqueda?: string;
  fecha?: string; // formato: "2025-11-04"
  codUsuario?: number;
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const assertMutationAccepted = (payload: unknown, operation: string): void => {
  if (!isRecord(payload)) {
    throw new Error(`El servidor no confirmó la operación de ${operation} la asignación.`);
  }

  if (payload.success === true) return;

  const result = isRecord(payload.data) ? payload.data : payload;
  if (toNullableNumber(result.codAsignacionCaja)) return;

  throw new Error(`El servidor devolvió una respuesta incompleta al ${operation} la asignación.`);
};

/**
 * Servicio para gestion de asignacion de caja
 *
 * Todas las operaciones se ejecutan mediante el cliente HTTP autenticado.
 * Los métodos GET, POST y PUT requieren el Bearer de la sesión activa.
 */
class AsignacionCajaService extends BaseApiService<AsignacionCajaData, CreateAsignacionCajaDTO, UpdateAsignacionCajaDTO> {
  private static instance: AsignacionCajaService;

  public static getInstance(): AsignacionCajaService {
    if (!AsignacionCajaService.instance) {
      AsignacionCajaService.instance = new AsignacionCajaService();
    }
    return AsignacionCajaService.instance;
  }

  private constructor() {
    super(
      '/api/asignacionCaja',
      {
        normalizeItem: (item: Record<string, unknown>) => ({
          codAsignacionCaja: Number(item.codAsignacionCaja) || 0,
          codUsuario: toNullableNumber(item.codUsuario),
          codCaja: toNullableNumber(item.codCaja),
          codTurno: toNullableNumber(item.codTurno),
          fecha: item.fecha ? String(item.fecha) : null,
          terminoBusqueda: (item.terminoBusqueda as string | null) ?? null,
          numCaja: String(item.numCaja || ''),
          nombreUsuario: String(item.nombreUsuario || ''),
          turno: String(item.turno || ''),
          estado: String(item.estado || 'ACTIVO'),
          fechaStr: String(item.fechaStr || '')
        }),
        validateItem: (item: AsignacionCajaData) => {
          return !!item.codAsignacionCaja;
        }
      },
      'asignacionCaja'
    );
  }

  /**
   * Lista asignaciones de caja con filtros
   * GET /api/asignacionCaja/listar?terminoBusqueda=h&fecha=2025-11-04&codUsuario=1
   * Requiere autenticación Bearer.
   */
  async listar(params?: ListarAsignacionCajaParams): Promise<AsignacionCajaData[]> {
    try {
      logger.log('[AsignacionCajaService] Listando asignaciones con parametros:', params);

      const url = buildApiUrl(this.endpoint + '/listar');

      // Construir query params
      const queryParams = new URLSearchParams();
      
      // Obtener defaults de usuario y fecha para asegurar que se envíen los 3 parámetros obligatorios del backend
      const defaultCodUsuario = getAuthenticatedUserCode();
      const defaultFecha = new Date().toISOString().split('T')[0];

      const terminoBusqueda = params?.terminoBusqueda !== undefined ? params.terminoBusqueda : '';
      const fecha = params?.fecha !== undefined ? params.fecha : defaultFecha;
      const codUsuario = params?.codUsuario !== undefined ? params.codUsuario : defaultCodUsuario;

      queryParams.append('terminoBusqueda', String(terminoBusqueda));
      queryParams.append('fecha', String(fecha));
      queryParams.append('codUsuario', String(codUsuario));

      const getUrl = `${url}?${queryParams.toString()}`;
      logger.log('[AsignacionCajaService] GET URL:', getUrl);

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const responseData = await apiClient.request<unknown>(getUrl, {
        method: 'GET',
        headers
      });

      logger.log('[AsignacionCajaService] Datos obtenidos:', responseData);
      return this.normalizeData(unwrapApiList<Record<string, unknown>>(responseData));

    } catch (error: unknown) {
      logger.error('[AsignacionCajaService] Error listando asignaciones:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva asignacion de caja
   * POST /api/asignacionCaja/insertar
   * Body: {codUsuario, codCaja, codTurno, fecha, usuario}
   * Requiere autenticación Bearer.
   */
  async insertar(datos: CreateAsignacionCajaDTO): Promise<void> {
    try {
      logger.log('[AsignacionCajaService] Insertando asignacion:', datos);

      const url = buildApiUrl(this.endpoint + '/insertar');

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const responseData = await apiClient.request<unknown>(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(datos)
      });

      logger.log('[AsignacionCajaService] Asignacion creada:', responseData);
      assertMutationAccepted(responseData, 'crear');

    } catch (error: unknown) {
      logger.error('[AsignacionCajaService] Error al insertar asignacion:', error);
      throw error;
    }
  }

  /**
   * Actualiza una asignacion de caja existente
   * PUT /api/asignacionCaja/actualizar
   * Body: {codAsignacionCaja, codUsuario, codCaja, codTurno, usuario}
   * Requiere autenticación Bearer.
   */
  async actualizar(datos: UpdateAsignacionCajaDTO): Promise<void> {
    try {
      logger.log('[AsignacionCajaService] Actualizando asignacion:', datos);

      const url = buildApiUrl(this.endpoint + '/actualizar');

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const responseData = await apiClient.request<unknown>(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(datos)
      });

      logger.log('[AsignacionCajaService] Asignacion actualizada:', responseData);
      assertMutationAccepted(responseData, 'actualizar');

    } catch (error: unknown) {
      logger.error('[AsignacionCajaService] Error al actualizar asignacion:', error);
      throw error;
    }
  }

  /**
   * Elimina una asignacion de caja
   * PUT /api/asignacionCaja/eliminar
   * Body: {codAsignacionCaja, usuario}
   * Requiere autenticación Bearer.
   */
  async eliminar(datos: DeleteAsignacionCajaDTO): Promise<void> {
    try {
      logger.log('[AsignacionCajaService] Eliminando asignacion:', datos);

      const url = buildApiUrl(this.endpoint + '/eliminar');

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const responseData = await apiClient.request<unknown>(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(datos)
      });

      assertMutationAccepted(responseData, 'eliminar');
      logger.log('[AsignacionCajaService] Asignacion eliminada exitosamente');

    } catch (error: unknown) {
      logger.error('[AsignacionCajaService] Error al eliminar asignacion:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las asignaciones (alias para listar sin parametros)
   */
  async obtenerTodas(): Promise<AsignacionCajaData[]> {
    logger.log('[AsignacionCajaService] Obteniendo todas las asignaciones');
    return this.listar();
  }

  /**
   * Busca asignaciones por termino de busqueda
   */
  async buscarPorTermino(termino: string): Promise<AsignacionCajaData[]> {
    logger.log('[AsignacionCajaService] Buscando por termino:', termino);
    return this.listar({ terminoBusqueda: termino });
  }

  /**
   * Busca asignaciones por fecha
   */
  async buscarPorFecha(fecha: string): Promise<AsignacionCajaData[]> {
    logger.log('[AsignacionCajaService] Buscando por fecha:', fecha);
    return this.listar({ fecha });
  }

  /**
   * Busca asignaciones por usuario
   */
  async buscarPorUsuario(codUsuario: number): Promise<AsignacionCajaData[]> {
    logger.log('[AsignacionCajaService] Buscando por usuario:', codUsuario);
    return this.listar({ codUsuario });
  }
}

// Exportar instancia singleton
export const asignacionCajaService = AsignacionCajaService.getInstance();
