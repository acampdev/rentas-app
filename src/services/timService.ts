// src/services/timService.ts
import BaseApiService, { ApiResponse } from './BaseApiService';
import { API_CONFIG, buildApiUrl } from '../config/api.unified.config';

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
    const url = buildApiUrl(`${this.endpoint}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async obtenerTim(filtros: TimFilters): Promise<TimData[]> {
    try {
      const cleanParams: Record<string, string> = {};
      if (filtros.anio !== undefined) cleanParams.anio = String(filtros.anio);
      if (filtros.periodo !== undefined) cleanParams.periodo = String(filtros.periodo);
      if (filtros.codTributo !== undefined) cleanParams.codTributo = String(filtros.codTributo);
      if (filtros.codResolucionInteres !== undefined) cleanParams.codResolucionInteres = String(filtros.codResolucionInteres);
      
      const queryString = `?${new URLSearchParams(cleanParams).toString()}`;
      const url = buildApiUrl(`${this.endpoint}${queryString}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      const rawData = Array.isArray(result) ? result : (result.data || [result]);
      return this.normalizeData(rawData);
    } catch (error) {
      console.error('Error in obtenerTim:', error);
      return [];
    }
  }

  async actualizarTim(datos: UpdateTimDTO): Promise<any> {
    const url = buildApiUrl(`${this.endpoint}/actualizar`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async eliminarTim(datos: DeleteTimDTO): Promise<any> {
    const url = buildApiUrl(`${this.endpoint}/eliminar`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async listarCboTim(): Promise<any[]> {
    const url = buildApiUrl(`${this.endpoint}/listarCboTim`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : (result.data || []);
  }
}

export const timService = TimService.getInstance();
export default timService;