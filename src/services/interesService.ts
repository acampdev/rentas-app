// src/services/interesService.ts
import BaseApiService from './BaseApiService';
import apiClient, { isApiNotFoundError } from './apiClient';
import { buildApiUrl } from '../config/api.unified.config';
import { InteresData, CreateInteresDTO, UpdateInteresDTO, InactivarInteresDTO } from '../models/Interes';

/**
 * Servicio para gestión de Intereses
 */
class InteresService extends BaseApiService<InteresData, CreateInteresDTO, UpdateInteresDTO> {
  private static instance: InteresService;

  private constructor() {
    super(
      '/api/interes',
      {
        normalizeItem: (item: any) => ({
          codInteres: Number(item.codInteres) || 0,
          anio: Number(item.anio) || 0,
          tasa: Number(item.tasa) || 0,
          codTipo: String(item.codTipo || ''),
          codClase: String(item.codClase || ''),
          codEstado: String(item.codEstado || '')
        }),
        validateItem: (item: InteresData) => {
          return !!(item.anio && item.tasa >= 0 && item.codTipo && item.codClase);
        }
      },
      'interes'
    );
  }

  static getInstance(): InteresService {
    if (!InteresService.instance) {
      InteresService.instance = new InteresService();
    }
    return InteresService.instance;
  }

  /**
   * Obtiene los intereses filtrados por año
   * GET /api/interes?anio=YYYY
   */
  async obtenerPorAnio(anio: number): Promise<InteresData[]> {
    try {
      console.log(`🔍 [InteresService] Obteniendo intereses para año: ${anio}`);
      const url = buildApiUrl(`${this.endpoint}?anio=${anio}`);
      const res = await apiClient.request<unknown>(url);
      const payload = res && typeof res === 'object' && !Array.isArray(res) && 'data' in res
        ? (res as { data?: unknown }).data
        : res;
      const items = Array.isArray(payload) ? payload : payload ? [payload] : [];
      return this.normalizeData(items as Record<string, unknown>[]);
    } catch (error) {
      console.error('❌ [InteresService] Error en obtenerPorAnio:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  /**
   * Crea un nuevo interés
   * POST /api/interes
   */
  async insertar(datos: CreateInteresDTO): Promise<InteresData> {
    console.log('➕ [InteresService] Creando interés:', datos);
    return this.create(datos);
  }

  /**
   * Actualiza un interés (sin ID en la ruta URL)
   * PUT /api/interes
   */
  async actualizarSinId(datos: UpdateInteresDTO): Promise<InteresData> {
    try {
      console.log('📝 [InteresService] Actualizando interés sin ID en la ruta:', datos);
      
      const responseData = await this.makeRequest<any>('', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });
      
      console.log('✅ [InteresService] Interés actualizado exitosamente:', responseData);
      const updated = responseData.data || responseData;
      return this.normalizeData([updated])[0];
    } catch (error: unknown) {
      console.error('❌ [InteresService] Error al actualizar interés:', error);
      throw error;
    }
  }

  /**
   * Inactiva un interés sin eliminarlo del sistema.
   * PUT /api/interes/inactivarInteres
   */
  async inactivar(datos: InactivarInteresDTO): Promise<string> {
    try {
      const response = await this.makeRequest<{
        message?: string;
        mensaje?: string;
        data?: unknown;
      }>('/inactivarInteres', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });

      return response.mensaje
        || response.message
        || (typeof response.data === 'string' ? response.data : '')
        || 'Interés inactivado correctamente';
    } catch (error: unknown) {
      console.error('❌ [InteresService] Error al inactivar interés:', error);
      throw error;
    }
  }
}

export const interesService = InteresService.getInstance();
export default interesService;
export { InteresService };
