// src/services/BaseApiService.ts

import { API_CONFIG } from '../config/api.unified.config';
import { NotificationService } from '../components/utils/Notification';
import apiClient, { ApiClientError as ApiError, getApiErrorMessage } from './apiClient';

export { ApiClientError as ApiError } from './apiClient';

/**
 * Tipos base para los servicios
 */
export interface NormalizeOptions<T, RawT = Record<string, unknown>> {
  normalizeItem: (item: RawT, index: number) => T;
  validateItem?: (item: T, index: number) => boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  mensaje?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

const RETRYABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

const isRetryableError = (
  error: unknown,
  method: string,
  externalSignal?: AbortSignal | null
): boolean => {
  if (!RETRYABLE_METHODS.has(method) || externalSignal?.aborted) {
    return false;
  }

  if (error instanceof ApiError) {
    return RETRYABLE_STATUS_CODES.has(error.statusCode);
  }

  if (error instanceof TypeError) {
    return true;
  }

  return error instanceof DOMException && (
    error.name === 'AbortError' || error.name === 'TimeoutError'
  );
};

/**
 * Clase base para todos los servicios de API
 * Incluye el token Bearer en las operaciones protegidas.
 */
export default abstract class BaseApiService<T, CreateDTO = unknown, UpdateDTO = unknown, RawT = Record<string, unknown>> {
  protected endpoint: string;
  protected normalizeOptions: NormalizeOptions<T, RawT>;
  
  constructor(
    endpoint: string,
    normalizeOptions: NormalizeOptions<T, RawT>,
    _serviceKey?: string
  ) {
    this.endpoint = endpoint;
    this.normalizeOptions = normalizeOptions;
    
    console.log(`🔧 [${this.constructor.name}] Inicializado:`);
    console.log(`  - Endpoint: "${this.endpoint}"`);
    console.log(`  - Autenticación: Bearer`);
  }

  /**
   * Realiza una petición HTTP autenticada.
   */
  protected async makeRequest<R>(
    path: string = '',
    options: RequestInit = {},
    retries: number = API_CONFIG.retries
  ): Promise<R> {
    const method = (options.method || 'GET').toUpperCase();
    const finalHeaders = new Headers(options.headers);
    finalHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    finalHeaders.set('Pragma', 'no-cache');
    finalHeaders.set('Expires', '0');

    const finalOptions: RequestInit = {
      ...options,
      method,
      headers: finalHeaders
    };

    const maxRetries = RETRYABLE_METHODS.has(method) ? Math.max(0, retries) : 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiClient.request<R>(this.endpoint + path, finalOptions);
      } catch (error: unknown) {
        console.error(`❌ [${this.constructor.name}] Error en intento ${attempt + 1}:`, error);

        const canRetry = attempt < maxRetries && isRetryableError(error, method, options.signal);
        if (!canRetry) {
          throw error;
        }

        const retryDelay = Math.min(1000 * 2 ** attempt, 5000);
        console.warn(
          `⚠️ [${this.constructor.name}] Error transitorio en ${method}. ` +
          `Reintentando en ${retryDelay} ms (${attempt + 1}/${maxRetries})`
        );
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    throw new Error('Máximo de reintentos alcanzado');
  }

  /**
   * Normalizar datos según las opciones de normalización
   */
  protected normalizeData(data: RawT[]): T[] {
    if (!Array.isArray(data)) {
      console.warn(`⚠️ [${this.constructor.name}] Datos no son un array:`, data);
      return [];
    }

    const normalized = data.map((item, index) => 
      this.normalizeOptions.normalizeItem(item, index)
    );

    if (this.normalizeOptions.validateItem) {
      const validItems = normalized.filter((item, index) => {
        const isValid = this.normalizeOptions.validateItem!(item, index);
        if (!isValid) {
          console.warn(`⚠️ [${this.constructor.name}] Item ${index} no válido`);
        }
        return isValid;
      });
      
      console.log(`✅ [${this.constructor.name}] ${validItems.length}/${normalized.length} items válidos`);
      return validItems;
    }

    return normalized;
  }

