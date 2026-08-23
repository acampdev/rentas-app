// src/services/timService.ts
import BaseApiService from './BaseApiService';
import { isApiNotFoundError } from './apiClient';

export interface TimData {
  codTIM: number;
  anio: number;
  codTributo: number;
  periodo: number;
  tasa: number;
  codResolucionInteres: number;
  mes?: string;
  tributo?: string;
  resolucion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estadoResolucion?: string;
}

export interface TimFilters {
  anio?: number;
  periodo?: number;
  codTributo?: number;
  codResolucionInteres?: number;
}

export interface UpdateTimDTO {
  codTIM: number;
  anio: number;
  periodo: number;
  tasa: number;
  codTributo: number;
  codResolucionInteres: number;
}

export interface DeleteTimDTO {
  codTIM: number;
  codResolucionInteres: number;
}

class TimService extends BaseApiService<TimData, any, UpdateTimDTO, any> {
  private static instance: TimService;

  private constructor() {
    super(
      '/api/tim',
      {
        normalizeItem: (item: any) => ({
          codTIM: item.codTIM || 0,
          anio: item.anio || 0,
          codTributo: item.codTributo || 0,
          periodo: item.periodo || 0,
          tasa: item.tasa || 0,
          codResolucionInteres: item.codResolucionInteres || 0,
          mes: item.mes || '',
          tributo: item.tributo || '',
          resolucion: item.resolucion || '',
          fechaInicio: item.fechaInicio || '',
          fechaFin: item.fechaFin || '',
          estadoResolucion: item.estadoResolucion || ''
        }),
        validateItem: (item: TimData) => !!item.codTIM
      },
      'tim'
    );
  }

  static getInstance(): TimService {
    if (!TimService.instance) {
      TimService.instance = new TimService();
    }
    return TimService.instance;
  }

  async crearTim(datos: any): Promise<any> {
    return await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
  }

  async obtenerTim(filtros: TimFilters): Promise<TimData[]> {
    try {
      const cleanParams: Record<string, string> = {};
      if (filtros.anio !== undefined) cleanParams.anio = String(filtros.anio);
      if (filtros.periodo !== undefined) cleanParams.periodo = String(filtros.periodo);
      if (filtros.codTributo !== undefined) cleanParams.codTributo = String(filtros.codTributo);
      if (filtros.codResolucionInteres !== undefined) cleanParams.codResolucionInteres = String(filtros.codResolucionInteres);
      
      const queryString = `?${new URLSearchParams(cleanParams).toString()}`;
      const result = await this.makeRequest<any>(queryString, { method: 'GET' });
      const rawData = Array.isArray(result) ? result : (result.data || [result]);
      return this.normalizeData(rawData);
    } catch (error) {
      console.error('Error in obtenerTim:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async actualizarTim(datos: UpdateTimDTO): Promise<any> {
    return await this.makeRequest('/actualizar', {
      method: 'PUT',
      body: JSON.stringify(datos)
    });
  }

  async eliminarTim(datos: DeleteTimDTO): Promise<any> {
    return await this.makeRequest('/eliminar', {
      method: 'PUT',
      body: JSON.stringify(datos)
    });
  }

  async listarCboTim(): Promise<any[]> {
    const result = await this.makeRequest<any>('/listarCboTim', { method: 'GET' });
    return Array.isArray(result) ? result : (result.data || []);
  }
}

export const timService = TimService.getInstance();
export default timService;
