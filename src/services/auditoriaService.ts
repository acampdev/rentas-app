import BaseApiService from './BaseApiService';
import { API_CONFIG } from '../config/api.unified.config';

export interface AuditoriaItem {
  id?: string | number;
  fecha: string;
  origen: string;
  afectacion: string;
  antes: string | null;
  despues: string | null;
  usuario: string;
}

class AuditoriaService extends BaseApiService<AuditoriaItem, unknown, unknown, AuditoriaItem> {
  private static instance: AuditoriaService;

  private constructor() {
    super(
      API_CONFIG.endpoints.auditoria,
      {
        normalizeItem: (item: AuditoriaItem, index: number): AuditoriaItem => ({
          id: item.id || `audit_${index}_${(item.fecha || '').replace(/[^0-9]/g, '')}`,
          fecha: item.fecha || '',
          origen: item.origen || '',
          afectacion: item.afectacion || '',
          antes: item.antes !== undefined ? item.antes : null,
          despues: item.despues !== undefined ? item.despues : null,
          usuario: item.usuario || '',
        }),
        validateItem: () => true,
      },
      'auditoria'
    );
  }

  public static getInstance(): AuditoriaService {
    if (!AuditoriaService.instance) {
      AuditoriaService.instance = new AuditoriaService();
    }
    return AuditoriaService.instance;
  }

  /**
   * Obtener lista directa de auditorías desde el API sin parámetros
   */
  public async obtenerAuditorias(): Promise<AuditoriaItem[]> {
    try {
      const response = await this.makeRequest<any>('', { method: 'GET' });
      const rawData = Array.isArray(response)
        ? response
        : response?.data || response?.items || response?.content || (response ? [response] : []);
      return this.normalizeData(rawData);
    } catch (error) {
      console.error('❌ [AuditoriaService] Error al obtener auditorías:', error);
      throw error;
    }
  }
}

export const auditoriaService = AuditoriaService.getInstance();
export default auditoriaService;