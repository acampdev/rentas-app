// src/services/calleApiService.ts - CORREGIDO CON ENDPOINTS CORRECTOS

import BaseApiService, { QueryParams } from './BaseApiService';
import { buildApiUrl } from '../config/api.unified.config';

/**
 * Interfaces for Calle/Via
 */
export interface CalleData {
  // Main API fields
  codVia: number;
  codTipoVia: number | string;
  codBarrio: number;
  codSector?: number;
  nombreVia: string;
  descTipoVia: string;
  nombreBarrio: string;
  nombreSector?: string;
  
  // Compatibility fields
  codigo?: number;
  nombre?: string;
  codigoVia?: number | string;
  codigoBarrio?: number;
  tipo?: string;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateCalleDTO {
  nombreVia: string;
  codTipoVia: string;
  codBarrio: number;
  codSector: number;
}

export interface UpdateCalleDTO {
  nombreVia?: string;
  codTipoVia?: string;
  codBarrio?: number;
  codSector?: number;
  estado?: string;
  fechaModificacion?: string;
}

export interface BusquedaCalleParams extends QueryParams {
  nombre?: string;
  tipo?: string;
  estado?: string;
  codUsuario?: number;
  parametrosBusqueda?: string;
  nombreVia?: string;
}

export interface UpdateSectorDTO {
  nombreSector: string;
}

/**
 * Interfaces para Calle/Via cruda del API
 */
export interface RawCalle {
  codVia?: number;
  id?: number;
  codTipoVia?: number | string;
  codBarrio?: number;
  codSector?: number;
  nombreVia?: string;
  descTipoVia?: string;
  nombreBarrio?: string;
  nombreSector?: string;
  codigo?: number;
  nombre?: string;
  codigoVia?: number | string;
  codigoBarrio?: number;
  tipoVia?: string;
  tipo?: string;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

interface CalleApiResponse {
  success: boolean;
  data: RawCalle | RawCalle[];
}

/**
 * Servicio para gestión de calles/vías
 * GET: /api/via/listarVia
 * POST: /api/via
 * NO REQUIERE AUTENTICACIÓN
 */
class CalleApiService extends BaseApiService<CalleData, CreateCalleDTO, UpdateCalleDTO, RawCalle> {
  private static instance: CalleApiService;
  
  private constructor() {
    super(
      '/api/via', // Endpoint base para CRUD
      {
        normalizeItem: (item: RawCalle) => ({
          // Campos principales del API
          codVia: item.codVia || 0,
          codTipoVia: item.codTipoVia || '',
          codBarrio: item.codBarrio || 0,
          codSector: item.codSector || 0,
          nombreVia: item.nombreVia || '',
          descTipoVia: item.descTipoVia || '',
          nombreBarrio: item.nombreBarrio || '',
          nombreSector: item.nombreSector || '',
          
          // Campos para compatibilidad
          codigo: item.codVia || item.codigo || 0,
          nombre: item.nombreVia || item.nombre || '',
          codigoVia: item.codTipoVia || item.codigoVia,
          codigoBarrio: item.codBarrio || item.codigoBarrio,
          tipo: item.descTipoVia || item.tipoVia || item.tipo || 'CALLE',
          descripcion: item.descripcion || '',
          estado: item.estado || 'ACTIVO',
          fechaRegistro: item.fechaRegistro,
          fechaModificacion: item.fechaModificacion,
          codUsuario: item.codUsuario
        }),
        
        validateItem: (item: CalleData) => {
          return !!item.codigo && !!item.nombre && item.nombre.trim().length > 0;
        }
      },
      'calle_cache'
    );
  }
  
  static getInstance(): CalleApiService {
    if (!CalleApiService.instance) {
      CalleApiService.instance = new CalleApiService();
    }
    return CalleApiService.instance;
  }
  
  /**
   * Sobrescribir getAll para usar el endpoint de listado
   */
  async getAll<P extends QueryParams = QueryParams>(params?: P): Promise<CalleData[]> {
    try {
      console.log('📋 [CalleApiService] Obteniendo todas las vías');
      
      const searchParams = params as BusquedaCalleParams | undefined;
      // Usar el endpoint específico para listar
      const url = buildApiUrl('/api/via/listarVia');
      const queryParams = new URLSearchParams(searchParams as Record<string, string> || {});
      
      const response = await fetch(`${url}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json() as CalleApiResponse | RawCalle[];
      console.log('📋 [CalleApiService] Raw API response:', data);
      
      const itemsRaw = Array.isArray(data) ? data : (data.data || []);
      const items = (Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw]) as RawCalle[];
      console.log('📋 [CalleApiService] Items to normalize:', items);
      
      const normalized = this.normalizeData(items);
      console.log('📋 [CalleApiService] Normalized data:', normalized);
      
      return normalized;
    } catch (error) {
      console.error('❌ [CalleApiService] Error obteniendo vías:', error);
      throw error;
    }
  }
  
  /**
   * Crear nueva vía/calle
   */
  async create(data: CreateCalleDTO): Promise<CalleData> {
    try {
      console.log('📝 [CalleApiService] Creando vía con datos:', data);

      // Preparar payload en el orden correcto
      // Si codBarrio es 0 o undefined, enviar string vacío como en Postman
      const payload = {
        nombreVia: data.nombreVia,
        codTipoVia: data.codTipoVia,
        codBarrio: data.codBarrio && data.codBarrio > 0 ? data.codBarrio : "",
        codSector: data.codSector
      };

      console.log('📤 [CalleApiService] Payload a enviar:', payload);

      // Usar endpoint insertarVias
      const url = buildApiUrl('/api/via/insertarVias');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error al crear vía: ${response.status}`);
      }

      const responseData = await response.json() as RawCalle;
      console.log('✅ Respuesta del servidor:', responseData);

      // Crear objeto de respuesta
      const created: CalleData = {
        codVia: responseData.codVia || responseData.id || 0,
        codTipoVia: data.codTipoVia,
        codBarrio: data.codBarrio,
        codSector: data.codSector,
        nombreVia: data.nombreVia,
        descTipoVia: '',
        nombreBarrio: '',
        nombreSector: '',
        codigo: responseData.codVia || responseData.id || 0,
        nombre: data.nombreVia,
        codigoVia: data.codTipoVia,
        codigoBarrio: data.codBarrio,
        estado: 'ACTIVO',
        fechaRegistro: new Date().toISOString()
      };

      return created;

    } catch (error: unknown) {
      console.error('❌ [CalleApiService] Error creando vía:', error);
      throw error;
    }
  }
  
