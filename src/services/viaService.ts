// src/services/viaService.ts
import BaseApiService, { ApiResponse, QueryParams } from './BaseApiService';
import { isApiNotFoundError } from './apiClient';

/**
 * Interfaces para Tipo de Vía
 */
export interface TipoViaRaw {
  codVia?: string | number;
  codigo?: string | number;
  codTipoVia?: string | number;
  nombreVia?: string;
  nombre?: string;
  descTipoVia?: string;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: string | number;
}

export interface TipoViaData {
  codigo: number;
  codigoTipoVia: string;
  nombre: string;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateTipoViaDTO {
  codigoTipoVia: string;
  nombre: string;
  descripcion?: string;
  codUsuario?: number;
}

export interface UpdateTipoViaDTO extends Partial<CreateTipoViaDTO> {
  estado?: string;
}

/**
 * Servicio para gestión de tipos de vía
 * 
 * Endpoints:
 * - GET /api/via/listarVia - No requiere token
 * - POST /api/via - Requiere token
 */
class TipoViaService extends BaseApiService<TipoViaData, CreateTipoViaDTO, UpdateTipoViaDTO, TipoViaRaw> {
  private static instance: TipoViaService;
  
  private constructor() {
    super(
      '/api/via',
      {
        normalizeItem: (item: TipoViaRaw, _index: number): TipoViaData => {
          const raw = item;
          if (!item || typeof item !== 'object') {
            return { codigo: 0, codigoTipoVia: '', nombre: 'Inválido', descripcion: '', estado: 'INACTIVO' };
          }

          // La API devuelve: codVia, codTipoVia, codBarrio, nombreVia, descTipoVia
          const codigo = parseInt((raw.codVia || raw.codigo || '0').toString());
          const nombre = (raw.nombreVia || raw.nombre || 'Sin nombre').toString().trim();

          return {
            codigo: codigo,
            codigoTipoVia: (raw.codTipoVia || '').toString(),
            nombre: nombre,
            descripcion: raw.descTipoVia || raw.descripcion || '',
            estado: raw.estado || 'ACTIVO',
            fechaRegistro: raw.fechaRegistro || undefined,
            fechaModificacion: raw.fechaModificacion || undefined,
            codUsuario: raw.codUsuario !== undefined ? Number(raw.codUsuario) : undefined
          };
        },
        
        validateItem: (item: TipoViaData) => {
          if (!item || typeof item !== 'object') {
            return false;
          }

          const hasValidCodigo = typeof item.codigo === 'number' && item.codigo > 0;
          const hasValidNombre = typeof item.nombre === 'string' && item.nombre.trim().length > 0;

          return hasValidCodigo && hasValidNombre;
        }
      },
      'tipoVia'
    );
  }
  
  /**
   * Obtiene la instancia singleton del servicio
   */
  static getInstance(): TipoViaService {
    if (!TipoViaService.instance) {
      TipoViaService.instance = new TipoViaService();
    }
    return TipoViaService.instance;
  }

  /**
   * Lista todos los tipos de vía
   * Endpoint específico: /api/via/listarVia
   */
  async listarTiposVia(): Promise<TipoViaData[]> {
    try {
      console.log('🔍 [TipoViaService] Listando tipos de vía');
      
      // Usar endpoint específico
      const response = await this.makeRequest<ApiResponse<Record<string, unknown>[]>>('/listarVia', {
        method: 'GET'
      });

      // La API devuelve un objeto con data
      const data = response.data || [];
      const normalized = this.normalizeData(data);
      
      return normalized;
      
    } catch (error: unknown) {
      console.error('❌ [TipoViaService] Error listando tipos de vía:', error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  /**
   * Override del método getAll para usar el endpoint correcto
   */
  public async getAll(_params?: QueryParams): Promise<TipoViaData[]> {
    return this.listarTiposVia();
  }
}

// Exportar instancia singleton
const tipoViaService = TipoViaService.getInstance();
export default tipoViaService;

// Exportar también la clase por si se necesita extender
export { TipoViaService };
