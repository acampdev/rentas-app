import BaseApiService from './BaseApiService';
import { isApiNotFoundError } from './apiClient';

/**
 * Interfaces para Barrio
 */
export interface BarrioData {
  codigo: number;
  nombre: string;
  codSector?: number;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateBarrioDTO {
  nombreBarrio: string;
  codSector: number;
  descripcion?: string;
  codUsuario?: number;
}

export interface UpdateBarrioDTO {
  nombreBarrio?: string;
  codSector?: number;
  descripcion?: string;
  estado?: string;
  fechaModificacion?: string;
}

export interface BusquedaBarrioParams {
  nombre?: string;
  codSector?: number;
  estado?: string;
  codUsuario?: number;
}

/**
 * Interfaz para los datos crudos que vienen del API de Barrio
 */
export interface BarrioRaw {
  codBarrio?: number;
  codigo?: number;
  nombre?: string;
  nombreBarrio?: string;
  codSector?: number;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

/**
 * Servicio para gestión de barrios
 */
class BarrioService extends BaseApiService<BarrioData, CreateBarrioDTO, UpdateBarrioDTO, BarrioRaw> {
  private static instance: BarrioService;
  
  private constructor() {
    super(
      '/api/barrio',
      {
        normalizeItem: (item: BarrioRaw) => {
          return {
            codigo: item.codBarrio || item.codigo || 0,
            nombre: item.nombre || item.nombreBarrio || '',
            codSector: item.codSector || 0,
            descripcion: item.descripcion || '',
            estado: item.estado || 'ACTIVO',
            fechaRegistro: item.fechaRegistro,
            fechaModificacion: item.fechaModificacion,
            codUsuario: item.codUsuario
          };
        },
        validateItem: (item: BarrioData) => !!(item.codigo && item.nombre)
      },
      'barrios'
    );
  }
  
  static getInstance(): BarrioService {
    if (!BarrioService.instance) {
      BarrioService.instance = new BarrioService();
    }
    return BarrioService.instance;
  }
  
  /**
   * Crea un nuevo barrio usando el API directo
   */
  async crearBarrio(datos: { nombre?: string; nombreBarrio?: string; codSector: number; descripcion?: string }): Promise<BarrioData> {
    const nombre = datos.nombre || datos.nombreBarrio || '';
    const response = await this.makeRequest<{ data: BarrioRaw[] } | BarrioRaw>('', {
      method: 'POST',
      body: JSON.stringify({
        nombreBarrio: nombre.trim(),
        codSector: datos.codSector,
        descripcion: datos.descripcion?.trim() || ''
      })
    });
    
    const cleanData = ((response as { data: BarrioRaw[] }).data?.[0] || response) as BarrioRaw;
    return this.normalizeOptions.normalizeItem(cleanData, 0);
  }

  /**
   * Actualiza un barrio existente
   */
  async actualizarBarrio(id: number, datos: { nombre?: string; nombreBarrio?: string; codSector?: number; descripcion?: string; estado?: string }): Promise<BarrioData> {
    const nombre = datos.nombre || datos.nombreBarrio;
    const response = await this.makeRequest<{ data: BarrioRaw[] } | BarrioRaw>('', {
      method: 'PUT',
      body: JSON.stringify({
        codBarrio: id,
        nombreBarrio: nombre,
        codSector: datos.codSector,
        descripcion: datos.descripcion,
        estado: datos.estado
      })
    });
    
    const cleanData = ((response as { data: BarrioRaw[] }).data?.[0] || response) as BarrioRaw;
    return this.normalizeOptions.normalizeItem(cleanData, 0);
  }
  
  async obtenerPorSector(codSector: number): Promise<BarrioData[]> {
    try {
      const res = await this.makeRequest<{ data: BarrioRaw[] } | BarrioRaw[]>(`/listar?codSector=${codSector}`, {
        method: 'GET'
      });
      
      const data = Array.isArray(res) ? res : res.data || [];
      return this.normalizeData(data);
    } catch (error) {
      console.error('[BarrioService] Error obteniendo por sector:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async obtenerTodos(): Promise<BarrioData[]> {
    return this.getAll();
  }
}

export const barrioService = BarrioService.getInstance();
export default barrioService;
