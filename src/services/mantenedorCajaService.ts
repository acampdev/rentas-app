import { logger } from '../utils/logger';
// src/services/mantenedorCajaService.ts
import BaseApiService from './BaseApiService';
import apiClient, { unwrapApiList } from './apiClient';
import { buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';

/**
 * Interfaces para Mantenedor de Caja
 */
export interface MantenedorCajaData {
  codCaja: number;
  descripcion: string;
  usuario: string | null;
  numcaja: string;
  estado: string;
}

export interface CreateMantenedorCajaDTO {
  descripcion: string;
}

export interface UpdateMantenedorCajaDTO {
  codCaja: number;
  descripcion: string;
}

export interface DeleteMantenedorCajaDTO {
  codCaja: number;
}

export interface ListarMantenedorCajaParams {
  descripcion?: string;
  codUsuario?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const hasPositiveIdentifier = (value: unknown): boolean => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
};

const assertMutationAccepted = (payload: unknown, operation: string): void => {
  if (!isRecord(payload)) {
    throw new Error(`El servidor no confirmó la operación de ${operation} la caja.`);
  }

  if (payload.success === true) return;

  const result = isRecord(payload.data) ? payload.data : payload;
  if (hasPositiveIdentifier(result.codCaja)) return;

  throw new Error(`El servidor devolvió una respuesta incompleta al ${operation} la caja.`);
};

/**
 * Servicio para gestion de mantenedor de cajas
 *
 * Todas las operaciones se ejecutan mediante el cliente HTTP autenticado.
 * Los métodos GET, POST y PUT requieren el Bearer de la sesión activa.
 */
class MantenedorCajaService extends BaseApiService<MantenedorCajaData, CreateMantenedorCajaDTO, UpdateMantenedorCajaDTO> {
  private static instance: MantenedorCajaService;

  public static getInstance(): MantenedorCajaService {
    if (!MantenedorCajaService.instance) {
      MantenedorCajaService.instance = new MantenedorCajaService();
    }
    return MantenedorCajaService.instance;
  }

  private constructor() {
    super(
      '/api/caja',
      {
        normalizeItem: (item: Record<string, unknown>) => ({
          codCaja: Number(item.codCaja) || 0,
          descripcion: String(item.descripcion || ''),
          usuario: (item.usuario as string | null) ?? null,
          numcaja: String(item.numcaja || ''),
          estado: String(item.estado || 'DISPONIBLE')
        }),
        validateItem: (item: MantenedorCajaData) => {
          return !!(item.codCaja && item.descripcion);
        }
      },
      'mantenedorCaja'
    );
  }

  /**
   * Lista cajas con filtros
   * GET /api/caja/listar?descripcion=C&codUsuario=1
   * Requiere autenticación Bearer.
   */
  async listar(params?: ListarMantenedorCajaParams): Promise<MantenedorCajaData[]> {
    try {
      logger.log('[MantenedorCajaService] Listando cajas con parametros:', params);

      const url = buildApiUrl(this.endpoint + '/listar');

      // Obtener el codUsuario del usuario actual para asegurar que se envíen los parámetros obligatorios del backend
      const defaultCodUsuario = getAuthenticatedUserCode();

      // Construir query params
      const queryParams = new URLSearchParams();
      // Siempre agregar descripcion y codUsuario, incluso si están vacíos/omitidos, para evitar errores 403/400 del servidor
      queryParams.append('descripcion', params?.descripcion || '');
      queryParams.append('codUsuario', String(params?.codUsuario !== undefined ? params.codUsuario : defaultCodUsuario));

      const getUrl = `${url}?${queryParams.toString()}`;
      logger.log('[MantenedorCajaService] GET URL:', getUrl);

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

      logger.log('[MantenedorCajaService] Datos obtenidos:', responseData);
      return this.normalizeData(unwrapApiList<Record<string, unknown>>(responseData));

    } catch (error: unknown) {
      logger.error('[MantenedorCajaService] Error listando cajas:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva caja
   * POST /api/caja/insertar
   * Body: {descripcion}
   * Requiere autenticación Bearer.
   */
  async insertar(datos: CreateMantenedorCajaDTO): Promise<void> {
    try {
      logger.log('[MantenedorCajaService] Insertando caja:', datos);

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

      logger.log('[MantenedorCajaService] Caja creada:', responseData);
      assertMutationAccepted(responseData, 'crear');

    } catch (error: unknown) {
      logger.error('[MantenedorCajaService] Error al insertar caja:', error);
      throw error;
    }
  }

  /**
   * Actualiza una caja existente
   * PUT /api/caja/actualizar
   * Body: {codCaja, descripcion}
   * Requiere autenticación Bearer.
   */
  async actualizar(datos: UpdateMantenedorCajaDTO): Promise<void> {
    try {
      logger.log('[MantenedorCajaService] Actualizando caja:', datos);

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

      logger.log('[MantenedorCajaService] Caja actualizada:', responseData);
      assertMutationAccepted(responseData, 'actualizar');

    } catch (error: unknown) {
      logger.error('[MantenedorCajaService] Error al actualizar caja:', error);
      throw error;
    }
  }

  /**
   * Elimina una caja
   * PUT /api/caja/eliminar
   * Body: {codCaja}
   * Requiere autenticación Bearer.
   */
  async eliminar(datos: DeleteMantenedorCajaDTO): Promise<void> {
    try {
      logger.log('[MantenedorCajaService] Eliminando caja:', datos);

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
      logger.log('[MantenedorCajaService] Caja eliminada exitosamente');

    } catch (error: unknown) {
      logger.error('[MantenedorCajaService] Error al eliminar caja:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las cajas (alias para listar sin parametros)
   */
  async obtenerTodas(): Promise<MantenedorCajaData[]> {
    logger.log('[MantenedorCajaService] Obteniendo todas las cajas');
    return this.listar();
  }

  /**
   * Busca cajas por descripcion
   */
  async buscarPorDescripcion(descripcion: string): Promise<MantenedorCajaData[]> {
    logger.log('[MantenedorCajaService] Buscando por descripcion:', descripcion);
    return this.listar({ descripcion });
  }

  /**
   * Busca cajas por usuario
   */
  async buscarPorUsuario(codUsuario: number): Promise<MantenedorCajaData[]> {
    logger.log('[MantenedorCajaService] Buscando por usuario:', codUsuario);
    return this.listar({ codUsuario });
  }
}

// Exportar instancia singleton
export const mantenedorCajaService = MantenedorCajaService.getInstance();
