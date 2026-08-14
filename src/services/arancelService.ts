// src/services/arancelService.ts
import BaseApiService from './BaseApiService';
import { buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';
import { NotificationService } from '../components/utils/Notification';

/**
 * IMPORTANTE: Esta API acepta tanto form-data como query parameters.
 * Desde el navegador SOLO podemos usar query parameters en GET.
 * Las peticiones GET NO requieren autenticación.
 */

export interface ArancelData {
  codArancel: number | null;
  anio: number;
  codDireccion: number;
  costo: number | null;
  codUsuario: number | null;
  costoArancel: number;
  direccionCompleta: string;
  sector: string;
  barrio: string;
  calle: string;
}

export interface CreateArancelDTO {
  anio: number;
  codDireccion: number;
  costoArancel: number;
  codUsuario?: number;
}

// DTO específico para la API POST sin autenticación usando JSON
export interface CrearArancelApiDTO {
  codArancel?: null; // Se asigna por SQL
  anio: number;
  codDireccion: number;
  costo: number;
  codUsuario: number;
}

// DTO específico para la API PUT sin autenticación usando JSON
export interface ActualizarArancelApiDTO {
  codArancel: number; // ID del arancel a actualizar
  anio: number;
  codDireccion: number;
  costo: number;
  codUsuario: number;
}

export interface ArancelRaw {
  codArancel: number | null;
  anio: number;
  codDireccion: number;
  costo: number | null;
  codUsuario: number | null;
  costoArancel: string | number | null;
  direccionCompleta: string;
  sector: string | null;
  barrio: string | null;
  calle: string | null;
}

export type UpdateArancelDTO = Partial<CreateArancelDTO>;

export interface ArancelResponse {
  success: boolean;
  message: string;
  data: ArancelRaw[];
  pagina: number | null;
  limite: number | null;
  totalPaginas: number | null;
  totalRegistros: number | null;
}

class ArancelService extends BaseApiService<ArancelData, CreateArancelDTO, UpdateArancelDTO, ArancelRaw> {
  private static instance: ArancelService;
  
  private constructor() {
    super(
      '/api/arancel',
      {
        normalizeItem: (item: ArancelRaw) => {
          const cod = item.codArancel !== undefined && item.codArancel !== null 
            ? item.codArancel 
            : ((item as any).id !== undefined && (item as any).id !== null 
              ? (item as any).id 
              : ((item as any).idArancel !== undefined && (item as any).idArancel !== null 
                ? (item as any).idArancel 
                : null));
          return {
            codArancel: cod,
            anio: item.anio || new Date().getFullYear(),
            codDireccion: item.codDireccion || 0,
            costo: item.costo !== undefined ? item.costo : null,
            codUsuario: item.codUsuario !== undefined ? item.codUsuario : null,
            costoArancel: parseFloat(String(item.costoArancel || item.costo || '0')),
            direccionCompleta: item.direccionCompleta || '',
            sector: item.sector !== undefined && item.sector !== null ? item.sector : '',
            barrio: item.barrio !== undefined && item.barrio !== null ? item.barrio : '',
            calle: item.calle !== undefined && item.calle !== null ? item.calle : ''
          };
        },
        
        validateItem: (item: ArancelData) => {
          return !!(
            item.anio && 
            item.codDireccion && 
            item.costoArancel >= 0
          );
        }
      },
      'arancel'
    );
  }
  
  static getInstance(): ArancelService {
    if (!ArancelService.instance) {
      ArancelService.instance = new ArancelService();
    }
    return ArancelService.instance;
  }

  /**
   * Lista aranceles usando query params - NO requiere autenticación
   * URL: GET /api/arancel?codDireccion=&anio=&parametroBusqueda=a&codUsuario=1
   */
  async listarArancelesGeneral(params?: {
    codDireccion?: number;
    anio?: number;
    parametroBusqueda?: string;
    codUsuario?: number;
  }): Promise<ArancelData[]> {
    try {
      console.log('🔍 [ArancelService] Listando aranceles con params:', params);

      // Construir parámetros de consulta
      const queryParams = new URLSearchParams();

      // codDireccion (opcional, vacío si no se proporciona)
      queryParams.set('codDireccion', params?.codDireccion !== undefined && params?.codDireccion > 0 ? params.codDireccion.toString() : '');

      // anio (opcional, vacío si no se proporciona)
      queryParams.set('anio', params?.anio !== undefined && params?.anio > 0 ? params.anio.toString() : '');

      // parametroBusqueda (opcional)
      queryParams.set('parametroBusqueda', params?.parametroBusqueda !== undefined ? params.parametroBusqueda : '');

      queryParams.set('codUsuario', getAuthenticatedUserCode().toString());
      
      const queryString = `?${queryParams.toString()}`;
      
      console.log('📡 [ArancelService] GET Query:', queryString);
      
      // Realizar petición GET sin autenticación usando makeRequest de BaseApiService
      const data = await this.makeRequest<ArancelRaw[] | ArancelResponse>(queryString, {
        method: 'GET'
      });
      
      console.log('✅ [ArancelService] Raw data recibida de API general:', data);
      
      // Procesar respuesta según la estructura
      let items: ArancelRaw[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        const response = data as ArancelResponse;
        if (response.data && Array.isArray(response.data)) {
          items = response.data;
        } else if (response.success !== undefined && response.data) {
          items = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          items = [data as unknown as ArancelRaw];
        }
      }
      
      console.log('✅ [ArancelService] Items para normalizar:', items);
      
      // Normalizar datos
      const normalized = this.normalizeData(items);
      
      console.log('✅ [ArancelService] Datos normalizados de API general:', normalized);
      return normalized;
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error listando aranceles con API general:', error);
      
      // En caso de error, devolver datos de fallback
      console.log('⚠️ [ArancelService] Usando datos de fallback por error');
      return this.getDatosFallback();
    }
  }

  /**
   * Obtiene todos los aranceles usando la nueva API
   * Para obtener todos, usa parametroBusqueda vacío y sin filtro de año
   */
  async obtenerTodosAranceles(): Promise<ArancelData[]> {
    console.log('📋 [ArancelService] Obteniendo todos los aranceles (sin filtro de año)');
    return this.listarArancelesGeneral({
      parametroBusqueda: 'a',
      codDireccion: undefined,
      anio: undefined, // NO pasar año para obtener de todos los años
      codUsuario: getAuthenticatedUserCode()
    });
  }

  /**
   * Sobrescribe el método getAll del BaseService para usar la nueva API
   */
  async getAll(): Promise<ArancelData[]> {
    return this.obtenerTodosAranceles();
  }

  /**
   * Datos de fallback para desarrollo cuando la API no está disponible
   */
  private getDatosFallback(): ArancelData[] {
    console.log('📋 [ArancelService] Generando datos de fallback');
    
    return [
      {
        codArancel: null,
        anio: 2025,
        codDireccion: 4,
        costo: null,
        codUsuario: null,
        costoArancel: 280.0,
        direccionCompleta: "AA.HH. Virgen de la puerta BARRIO barrio 178, CALLE proceres caidos, Cuadra 1, Lotes: 100 - 120",
        sector: "AA.HH. Virgen de la puerta",
        barrio: "barrio 178",
        calle: "proceres caidos"
      },
      {
        codArancel: null,
        anio: 2025,
        codDireccion: 5,
        costo: null,
        codUsuario: null,
        costoArancel: 350.0,
        direccionCompleta: "URBANIZACIÓN Los Pinos BARRIO barrio 200, CALLE las flores, Cuadra 2, Lotes: 200 - 250",
        sector: "URBANIZACIÓN Los Pinos",
        barrio: "barrio 200",
        calle: "las flores"
      },
      {
        codArancel: null,
        anio: 2025,
        codDireccion: 6,
        costo: null,
        codUsuario: null,
        costoArancel: 450.0,
        direccionCompleta: "PUEBLO JOVEN Santa Rosa BARRIO barrio 301, CALLE los jardines, Cuadra 3, Lotes: 300 - 350",
        sector: "PUEBLO JOVEN Santa Rosa",
        barrio: "barrio 301",
        calle: "los jardines"
      }
    ];
  }

  /**
   * Lista aranceles usando la nueva API con query params - NO requiere autenticación
   */
  async listarAranceles(params?: { 
    anio?: number; 
    codDireccion?: number; 
    codUsuario?: number;
    parametroBusqueda?: string;
  }): Promise<ArancelData[]> {
    try {
      console.log('🔍 [ArancelService] Listando aranceles con parámetros:', params);
      
      // Construir parámetros de consulta según la nueva API
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros según la nueva estructura
      queryParams.set('codDireccion', params?.codDireccion?.toString() || '');
      queryParams.set('anio', params?.anio?.toString() || '');
      queryParams.set('parametroBusqueda', params?.parametroBusqueda || 'a');
      queryParams.set('codUsuario', getAuthenticatedUserCode().toString());
      
      const queryString = `?${queryParams.toString()}`;
      
      console.log('📡 [ArancelService] GET Query:', queryString);
      
      const data = await this.makeRequest<ArancelRaw[] | ArancelResponse>(queryString, {
        method: 'GET'
      });
      
      console.log('✅ [ArancelService] Raw data recibida:', data);
      
      let items: ArancelRaw[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        const response = data as ArancelResponse;
        if (response.data && Array.isArray(response.data)) {
          items = response.data;
        } else if (response.success !== undefined && response.data) {
          items = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          items = [data as unknown as ArancelRaw];
        }
      }
      
      console.log('✅ [ArancelService] Items para normalizar:', items);

      // Normalizar datos
      const normalized = this.normalizeData(items);

      console.log('✅ [ArancelService] Datos normalizados:', normalized);
      return normalized;
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error listando aranceles:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un arancel por año y dirección - NO requiere autenticación
   */
  async obtenerPorAnioYDireccion(anio: number, codDireccion: number): Promise<ArancelData | null> {
    try {
      console.log('🔍 [ArancelService] Obteniendo arancel:', { anio, codDireccion });
      
      const params = new URLSearchParams({
        codDireccion: codDireccion.toString(),
        anio: anio.toString(),
        codUsuario: getAuthenticatedUserCode().toString()
      });
      
      const responseData = await this.makeRequest<ArancelResponse>(`?${params.toString()}`, {
        method: 'GET'
      });
      
      if (responseData.success && responseData.data) {
        const aranceles = this.normalizeData(Array.isArray(responseData.data) ? responseData.data : [responseData.data]);
        return aranceles.find(a => a.codDireccion === codDireccion && a.anio === anio) || null;
      }
      
      return null;
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error:', error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo arancel - POST puede usar FormData
   */
  async crearArancel(datos: CreateArancelDTO): Promise<ArancelData> {
    try {
      console.log('➕ [ArancelService] Creando arancel:', datos);
      
      const formData = new FormData();
      formData.append('anio', datos.anio.toString());
      formData.append('codDireccion', datos.codDireccion.toString());
      formData.append('costoArancel', (datos.costoArancel || 0).toString());
      formData.append('codUsuario', getAuthenticatedUserCode().toString());
      
      // FormData necesita que no se envíe Content-Type para que el navegador lo asigne
      // con el boundary correcto. makeRequest por defecto envía application/json.
      const response = await fetch(buildApiUrl(this.endpoint), {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const responseData: ArancelResponse = await response.json();
      
      if (responseData.success && responseData.data) {
        NotificationService.success('Arancel creado exitosamente');
        const aranceles = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
        return this.normalizeData(aranceles)[0];
      }
      
      throw new Error('Error al crear el arancel');
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error:', error);
      const message = error instanceof Error ? error.message : 'Error al crear el arancel';
      NotificationService.error(message);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo arancel usando POST sin autenticación con JSON
   */
  async crearArancelSinAuth(datos: CrearArancelApiDTO): Promise<ArancelData> {
    try {
      console.log('➕ [ArancelService] Creando arancel sin autenticación:', datos);
      
      // Validar que los datos requeridos estén presentes
      if (!datos.anio || !datos.codDireccion || datos.costo === undefined || !datos.codUsuario) {
        throw new Error('Faltan datos requeridos para crear el arancel');
      }

      // IMPORTANTE: Asegurar que codArancel siempre sea null
      const datosParaEnviar = {
        codArancel: null, // FORZAR a null - SQL lo asigna automáticamente
        anio: Number(datos.anio), 
        codDireccion: Number(datos.codDireccion),
        costo: Number(datos.costo),
        codUsuario: Number(datos.codUsuario)
      };

      const responseData = await this.makeRequest<ArancelRaw>('', {
        method: 'POST',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('✅ [ArancelService] Arancel creado exitosamente:', responseData);
      
      // Normalizar la respuesta
      const arancelCreado = this.normalizeData([responseData])[0];

      console.log('✅ [ArancelService] Arancel normalizado:', arancelCreado);
      return arancelCreado;
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error creando arancel sin auth:', error);
      throw error;
    }
  }

  /**
   * Helper para crear un arancel con valores por defecto
   */
  crearArancelConDefaults(datos: {
    anio: number;
    codDireccion: number;
    costo: number;
    codUsuario?: number;
  }): Promise<ArancelData> {
    const arancelCompleto: CrearArancelApiDTO = {
      codArancel: null,
      anio: datos.anio,
      codDireccion: datos.codDireccion,
      costo: datos.costo,
      codUsuario: getAuthenticatedUserCode()
    };

    console.log('🔨 [ArancelService] Helper - Creando con valores por defecto:', arancelCompleto);
    return this.crearArancelSinAuth(arancelCompleto);
  }

  /**
   * Actualiza un arancel - PUT requiere FormData (método original)
   */
  async actualizarArancel(codArancel: number, datos: UpdateArancelDTO): Promise<ArancelData> {
    try {
      console.log('📝 [ArancelService] Actualizando arancel:', codArancel, datos);
      
      const formData = new FormData();
      if (datos.anio !== undefined) formData.append('anio', datos.anio.toString());
      if (datos.codDireccion !== undefined) formData.append('codDireccion', datos.codDireccion.toString());
      if (datos.costoArancel !== undefined) formData.append('costoArancel', datos.costoArancel.toString());
      formData.append('codUsuario', getAuthenticatedUserCode().toString());
      
      const url = buildApiUrl(`${this.endpoint}/${codArancel}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const responseData: ArancelResponse = await response.json();
      
      if (responseData.success && responseData.data) {
        NotificationService.success('Arancel actualizado exitosamente');
        const aranceles = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
        return this.normalizeData(aranceles)[0];
      }
      
      throw new Error(responseData.message || 'Error al actualizar el arancel');
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error:', error);
      const message = error instanceof Error ? error.message : 'Error al actualizar el arancel';
      NotificationService.error(message);
      throw error;
    }
  }

  /**
   * Actualiza un arancel usando PUT sin autenticación con JSON
   */
  async actualizarArancelSinAuth(datos: ActualizarArancelApiDTO): Promise<ArancelData> {
    try {
      console.log('📝 [ArancelService] Actualizando arancel sin autenticación:', datos);
      
      if (!datos.codArancel || !datos.anio || !datos.codDireccion || datos.costo === undefined || !datos.codUsuario) {
        console.error('❌ [ArancelService] Validación fallida en actualizarArancelSinAuth:', {
          codArancel: datos.codArancel,
          anio: datos.anio,
          codDireccion: datos.codDireccion,
          costo: datos.costo,
          codUsuario: datos.codUsuario
        });
        throw new Error('Faltan datos requeridos para actualizar el arancel');
      }

      const datosParaEnviar = {
        codArancel: Number(datos.codArancel),
        anio: Number(datos.anio),
        codDireccion: Number(datos.codDireccion),
        costo: Number(datos.costo),
        codUsuario: Number(datos.codUsuario)
      };

      const responseData = await this.makeRequest<ArancelRaw>('', {
        method: 'PUT',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('✅ [ArancelService] Arancel actualizado exitosamente:', responseData);

      const arancelActualizado = this.normalizeData([responseData])[0];

      console.log('✅ [ArancelService] Arancel actualizado normalizado:', arancelActualizado);
      return arancelActualizado;
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error actualizando arancel sin auth:', error);
      throw error;
    }
  }
  
  /**
   * Elimina un arancel
   */
  async eliminarArancel(codArancel: number): Promise<void> {
    try {
      console.log('🗑️ [ArancelService] Eliminando arancel:', codArancel);
      
      await this.makeRequest(`/${codArancel}`, {
        method: 'PUT'
      });
      
      NotificationService.success('Arancel eliminado exitosamente');
      
    } catch (error: unknown) {
      console.error('❌ [ArancelService] Error:', error);
      const message = error instanceof Error ? error.message : 'Error al eliminar el arancel';
      NotificationService.error(message);
      throw error;
    }
  }
}

export const arancelService = ArancelService.getInstance();
export default arancelService;

// También exportar la clase para tests
export { ArancelService };