  // ========================================
  // MÉTODOS CRUD AUTENTICADOS
  // ========================================

  /**
   * Obtener todos los registros
   */
  public async getAll<P extends QueryParams = QueryParams>(params?: P): Promise<T[]> {
    try {
      const queryString = params ? `?${new URLSearchParams(params as unknown as Record<string, string>).toString()}` : '';
      const response = await this.makeRequest<ApiResponse<RawT[]> | RawT[]>(queryString, {
        method: 'GET'
      });
      
      const data = Array.isArray(response) ? response : (response as ApiResponse<RawT[]>).data || [];
      const normalized = this.normalizeData(data as RawT[]);
      
      return normalized;
    } catch (error) {
      console.error(`❌ [${this.constructor.name}] Error obteniendo todos:`, error);
      throw error;
    }
  }

  /**
   * Obtener por ID
   */
  public async getById(id: string | number): Promise<T | null> {
    try {
      const response = await this.makeRequest<ApiResponse<RawT> | RawT>(`/${id}`, {
        method: 'GET'
      });
      const data = (response as ApiResponse<RawT>).data || response;
      const normalized = this.normalizeData([data as RawT])[0];
      
      return normalized || null;
    } catch (error: unknown) {
      if ((error as ApiError).statusCode === 404) {
        return null;
      }
      console.error(`❌ [${this.constructor.name}] Error obteniendo por ID:`, error);
      throw error;
    }
  }

  /**
   * Crear nuevo registro
   */
  public async create(data: CreateDTO): Promise<T> {
    try {
      console.log('➕ [BaseApiService] Creando:', data);
      
      const response = await this.makeRequest<ApiResponse<RawT> | RawT>('', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      const created = (response as ApiResponse<RawT>).data || response;
      const normalized = this.normalizeData([created as RawT])[0];
      
      NotificationService.success('Registro creado exitosamente');
      
      return normalized;
    } catch (error: unknown) {
      console.error('❌ [BaseApiService] Error al crear:', error);
      NotificationService.error(getApiErrorMessage(error, 'Error al crear el registro'));
      throw error;
    }
  }

  /**
   * Actualizar registro
   */
  public async update(id: string | number, data: UpdateDTO): Promise<T> {
    try {
      console.log('📝 [BaseApiService] Actualizando:', id, data);
      
      const response = await this.makeRequest<ApiResponse<RawT> | RawT>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      const updated = (response as ApiResponse<RawT>).data || response;
      const normalized = this.normalizeData([updated as RawT])[0];
      
      NotificationService.success('Registro actualizado exitosamente');
      
      return normalized;
    } catch (error: unknown) {
      console.error('❌ [BaseApiService] Error al actualizar:', error);
      NotificationService.error(getApiErrorMessage(error, 'Error al actualizar el registro'));
      throw error;
    }
  }

  /**
   * Eliminar registro
   */
  public async delete(id: string | number): Promise<void> {
    try {
      console.log('🗑️ [BaseApiService] Eliminando:', id);
      
      await this.makeRequest(`/${id}`, {
        method: 'PUT'
      });
      
      NotificationService.success('Registro eliminado exitosamente');
      
    } catch (error: unknown) {
      console.error('❌ [BaseApiService] Error al eliminar:', error);
      NotificationService.error(getApiErrorMessage(error, 'Error al eliminar el registro'));
      throw error;
    }
  }

  /**
   * Buscar registros
   */
  public async search(params: Record<string, string | number | boolean | undefined>): Promise<T[]> {
    try {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const response = await this.makeRequest<ApiResponse<RawT[]> | RawT[]>(`?${queryString}`, {
        method: 'GET'
      });
      
      const data = Array.isArray(response) ? response : (response as ApiResponse<RawT[]>).data || [];
      return this.normalizeData(data);
      
    } catch (error) {
      console.error(`❌ [${this.constructor.name}] Error en búsqueda:`, error);
      throw error;
    }
  }
}
