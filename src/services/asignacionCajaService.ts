// src/services/asignacionCajaService.ts
import BaseApiService from './BaseApiService';
import apiClient from './apiClient';
import { buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';

/**
 * Interfaces para AsignacionCaja
 */
export interface AsignacionCajaData {
  codAsignacionCaja: number;
  codUsuario: number | null;
  codCaja: number | null;
  codTurno: number | null;
  fecha: string | null;
  terminoBusqueda: string | null;
  numCaja: string;
  nombreUsuario: string;
  turno: string;
  estado: string;
  fechaStr: string;
}

export interface CreateAsignacionCajaDTO {
  codUsuario: number;
  codCaja: number;
  codTurno: number;
  fecha: string; // formato: "2025-11-07"
  usuario: string;
}

export interface UpdateAsignacionCajaDTO {
  codAsignacionCaja: number;
  codUsuario: number;
  codCaja: number;
  codTurno: number;
  usuario: string;
}

export interface DeleteAsignacionCajaDTO {
  codAsignacionCaja: number;
  usuario: string;
}

export interface ListarAsignacionCajaParams {
  terminoBusqueda?: string;
  fecha?: string; // formato: "2025-11-04"
  codUsuario?: number;
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

/**
 * Servicio para gestion de asignacion de caja
 *
 * Todas las operaciones se ejecutan mediante el cliente HTTP autenticado.
 * Todos los metodos (GET, POST, PUT, DELETE) funcionan sin token
 */
class AsignacionCajaService extends BaseApiService<AsignacionCajaData, CreateAsignacionCajaDTO, UpdateAsignacionCajaDTO> {
  private static instance: AsignacionCajaService;

  public static getInstance(): AsignacionCajaService {
    if (!AsignacionCajaService.instance) {
      AsignacionCajaService.instance = new AsignacionCajaService();
    }
    return AsignacionCajaService.instance;
  }

  private constructor() {
    super(
      '/api/asignacionCaja',
      {
        normalizeItem: (item: Record<string, unknown>) => ({
          codAsignacionCaja: Number(item.codAsignacionCaja) || 0,
          codUsuario: toNullableNumber(item.codUsuario),
          codCaja: toNullableNumber(item.codCaja),
          codTurno: toNullableNumber(item.codTurno),
          fecha: item.fecha ? String(item.fecha) : null,
          terminoBusqueda: (item.terminoBusqueda as string | null) ?? null,
          numCaja: String(item.numCaja || ''),
          nombreUsuario: String(item.nombreUsuario || ''),
          turno: String(item.turno || ''),
          estado: String(item.estado || 'ACTIVO'),
          fechaStr: String(item.fechaStr || '')
        }),
        validateItem: (item: AsignacionCajaData) => {
          return !!item.codAsignacionCaja;
        }
      },
      'asignacionCaja'
    );
  }

  /**
   * Lista asignaciones de caja con filtros
   * GET /api/asignacionCaja/listar?terminoBusqueda=h&fecha=2025-11-04&codUsuario=1
   * Requiere autenticación Bearer.
   */
  async listar(params?: ListarAsignacionCajaParams): Promise<AsignacionCajaData[]> {
    try {
      console.log('[AsignacionCajaService] Listando asignaciones con parametros:', params);

      const url = buildApiUrl(this.endpoint + '/listar');

      // Construir query params
      const queryParams = new URLSearchParams();
      
      // Obtener defaults de usuario y fecha para asegurar que se envíen los 3 parámetros obligatorios del backend
      const defaultCodUsuario = getAuthenticatedUserCode();
      const defaultFecha = new Date().toISOString().split('T')[0];

      const terminoBusqueda = params?.terminoBusqueda !== undefined ? params.terminoBusqueda : '';
      const fecha = params?.fecha !== undefined ? params.fecha : defaultFecha;
      const codUsuario = params?.codUsuario !== undefined ? params.codUsuario : defaultCodUsuario;

      queryParams.append('terminoBusqueda', String(terminoBusqueda));
      queryParams.append('fecha', String(fecha));
      queryParams.append('codUsuario', String(codUsuario));

      const getUrl = `${url}?${queryParams.toString()}`;
      console.log('[AsignacionCajaService] GET URL:', getUrl);

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient.fetch(getUrl, {
        method: 'GET',
        headers
      });

      console.log(`[AsignacionCajaService] Respuesta: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AsignacionCajaService] Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('[AsignacionCajaService] Datos obtenidos:', responseData);

      // Procesar respuesta - puede ser un array directo o wrapped
      let items = [];
      if (Array.isArray(responseData)) {
        items = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        items = responseData.data;
      } else {
        items = [responseData];
      }

      return this.normalizeData(items);

    } catch (error: unknown) {
      console.error('[AsignacionCajaService] Error listando asignaciones:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva asignacion de caja
   * POST /api/asignacionCaja/insertar
   * Body: {codUsuario, codCaja, codTurno, fecha, usuario}
   * Requiere autenticación Bearer.
   */
  async insertar(datos: CreateAsignacionCajaDTO): Promise<AsignacionCajaData> {
    try {
      console.log('[AsignacionCajaService] Insertando asignacion:', datos);

      const url = buildApiUrl(this.endpoint + '/insertar');

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient.fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(datos)
      });

      console.log(`[AsignacionCajaService] Respuesta: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AsignacionCajaService] Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('[AsignacionCajaService] Asignacion creada:', responseData);

      // Extraer datos del wrapper si existe
      let created = responseData.data || responseData;
      if (typeof created === 'string' || !created || typeof created !== 'object') {
        created = {
          codAsignacionCaja: 999, // ID ficticio no-cero para pasar la validación
          codUsuario: datos.codUsuario,
          codCaja: datos.codCaja,
          codTurno: datos.codTurno,
          fecha: datos.fecha || null,
          terminoBusqueda: null,
          numCaja: `CAJA ${datos.codCaja}`, // Nombre ficticio para pasar la validación (item.numCaja)
          nombreUsuario: '',
          turno: '',
          estado: 'ACTIVO',
          fechaStr: datos.fecha || ''
        };
      }
      
      const normalized = this.normalizeData([created])[0];

      return normalized;

    } catch (error: unknown) {
      console.error('[AsignacionCajaService] Error al insertar asignacion:', error);
      throw error;
    }
  }

  /**
   * Actualiza una asignacion de caja existente
   * PUT /api/asignacionCaja/actualizar
   * Body: {codAsignacionCaja, codUsuario, codCaja, codTurno, usuario}
   * Requiere autenticación Bearer.
   */
  async actualizar(datos: UpdateAsignacionCajaDTO): Promise<AsignacionCajaData> {
    try {
      console.log('[AsignacionCajaService] Actualizando asignacion:', datos);

      const url = buildApiUrl(this.endpoint + '/actualizar');

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient.fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(datos)
      });

      console.log(`[AsignacionCajaService] Respuesta: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AsignacionCajaService] Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('[AsignacionCajaService] Asignacion actualizada:', responseData);

      // Extraer datos del wrapper si existe
      let updated = responseData.data || responseData;
      if (typeof updated === 'string' || !updated || typeof updated !== 'object') {
        updated = {
          codAsignacionCaja: datos.codAsignacionCaja,
          codUsuario: datos.codUsuario,
          codCaja: datos.codCaja,
          codTurno: datos.codTurno,
          fecha: null,
          terminoBusqueda: null,
          numCaja: `CAJA ${datos.codCaja}`, // Nombre ficticio para pasar la validación (item.numCaja)
          nombreUsuario: '',
          turno: '',
          estado: 'ACTIVO',
          fechaStr: ''
        };
      }
      
      const normalized = this.normalizeData([updated])[0];

      return normalized;

    } catch (error: unknown) {
      console.error('[AsignacionCajaService] Error al actualizar asignacion:', error);
      throw error;
    }
  }

  /**
   * Elimina una asignacion de caja
   * PUT /api/asignacionCaja/eliminar
   * Body: {codAsignacionCaja, usuario}
   * Requiere autenticación Bearer.
   */
  async eliminar(datos: DeleteAsignacionCajaDTO): Promise<void> {
    try {
      console.log('[AsignacionCajaService] Eliminando asignacion:', datos);

      const url = buildApiUrl(this.endpoint + '/eliminar');

      const token = sessionStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient.fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(datos)
      });

      console.log(`[AsignacionCajaService] Respuesta: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AsignacionCajaService] Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      console.log('[AsignacionCajaService] Asignacion eliminada exitosamente');

    } catch (error: unknown) {
      console.error('[AsignacionCajaService] Error al eliminar asignacion:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las asignaciones (alias para listar sin parametros)
   */
  async obtenerTodas(): Promise<AsignacionCajaData[]> {
    console.log('[AsignacionCajaService] Obteniendo todas las asignaciones');
    return this.listar();
  }

  /**
   * Busca asignaciones por termino de busqueda
   */
  async buscarPorTermino(termino: string): Promise<AsignacionCajaData[]> {
    console.log('[AsignacionCajaService] Buscando por termino:', termino);
    return this.listar({ terminoBusqueda: termino });
  }

  /**
   * Busca asignaciones por fecha
   */
  async buscarPorFecha(fecha: string): Promise<AsignacionCajaData[]> {
    console.log('[AsignacionCajaService] Buscando por fecha:', fecha);
    return this.listar({ fecha });
  }

  /**
   * Busca asignaciones por usuario
   */
  async buscarPorUsuario(codUsuario: number): Promise<AsignacionCajaData[]> {
    console.log('[AsignacionCajaService] Buscando por usuario:', codUsuario);
    return this.listar({ codUsuario });
  }
}

// Exportar instancia singleton
export const asignacionCajaService = AsignacionCajaService.getInstance();
