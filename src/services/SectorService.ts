import BaseApiService from './BaseApiService';
import { isApiNotFoundError } from './apiClient';

/**
 * Interfaces para Sector
 */
export interface SectorData {
  codSector: number;
  nombreSector: string;
  codCuadrante: number;
  nombreCuadrante: string;
  codUnidadUrbana: number;
  unidadUrbana: string;
}

export interface CreateSectorDTO {
  codUnidadUrbana: number;
  nombreSector: string;
  codCuadrante: number;
}

export interface UpdateSectorDTO {
  codSector: number;
  nombreSector: string;
  codCuadrante: number;
  codUnidadUrbana: number;
}

export interface CuadranteData {
  codCuadrante: number;
  descripcion?: string | null;
  abreviatura: string;
  referenciaBarrio?: string | null;
}

export interface UnidadUrbanaData {
  codUnidadUrbana: number;
  descripcionUnidadUrbana: string;
}

/**
 * Interfaz para los datos crudos que vienen del API de Sector
 */
export interface SectorRaw {
  codSector?: number;
  nombreSector?: string;
  codCuadrante?: number;
  nombreCuadrante?: string;
  codUnidadUrbana?: number;
  unidadUrbana?: string;
}

/**
 * Servicio para gestión de sectores
 */
class SectorService extends BaseApiService<SectorData, CreateSectorDTO, UpdateSectorDTO, SectorRaw> {
  private static instance: SectorService;
  
  private constructor() {
    super(
      '/api/sector',
      {
        normalizeItem: (item: SectorRaw) => {
          return {
            codSector: item.codSector || 0,
            nombreSector: item.nombreSector || '',
            codCuadrante: item.codCuadrante || 0,
            nombreCuadrante: item.nombreCuadrante || '',
            codUnidadUrbana: item.codUnidadUrbana || 0,
            unidadUrbana: item.unidadUrbana || ''
          };
        },
        validateItem: (item: SectorData) => !!(item.codSector && item.nombreSector)
      },
      'sectores'
    );
  }
  
  static getInstance(): SectorService {
    if (!SectorService.instance) {
      SectorService.instance = new SectorService();
    }
    return SectorService.instance;
  }
  
  async obtenerTodos(): Promise<SectorData[]> {
    try {
      const response = await this.makeRequest<{ data: SectorRaw[] } | SectorRaw[]>('', {
        method: 'GET'
      });
      const data = Array.isArray(response) ? response : response.data || [];
      return this.normalizeData(data);
    } catch (error) {
      console.error('[SectorService] Error obteniendo todos:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async crearSector(datos: CreateSectorDTO): Promise<SectorData> {
    const response = await this.makeRequest<{ data: SectorRaw[] } | SectorRaw>('', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
    const res = (response as { data: SectorRaw[] }).data?.[0] || (response as SectorRaw);
    return this.normalizeOptions.normalizeItem(res, 0);
  }

  async actualizarSector(id: number, datos: UpdateSectorDTO): Promise<SectorData> {
    const response = await this.makeRequest<{ data: SectorRaw[] } | SectorRaw>('', {
      method: 'PUT',
      body: JSON.stringify({ ...datos, codSector: id })
    });
    const res = (response as { data: SectorRaw[] }).data?.[0] || (response as SectorRaw);
    return this.normalizeOptions.normalizeItem(res, 0);
  }

  async obtenerCuadrantes(): Promise<CuadranteData[]> {
    try {
      const response = await this.makeRequest<{ data: Record<string, unknown>[] } | Record<string, unknown>[]>('/listarCuadrante', {
        method: 'GET'
      });
      const data = Array.isArray(response) ? response : response.data || [];
      return data.map((i: Record<string, unknown>) => ({
        codCuadrante: (i.codCuadrante as number) || 0,
        descripcion: (i.descripcion as string) || null,
        abreviatura: (i.abreviatura as string) || '',
        referenciaBarrio: (i.referenciaBarrio as string) || null
      }));
    } catch (error) {
      console.error('[SectorService] Error obteniendo cuadrantes:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async obtenerUnidadesUrbanas(): Promise<UnidadUrbanaData[]> {
    try {
      const response = await this.makeRequest<{ data: Record<string, unknown>[] } | Record<string, unknown>[]>('/listarTipoUnidadUrbana', {
        method: 'GET'
      });
      const data = Array.isArray(response) ? response : response.data || [];
      return data.map((i: Record<string, unknown>) => ({
        codUnidadUrbana: (i.codUnidadUrbana as number) || 0,
        descripcionUnidadUrbana: (i.descripcionUnidadUrbana as string) || ''
      }));
    } catch (error) {
      console.error('[SectorService] Error obteniendo unidades urbanas:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }
}

export const sectorService = SectorService.getInstance();
export default sectorService;