  /**
   * Actualizar vía usando el endpoint /api/via/actualizarVias
   */
  async update(id: number, data: UpdateCalleDTO): Promise<CalleData> {
    try {
      console.log('📝 [CalleApiService] Actualizando vía con ID:', id);
      console.log('📝 [CalleApiService] Datos a actualizar:', data);

      // Preparar payload según la estructura del API
      const payload = {
        codVia: id,
        nombreVia: data.nombreVia || '',
        codTipoVia: data.codTipoVia ? String(data.codTipoVia) : '',
        codBarrio: data.codBarrio || 0,
        codSector: data.codSector || 0
      };

      console.log('📤 [CalleApiService] Payload a enviar:', payload);

      // Usar endpoint actualizarVias
      const url = buildApiUrl('/api/via/actualizarVias');

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error al actualizar vía: ${response.status}`);
      }

      // const responseData = await response.json();
      // console.log('✅ Respuesta del servidor:', responseData);

      // Crear objeto de respuesta normalizado
      const updated: CalleData = {
        codVia: id,
        codTipoVia: payload.codTipoVia,
        codBarrio: payload.codBarrio,
        codSector: payload.codSector,
        nombreVia: payload.nombreVia,
        descTipoVia: '',
        nombreBarrio: '',
        nombreSector: '',
        codigo: id,
        nombre: payload.nombreVia,
        codigoVia: payload.codTipoVia,
        codigoBarrio: payload.codBarrio,
        estado: 'ACTIVO',
        fechaModificacion: new Date().toISOString()
      };

      return updated;

    } catch (error) {
      console.error('❌ [CalleApiService] Error actualizando vía:', error);
      throw error;
    }
  }
  

  /**
   * Buscar vías por nombre
   */
  async buscarPorNombreVia(nombre: string): Promise<CalleData[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/buscar`);
      const response = await fetch(`${url}?nombre=${encodeURIComponent(nombre)}`);
      if (!response.ok) return [];
      const res = await response.json() as CalleApiResponse | RawCalle[];
      const itemsRaw = Array.isArray(res) ? res : (res.data || []);
      const items = (Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw]) as RawCalle[];
      return this.normalizeData(items);
    } catch (error) {
      console.error('❌ [CalleApiService] Error buscando vías por nombre:', error);
      return [];
    }
  }

  /**
   * Buscar vías por nombre (método legacy)
   */
  async buscarPorNombre(nombre: string): Promise<CalleData[]> {
    try {
      // Usar la nueva API para búsquedas
      return await this.buscarPorNombreVia(nombre);
      
    } catch (error: unknown) {
      console.error('❌ [CalleApiService] Error buscando vías:', error);
      throw error;
    }
  }

  /**
   * Actualizar sector
   */
  async actualizarSector(sectorId: number, data: UpdateSectorDTO): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('📝 [CalleApiService] Actualizando sector:', sectorId, data);
      
      // En desarrollo, usar ruta relativa para que el proxy de Vite funcione
      const url = import.meta.env.DEV 
        ? `/api/sector/${sectorId}` 
        : buildApiUrl(`/api/sector/${sectorId}`);
      
      console.log('📡 URL para actualizar sector:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // NO Authorization - la API no requiere autenticación
        },
        body: JSON.stringify(data)
      });
      
      console.log('📡 Status:', response.status);
      const responseText = await response.text();
      console.log('📡 Response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Error al actualizar sector: ${response.status} - ${responseText}`);
      }
      
      // Manejar diferentes tipos de respuesta
      let responseData: { success: boolean; message?: string };
      try {
        responseData = responseText ? JSON.parse(responseText) : { success: true };
      } catch {
        // Si no es JSON válido, asumir éxito si status es OK
        responseData = { success: true, message: responseText };
      }
      
      console.log('✅ Sector actualizado exitosamente');
      return responseData;
      
    } catch (error: unknown) {
      console.error('❌ [CalleApiService] Error actualizando sector:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const calleService = CalleApiService.getInstance();
export default calleService;

// Exportar también la clase
export { CalleApiService };
