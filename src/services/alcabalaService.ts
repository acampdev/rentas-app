// src/services/alcabalaService.ts
import BaseApiService from './BaseApiService';
import { isApiNotFoundError } from './apiClient';

/**
 * Interfaces para Alcabala API
 */
export interface AlcabalaRaw {
  codAlcabala?: number | null;
  anio: number;
  tasa: number;
  codEstado?: string | null;
  estado?: string | null;
  desEstado?: string | null;
  nombreEstado?: string | null;
  descripcionEstado?: string | null;
}

export interface AlcabalaData {
  id: number;
  anio: number;
  tasa: number;
  estado: string;
}

export interface CreateAlcabalaDTO {
  anio: number;
  tasa: number;
  codEstado?: string | null;
}

export interface UpdateAlcabalaDTO extends Partial<CreateAlcabalaDTO> {
  codAlcabala: number;
}

/**
 * Servicio para gestión de Alcabala
 */
class AlcabalaService extends BaseApiService<AlcabalaData, CreateAlcabalaDTO, UpdateAlcabalaDTO, AlcabalaRaw> {
  private static instance: AlcabalaService;

  private constructor() {
    super(
      '/api/alcabala',
      {
        normalizeItem: (item: AlcabalaRaw) => {
          let estadoTexto = 'ACTIVO';
          
          if (item.estado) {
            estadoTexto = item.estado;
          } else if (item.desEstado) {
            estadoTexto = item.desEstado;
          } else if (item.nombreEstado) {
            estadoTexto = item.nombreEstado;
          } else if (item.descripcionEstado) {
            estadoTexto = item.descripcionEstado;
          } else if (item.codEstado) {
            estadoTexto = item.codEstado === '0201' || item.codEstado === '1' ? 'ACTIVO' : 'INACTIVO';
          }

          return {
            id: item.codAlcabala || 0,
            anio: item.anio,
            tasa: item.tasa,
            estado: estadoTexto
          };
        },
        validateItem: (item: AlcabalaData) => !!(item.anio && item.tasa >= 0)
      },
      'alcabalas'
    );
  }

  public static getInstance(): AlcabalaService {
    if (!AlcabalaService.instance) {
      AlcabalaService.instance = new AlcabalaService();
    }
    return AlcabalaService.instance;
  }

  async obtenerPorAnio(anio: number): Promise<AlcabalaData | null> {
    try {
      const response = await this.makeRequest<{ data: AlcabalaRaw[] } | AlcabalaRaw[]>(`?anio=${anio}`, {
        method: 'GET'
      });
      
      const items = Array.isArray(response) ? response : response.data || [];
      return items.length > 0 ? this.normalizeOptions.normalizeItem(items[0], 0) : null;
    } catch (error) {
      console.error('[AlcabalaService] Error:', error);
      if (isApiNotFoundError(error)) return null;
      throw error;
    }
  }

  async crearAlcabala(datos: CreateAlcabalaDTO): Promise<AlcabalaData> {
    const response = await this.makeRequest<{ data: AlcabalaRaw[] } | AlcabalaRaw>('', {
      method: 'POST',
      body: JSON.stringify({
        codAlcabala: null,
        anio: datos.anio,
        tasa: datos.tasa,
        codEstado: datos.codEstado || '0201'
      })
    });
    
    const raw = (response as { data: AlcabalaRaw[] }).data?.[0] || (response as AlcabalaRaw);
    return this.normalizeOptions.normalizeItem(raw, 0);
  }

  async actualizarAlcabala(id: number, datos: UpdateAlcabalaDTO): Promise<AlcabalaData> {
    const response = await this.makeRequest<{ data: AlcabalaRaw[] } | AlcabalaRaw>('', {
      method: 'PUT',
      body: JSON.stringify({
        codAlcabala: id,
        anio: datos.anio,
        tasa: datos.tasa,
        codEstado: datos.codEstado || '0201'
      })
    });
    
    const raw = (response as { data: AlcabalaRaw[] }).data?.[0] || (response as AlcabalaRaw);
    return this.normalizeOptions.normalizeItem(raw, 0);
  }
}

export const alcabalaService = AlcabalaService.getInstance();
