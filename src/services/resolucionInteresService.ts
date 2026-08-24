import { logger } from '../utils/logger';
import BaseApiService, { ApiResponse } from './BaseApiService';
import { isApiNotFoundError } from './apiClient';

/**
 * Interface para los datos de Resolución de Interés
 */
export interface ResolucionInteresData {
  codResolucionInteres: number;
  descripcion: string;
  anioFiscal: number | null;
  tasa: number | null;
  fechaInicioStr: string;
  fechaFinStr: string;
  estado: string;
}

export interface ResolucionInteresRaw {
  codResolucionInteres?: number;
  descripcion?: string;
  anioFiscal?: number | null;
  tasa?: number | null;
  fechaInicioStr?: string;
  fechaFinStr?: string;
  estado?: string;
}

export interface CreateResolucionInteresDTO {
  anioFiscal: number;
  descripcion: string;
  tasa: number;
}

export interface UpdateResolucionInteresDTO extends CreateResolucionInteresDTO {
  codResolucionInteres: number;
}

/**
 * Servicio para gestión de Resoluciones de Interés
 */
class ResolucionInteresService extends BaseApiService<ResolucionInteresData, CreateResolucionInteresDTO, UpdateResolucionInteresDTO, ResolucionInteresRaw> {
  private static instance: ResolucionInteresService;

  private constructor() {
    super(
      '/api/resolucionInteres',
      {
        normalizeItem: (item: ResolucionInteresRaw) => ({
          codResolucionInteres: item.codResolucionInteres || 0,
          descripcion: item.descripcion || '',
          anioFiscal: item.anioFiscal || null,
          tasa: item.tasa || null,
          fechaInicioStr: item.fechaInicioStr || '',
          fechaFinStr: item.fechaFinStr || '',
          estado: item.estado || 'ACTIVO'
        }),
        validateItem: (item: ResolucionInteresData) => !!(item.codResolucionInteres && item.descripcion)
      },
      'resoluciones-interes'
    );
  }

  static getInstance(): ResolucionInteresService {
    if (!ResolucionInteresService.instance) {
      ResolucionInteresService.instance = new ResolucionInteresService();
    }
    return ResolucionInteresService.instance;
  }

  async obtenerTodas(filtros?: { codResolucionInteres?: number }): Promise<ResolucionInteresData[]> {
    try {
      const queryString = filtros ? `?${new URLSearchParams(filtros as any).toString()}` : '';
      const response = await this.makeRequest<any>(queryString, {
        method: 'GET'
      });
      
      let rawData: ResolucionInteresRaw[] = [];
      if (Array.isArray(response)) {
        rawData = response;
      } else if (response && typeof response === 'object') {
        const dataObj = response.data !== undefined ? response.data : response;
        if (Array.isArray(dataObj)) {
          rawData = dataObj;
        } else if (dataObj && typeof dataObj === 'object' && (dataObj.codResolucionInteres !== undefined || dataObj.descripcion)) {
          rawData = [dataObj];
        }
      }
      
      return this.normalizeData(rawData);
    } catch (error) {
      logger.error('Error in obtenerTodas:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async crearResolucion(datos: CreateResolucionInteresDTO): Promise<ResolucionInteresData> {
    const response = await this.makeRequest<ResolucionInteresRaw | ApiResponse<ResolucionInteresRaw>>('', {
      method: 'POST',
      body: datos as any
    });
    const created = (response as ApiResponse<ResolucionInteresRaw>).data || response;
    return this.normalizeOptions.normalizeItem(created as ResolucionInteresRaw, 0);
  }

  async actualizarResolucion(datos: UpdateResolucionInteresDTO): Promise<ResolucionInteresData> {
    const response = await this.makeRequest<ResolucionInteresRaw | ApiResponse<ResolucionInteresRaw>>('', {
      method: 'PUT',
      body: datos as any
    });
    const updated = (response as ApiResponse<ResolucionInteresRaw>).data || response;
    return this.normalizeOptions.normalizeItem(updated as ResolucionInteresRaw, 0);
  }

  async eliminarResolucion(id: number): Promise<void> {
    await this.makeRequest<void>('/eliminar', {
      method: 'PUT',
      body: { codResolucionInteres: id } as any
    });
  }
}

export const resolucionInteresService = ResolucionInteresService.getInstance();
export default resolucionInteresService;
