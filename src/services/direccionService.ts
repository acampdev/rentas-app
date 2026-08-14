// src/services/direccionService.ts
import BaseApiService, { QueryParams } from './BaseApiService';
import { buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';

/**
 * Interface para los datos de dirección
 */
export interface DireccionData {
  id: number;
  codigo?: number;
  codigoSector?: number | null;
  codigoBarrio?: number | null;
  codigoCalle?: number | null;
  codigoTipoVia?: number;
  codigoBarrioVia?: number;
  nombreSector?: string;
  nombreBarrio?: string;
  nombreCalle?: string;
  nombreVia?: string;
  nombreTipoVia?: string;
  cuadra?: string;
  manzana?: string;
  lado?: string;
  loteInicial?: number;
  loteFinal?: number;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
  ruta?: number;
  zona?: number;
  rutaNombre?: string;
  zonaNombre?: string;
  ubicacionAreaVerde?: number | null;
  ubicacionAreaVerdeNombre?: string;
  codLado?: number | null;
}


export interface CreateDireccionDTO {
  codigoSector?: number | null;
  codigoBarrio?: number | null;
  codigoCalle?: number | null;  // codVia en el API
  cuadra?: number | null;       // Ahora es number en el API
  manzana?: string | null;
  lado?: string;                // Se convierte a codLado (8101=PAR, 8102=IMPAR, 8103=NINGUNO)
  loteInicial?: number | null;
  loteFinal?: number | null;
  descripcion?: string | null;
  codUsuario?: number;
  ruta?: number | null;         // codRuta en el API
  zona?: number | null;         // codZona en el API
  ubicacionAreaVerde?: number | null;  // codUbicacionAreaVerde en el API
}

export interface UpdateDireccionDTO extends Partial<CreateDireccionDTO> {
  estado?: string;
}

export interface BusquedaDireccionParams extends QueryParams {
  codigoSector?: number;
  codigoBarrio?: number;
  codigoCalle?: number;
  nombreVia?: string;
  parametrosBusqueda?: string;
  estado?: string;
  codUsuario?: number;
}

/**
 * Interfaz para los datos crudos que vienen del API
 */
export interface DireccionRaw {
  codDireccion?: number;
  id?: number;
  codSector?: number;
  codigoSector?: number;
  codBarrio?: number;
  codigoBarrio?: number;
  codVia?: number;
  codigoCalle?: number;
  codTipoVia?: number;
  codBarrioVia?: number;
  nombreSector?: string;
  nombreBarrio?: string;
  nombreVia?: string;
  nombreCalle?: string;
  nombreTipoVia?: string;
  cuadra?: string | number;
  manzana?: string | number;
  codLado?: number;
  loteInicial?: string;
  loteFinal?: string;
  direccionCompleta?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
  codRuta?: number;
  codZona?: number;
  ruta?: string;
  zona?: string;
  codUbicacionAreaVerde?: number;
  ubicacionAreaVerde?: string;
}

interface DireccionApiResponse {
  success: boolean;
  data: DireccionRaw | DireccionRaw[];
}

/**
 * Servicio para gestión de direcciones
 * NO requiere autenticación
 */
class DireccionService extends BaseApiService<DireccionData, CreateDireccionDTO, UpdateDireccionDTO, DireccionRaw> {
  private static instance: DireccionService;
  
  private constructor() {
    super(
      '/api/direccion',
      {
        normalizeItem: (item: DireccionRaw) => ({
          // Mapeo correcto basado en la respuesta real de la API
          id: item.codDireccion || item.id || 0,
          codigo: item.codDireccion || item.id || 0,
          codigoSector: item.codSector || item.codigoSector || 0,
          codigoBarrio: item.codBarrio || item.codigoBarrio || 0,
          codigoCalle: item.codVia || item.codigoCalle || 0,
          codigoTipoVia: item.codTipoVia || undefined,
          codigoBarrioVia: item.codBarrioVia || undefined,
          nombreSector: item.nombreSector || '',
          nombreBarrio: item.nombreBarrio || '',
          nombreCalle: item.nombreVia || item.nombreCalle || '',
          nombreVia: item.nombreVia || '',
          nombreTipoVia: item.nombreTipoVia || '',
          cuadra: item.cuadra?.toString() || '',
          manzana: item.manzana?.toString() || '',
          lado: item.codLado === 8101 ? 'PAR' : item.codLado === 8102 ? 'IMPAR' : 'NINGUNO',
          codLado: item.codLado || null,

          loteInicial: item.loteInicial ? parseInt(item.loteInicial) : undefined,
          loteFinal: item.loteFinal ? parseInt(item.loteFinal) : undefined,
          descripcion: item.direccionCompleta || 
            `${item.nombreTipoVia || 'CALLE'} ${item.nombreVia || ''} ${item.cuadra ? `CUADRA ${item.cuadra}` : ''}`.trim(),
          estado: item.estado || 'ACTIVO',
          fechaRegistro: item.fechaRegistro,
          fechaModificacion: item.fechaModificacion,
          codUsuario: item.codUsuario,
          ruta: item.codRuta || undefined,
          zona: item.codZona || undefined,
          rutaNombre: item.ruta || '',
          zonaNombre: item.zona || '',
          ubicacionAreaVerde: item.codUbicacionAreaVerde || undefined,
          ubicacionAreaVerdeNombre: item.ubicacionAreaVerde || ''
        }),
        
        validateItem: (item: DireccionData) => {
          // Validación mínima para aceptar más registros
          return !!item.id;
        }
      },
      'direccion_cache'
    );
  }
  
  /**
   * Obtiene la instancia singleton del servicio
   */
  static getInstance(): DireccionService {
    if (!DireccionService.instance) {
      DireccionService.instance = new DireccionService();
    }
    return DireccionService.instance;
  }
  
  /**
   * Sobrescribe el método getAll para manejar correctamente las peticiones sin autenticación
   */
  /**
   * Lista direcciones usando query params - NO requiere autenticación
   * URL: GET /api/direccion?parametrosBusqueda=b&codUsuario=3
   */
  async getAll(params?: BusquedaDireccionParams): Promise<DireccionData[]> {
    try {
      console.log('🔍 [DireccionService] Obteniendo todas las direcciones con params:', params);

      // Construir URL con query parameters
      const queryParams = new URLSearchParams();

      // parametrosBusqueda (por defecto 'a' para traer todas)
      queryParams.append('parametrosBusqueda', params?.parametrosBusqueda || 'a');

      // codUsuario siempre se envía (requerido)
      queryParams.append('codUsuario', String(getAuthenticatedUserCode()));

      // Endpoint: /api/direccion con query params
      const url = `${buildApiUrl(this.endpoint)}?${queryParams.toString()}`;
      console.log('📡 [DireccionService] GET:', url);
      console.log('📋 [DireccionService] Ejemplo: /api/direccion?parametrosBusqueda=b&codUsuario=3');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
          // NO requiere autenticación
        }
      });

      console.log('📡 [DireccionService] Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [DireccionService] Error Response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const responseData = await response.json() as DireccionApiResponse | DireccionRaw[];
      console.log('✅ [DireccionService] Datos recibidos:', responseData);

      // Manejar la estructura de respuesta con wrapper (success/data) - PRIMERO
      if (responseData && typeof responseData === 'object' && 'success' in responseData && responseData.success && responseData.data) {
        const data = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
        console.log('📊 [DireccionService] Usando estructura con wrapper, normalizando', data.length, 'direcciones');

        return this.normalizeRawData(data);
      }

      // Si la respuesta es directamente un array (sin wrapper)
      if (Array.isArray(responseData)) {
        console.log('📊 [DireccionService] Normalizando', responseData.length, 'direcciones (array directo)');
        return this.normalizeRawData(responseData);
      }

      console.log('⚠️ [DireccionService] Estructura de respuesta no reconocida, retornando array vacío');
      return [];
      
    } catch (error: unknown) {
      console.error('❌ [DireccionService] Error completo:', error);
      // NO lanzar el error, devolver array vacío para que el componente use datos de ejemplo
      return [];
    }
  }

  /**
   * Método privado para normalizar datos crudos
   */
  private normalizeRawData(data: DireccionRaw[]): DireccionData[] {
    return data.map((item) => {
      const id = item.codDireccion || item.id || 0;
      return {
        id: id,
        codigo: id,
        codigoSector: item.codSector || item.codigoSector || null,
        codigoBarrio: item.codBarrio || item.codigoBarrio || null,
        codigoCalle: item.codVia || item.codigoCalle || null,
        codigoTipoVia: item.codTipoVia || undefined,
        codigoBarrioVia: item.codBarrioVia || undefined,
        nombreSector: item.nombreSector || '',
        nombreBarrio: item.nombreBarrio || '',
        nombreCalle: item.nombreVia || item.nombreCalle || '',
        nombreVia: item.nombreVia || '',
        nombreTipoVia: item.nombreTipoVia || '',
        cuadra: item.cuadra !== null && item.cuadra !== undefined ? item.cuadra.toString() : '',
        manzana: item.manzana !== null && item.manzana !== undefined ? item.manzana.toString() : '',
        lado: item.codLado === 8101 ? 'PAR' : item.codLado === 8102 ? 'IMPAR' : item.codLado === 8103 ? 'NINGUNO' : '',
        codLado: item.codLado || null,

        loteInicial: item.loteInicial ? parseInt(item.loteInicial) : undefined,
        loteFinal: item.loteFinal ? parseInt(item.loteFinal) : undefined,
        descripcion: item.direccionCompleta || '',
        estado: 'ACTIVO',
        ruta: item.codRuta || undefined,
        zona: item.codZona || undefined,
        rutaNombre: item.ruta || '',
        zonaNombre: item.zona || '',
        ubicacionAreaVerde: item.codUbicacionAreaVerde || undefined,
        ubicacionAreaVerdeNombre: item.ubicacionAreaVerde || ''
      };
    });
  }
  
  /**
   * Obtiene todas las direcciones activas
   * URL: GET /api/direccion?parametrosBusqueda=a&codUsuario=3
   */
  async obtenerTodos(): Promise<DireccionData[]> {
    try {
      const params = {
        estado: 'ACTIVO',
        parametrosBusqueda: 'a',
        codUsuario: getAuthenticatedUserCode()
      };
      const direcciones = await this.getAll(params);
      console.log(`✅ [DireccionService] obtenerTodos: ${direcciones.length} direcciones`);
      return direcciones;
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      return [];
    }
  }
  
  /**
   * Busca direcciones con parámetros específicos
   * URL: GET /api/direccion?parametrosBusqueda=b&codUsuario=3
   */
  async buscar(params: BusquedaDireccionParams): Promise<DireccionData[]> {
    try {
      console.log('🔍 [DireccionService] Buscando direcciones:', params);

      const queryParams = new URLSearchParams();
      queryParams.append('parametrosBusqueda', params.parametrosBusqueda || params.nombreVia || 'a');
      queryParams.append('codUsuario', String(getAuthenticatedUserCode()));

      if (params.estado) {
        queryParams.append('estado', params.estado);
      }

      const url = `${buildApiUrl(this.endpoint)}?${queryParams.toString()}`;
      console.log('📡 [DireccionService] GET buscar:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.success && responseData.data) {
        const data = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
        return this.normalizeData(data);
      }
      
      return [];
      
    } catch (error) {
      console.error('Error al buscar direcciones:', error);
      return [];
    }
  }
  
  /**
   * Busca direcciones por nombre de vía
   */
  async buscarPorNombreVia(nombreVia: string): Promise<DireccionData[]> {
    try {
      if (!nombreVia || nombreVia.length < 1) {
        // Si no hay término de búsqueda, devolver todas
        return await this.obtenerTodos();
      }
      
      const params: BusquedaDireccionParams = {
        parametrosBusqueda: nombreVia.trim(),
        estado: 'ACTIVO'
      };
      
      return await this.buscar(params);
    } catch (error) {
      console.error('Error al buscar por nombre de vía:', error);
      return [];
    }
  }
  
  /**
   * Crea una nueva dirección
   * POST /api/direccion
   * JSON: { codSector, codBarrio, codVia, cuadra, manzana, codLado, loteInicial, loteFinal, codZona, codRuta, codUbicacionAreaVerde, parametroBusqueda, codUsuario }
   */
  async crearDireccion(datos: CreateDireccionDTO): Promise<DireccionData> {
    try {
      console.log('🔍 [DireccionService] Creando dirección con datos:', datos);

      // Validaciones
      if (datos.loteInicial && datos.loteFinal) {
        if (datos.loteInicial > datos.loteFinal) {
          throw new Error('El lote inicial no puede ser mayor al lote final');
        }
      }

      // Convertir lado a código (8101=PAR, 8102=IMPAR, 8103=NINGUNO/AMBOS)
      let codLado = 8103;
      if (datos.lado === 'PAR' || datos.lado === '8101') {
        codLado = 8101;
      } else if (datos.lado === 'IMPAR' || datos.lado === '8102') {
        codLado = 8102;
      }


      // Construir el request según el nuevo formato del API
      // Asegurar que todos los valores numéricos sean enteros
      const requestData = {
        codSector: (datos.codigoSector && datos.codigoSector > 0) ? Math.floor(Number(datos.codigoSector)) : null,
        codBarrio: (datos.codigoBarrio && datos.codigoBarrio > 0) ? Math.floor(Number(datos.codigoBarrio)) : null,
        codVia: (datos.codigoCalle && datos.codigoCalle > 0) ? Math.floor(Number(datos.codigoCalle)) : null,
        cuadra: datos.cuadra ? Math.floor(Number(datos.cuadra)) : null,
        manzana: datos.manzana && String(datos.manzana).trim() !== '' ? String(datos.manzana).trim() : null,
        codLado: Math.floor(Number(codLado)),
        loteInicial: (datos.loteInicial && datos.loteInicial > 0) ? Math.floor(Number(datos.loteInicial)) : null,
        loteFinal: (datos.loteFinal && datos.loteFinal > 0) ? Math.floor(Number(datos.loteFinal)) : null,
        codZona: datos.zona ? Math.floor(Number(datos.zona)) : null,
        codRuta: datos.ruta ? Math.floor(Number(datos.ruta)) : null,
        codUbicacionAreaVerde: datos.ubicacionAreaVerde ? Math.floor(Number(datos.ubicacionAreaVerde)) : null,
        parametroBusqueda: null,
        codUsuario: getAuthenticatedUserCode()
      };

      console.log('📡 [DireccionService] Enviando POST a:', buildApiUrl(this.endpoint));
      console.log('📡 [DireccionService] Datos a enviar:', requestData);

      const response = await fetch(buildApiUrl(this.endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('📡 [DireccionService] Response status:', response.status);
      console.log('📡 [DireccionService] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [DireccionService] Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      // Try to parse response
      let responseData: DireccionApiResponse | DireccionRaw | string | number;
      const contentType = response.headers.get('content-type');
      console.log('📡 [DireccionService] Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('📡 [DireccionService] Respuesta JSON parseada:', responseData);
      } else {
        // If response is not JSON, it might be a simple text or number (ID)
        const responseText = await response.text();
        console.log('📡 [DireccionService] Respuesta no JSON (texto):', responseText);

        // If we get a number, it's likely the ID of the created direccion
        const possibleId = parseInt(responseText);
        if (!isNaN(possibleId) && possibleId > 0) {
          console.log('✅ [DireccionService] ID de dirección creada:', possibleId);
          // Return a basic direccion object with the new ID
          return {
            id: possibleId,
            codigo: possibleId,
            codigoSector: datos.codigoSector,
            codigoBarrio: datos.codigoBarrio,
            codigoCalle: datos.codigoCalle,
            cuadra: datos.cuadra?.toString(),
            manzana: datos.manzana,
            lado: datos.lado,
            loteInicial: datos.loteInicial,
            loteFinal: datos.loteFinal,
            estado: 'ACTIVO'
          } as DireccionData;
        } else {
          // If it's just a success message or something else
          console.log('✅ [DireccionService] Respuesta exitosa (no numérica):', responseText);
          return {
            id: Date.now(),
            codigo: Date.now(),
            codigoSector: datos.codigoSector,
            codigoBarrio: datos.codigoBarrio,
            codigoCalle: datos.codigoCalle,
            cuadra: datos.cuadra?.toString(),
            manzana: datos.manzana,
            lado: datos.lado,
            loteInicial: datos.loteInicial,
            loteFinal: datos.loteFinal,
            estado: 'ACTIVO'
          } as DireccionData;
        }
      }

      // Handle different response structures
      if (responseData) {
        // IMPORTANTE: Verificar si la respuesta indica error (success: false)
        if (typeof responseData === 'object' && 'success' in responseData && responseData.success === false) {
          const errorMessage = (responseData.data as string) || 'Error al crear dirección';
          console.error('❌ [DireccionService] El servidor respondió con error:', errorMessage);
          throw new Error(errorMessage);
        }

        // If response has success and data properties
        if (typeof responseData === 'object' && 'success' in responseData && responseData.success && responseData.data) {
          console.log('✅ [DireccionService] Estructura con success/data');
          const data = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
          const normalized = this.normalizeRawData(data);
          if (normalized && normalized.length > 0) {
            return normalized[0];
          }
          console.warn('⚠️ [DireccionService] normalizeData devolvió array vacío, creando objeto manual');
        }

        // If response is directly the data
        if (typeof responseData === 'object' && ('codDireccion' in responseData || 'id' in responseData)) {
          console.log('✅ [DireccionService] Estructura directa con codDireccion/id');
          const normalized = this.normalizeRawData([responseData as DireccionRaw]);
          if (normalized && normalized.length > 0) {
            return normalized[0];
          }
          console.warn('⚠️ [DireccionService] normalizeData devolvió array vacío, creando objeto manual');
        }

        // If response is an array
        if (Array.isArray(responseData) && responseData.length > 0) {
          console.log('✅ [DireccionService] Estructura de array');
          const normalized = this.normalizeRawData(responseData);
          if (normalized && normalized.length > 0) {
            return normalized[0];
          }
          console.warn('⚠️ [DireccionService] normalizeData devolvió array vacío, creando objeto manual');
        }

        // If response has success: true (even without data)
        if (typeof responseData === 'object' && 'success' in responseData && responseData.success === true) {
          console.log('✅ [DireccionService] Respuesta con success: true (sin data explícita)');
          return {
            id: Date.now(),
            codigo: Date.now(),
            codigoSector: datos.codigoSector,
            codigoBarrio: datos.codigoBarrio,
            codigoCalle: datos.codigoCalle,
            cuadra: datos.cuadra?.toString(),
            manzana: datos.manzana,
            lado: datos.lado,
            loteInicial: datos.loteInicial,
            loteFinal: datos.loteFinal,
            estado: 'ACTIVO'
          } as DireccionData;
        }
      }

      // If we reach here but the status was OK, assume success
      console.log('✅ [DireccionService] Respuesta exitosa pero estructura no reconocida, asumiendo éxito');
      return {
        id: Date.now(), // Temporary ID
        codigo: Date.now(),
        codigoSector: datos.codigoSector,
        codigoBarrio: datos.codigoBarrio,
        codigoCalle: datos.codigoCalle,
        cuadra: datos.cuadra?.toString(),
        manzana: datos.manzana,
        lado: datos.lado,
        loteInicial: datos.loteInicial,
        loteFinal: datos.loteFinal,
        estado: 'ACTIVO'
      } as DireccionData;
      
    } catch (error: unknown) {
      const err = error as Error;
      console.error('❌ [DireccionService] Error al crear dirección:', error);
      console.error('❌ [DireccionService] Error message:', err?.message);
      console.error('❌ [DireccionService] Error stack:', err?.stack);
      throw new Error(`Error al crear dirección: ${err?.message || 'Error desconocido'}`);
    }
  }
  
  /**
   * Actualiza una dirección existente
   * PUT /api/direccion
   * Soporta dos formatos: con barrio y sin barrio
   */
  async actualizarDireccion(id: number, datos: UpdateDireccionDTO): Promise<DireccionData> {
    try {
      console.log('🔍 [DireccionService] Actualizando dirección:', id, datos);

      if (datos.loteInicial && datos.loteFinal) {
        if (datos.loteInicial > datos.loteFinal) {
          throw new Error('El lote inicial no puede ser mayor al lote final');
        }
      }

      // Convertir lado a código (8101=PAR, 8102=IMPAR, 8103=NINGUNO/AMBOS)
      let codLado = 8103;
      if (datos.lado === 'PAR' || datos.lado === '8101') {
        codLado = 8101;
      } else if (datos.lado === 'IMPAR' || datos.lado === '8102') {
        codLado = 8102;
      }


      // Determinar si tiene barrio o no
      const tieneBarrio = datos.codigoBarrio && datos.codigoBarrio > 0;

      let requestData: Record<string, unknown>;

      if (tieneBarrio) {
        // Método PUT con Barrio
        requestData = {
          codDireccion: id,
          codSector: null,
          codBarrio: datos.codigoBarrio,
          codVia: (datos.codigoCalle && datos.codigoCalle > 0) ? datos.codigoCalle : null,
          cuadra: datos.cuadra || null,
          manzana: datos.manzana && datos.manzana.trim() !== '' ? datos.manzana.trim() : null,
          codLado: codLado,
          loteInicial: (datos.loteInicial && datos.loteInicial > 0) ? datos.loteInicial : null,
          loteFinal: (datos.loteFinal && datos.loteFinal > 0) ? datos.loteFinal : null,
          codZona: datos.zona || null,
          codRuta: datos.ruta || null,
          codUbicacionAreaVerde: datos.ubicacionAreaVerde || null,
          parametroBusqueda: null,
          codUsuario: getAuthenticatedUserCode()
        };
      } else {
        // Método PUT sin Barrio
        requestData = {
          codDireccion: id,
          codSector: (datos.codigoSector && datos.codigoSector > 0) ? datos.codigoSector : null,
          codBarrio: null,
          codVia: (datos.codigoCalle && datos.codigoCalle > 0) ? datos.codigoCalle : null,
          cuadra: datos.cuadra || null,
          manzana: datos.manzana && datos.manzana.trim() !== '' ? datos.manzana.trim() : null,
          codLado: codLado,
          loteInicial: (datos.loteInicial && datos.loteInicial > 0) ? datos.loteInicial : null,
          loteFinal: (datos.loteFinal && datos.loteFinal > 0) ? datos.loteFinal : null,
          codZona: datos.zona || null,
          codRuta: datos.ruta || null,
          codUbicacionAreaVerde: datos.ubicacionAreaVerde || null,
          parametroBusqueda: null,
          codUsuario: getAuthenticatedUserCode()
        };
      }

      console.log('📡 [DireccionService] Enviando PUT a:', buildApiUrl(this.endpoint));
      console.log('📡 [DireccionService] Tipo:', tieneBarrio ? 'CON BARRIO' : 'SIN BARRIO');
      console.log('📡 [DireccionService] Datos a enviar:', requestData);

      const response = await fetch(buildApiUrl(this.endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      // Try to parse response
      let responseData: DireccionApiResponse | DireccionRaw | null;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // If response is not JSON, assume success
        const responseText = await response.text();
        console.log('📡 [DireccionService] Respuesta no JSON:', responseText);

        return {
          id: id,
          codigo: id,
          codigoSector: datos.codigoSector || 0,
          codigoBarrio: datos.codigoBarrio || 0,
          codigoCalle: datos.codigoCalle || 0,
          cuadra: datos.cuadra?.toString(),
          manzana: datos.manzana,
          lado: datos.lado,
          loteInicial: datos.loteInicial,
          loteFinal: datos.loteFinal,
          estado: datos.estado || 'ACTIVO'
        } as DireccionData;
      }

      console.log('📡 [DireccionService] Respuesta recibida:', responseData);

      if (responseData) {
        // Verificar si la respuesta indica error (success: false)
        if (typeof responseData === 'object' && 'success' in responseData && responseData.success === false) {
          const errorMessage = (responseData.data as string) || 'Error al actualizar dirección';
          throw new Error(errorMessage);
        }

        // Si la respuesta tiene success y data
        if (typeof responseData === 'object' && 'success' in responseData && responseData.success && responseData.data) {
          const data = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
          return this.normalizeRawData(data)[0];
        }

        // Si la respuesta tiene la data directamente
        if (typeof responseData === 'object' && ('codDireccion' in responseData || 'id' in responseData)) {
          return this.normalizeRawData([responseData as DireccionRaw])[0];
        }

        // Si la respuesta es un array
        if (Array.isArray(responseData) && responseData.length > 0) {
          return this.normalizeRawData(responseData)[0];
        }

        // Si la respuesta tiene success: true (sin data explícita)
        if (typeof responseData === 'object' && 'success' in responseData && responseData.success === true) {
          console.log('✅ [DireccionService] Respuesta PUT con success: true (sin data explícita)');
        }
      }

      // Fallback: Si la respuesta fue ok, asumir éxito y devolver objeto mapeado
      console.log('✅ [DireccionService] Respuesta PUT exitosa pero estructura no estándar, retornando objeto manual');
      return {
        id: id,
        codigo: id,
        codigoSector: datos.codigoSector || null,
        codigoBarrio: datos.codigoBarrio || null,
        codigoCalle: datos.codigoCalle || null,
        cuadra: datos.cuadra?.toString(),
        manzana: datos.manzana,
        lado: datos.lado,
        loteInicial: datos.loteInicial || undefined,
        loteFinal: datos.loteFinal || undefined,
        estado: datos.estado || 'ACTIVO'
      } as DireccionData;

    } catch (error) {
      console.error('Error al actualizar dirección:', error);
      throw error;
    }
  }
  
  /**
   * Elimina una dirección (cambio de estado lógico)
   */
  async eliminarDireccion(id: number): Promise<void> {
    try {
      await this.actualizarDireccion(id, {
        estado: 'INACTIVO'
      });
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      throw error;
    }
  }
}

export const direccionService = DireccionService.getInstance();
export default direccionService;
