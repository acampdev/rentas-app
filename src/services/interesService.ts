// src/services/interesService.ts
import BaseApiService from './BaseApiService';
import apiClient from './apiClient';
import { buildApiUrl } from '../config/api.unified.config';
import { InteresData, CreateInteresDTO, UpdateInteresDTO } from '../models/Interes';

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
      const response = await apiClient.fetch(url);
      
      if (!response.ok) {
        console.warn(`⚠️ [InteresService] HTTP error: ${response.status}`);
        return [];
      }
      
      const res = await response.json();
      const items = res.data || res || [];
      return this.normalizeData(Array.isArray(items) ? items : [items]);
    } catch (error) {
      console.error('❌ [InteresService] Error en obtenerPorAnio:', error);
      return [];
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
   * Elimina un interés (PUT /api/interes/eliminarInteres con body JSON)
   */
  async eliminarConBody(datos: UpdateInteresDTO): Promise<void> {
    try {
      console.log('🗑️ [InteresService] Eliminando interés con body:', datos);
      
      await this.makeRequest('/eliminarInteres', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });
      
      console.log('✅ [InteresService] Interés eliminado exitosamente');
    } catch (error: unknown) {
      console.error('❌ [InteresService] Error al eliminar interés:', error);
      throw error;
    }
  }
}

export const interesService = InteresService.getInstance();
export default interesService;
export { InteresService };
