// src/services/predioService.ts
import BaseApiService from './BaseApiService';
import { getAuthenticatedUserCode } from '../config/api.unified.config';


/**
 * Mapea la respuesta de la API al modelo interno
 */

export interface PredioData {
  anio?: number;
  codPredio?: string;
  codPredioBase?: string;
  numeroFinca?: string | null;
  otroNumero?: string | null;
  codClasificacion?: string | null;
  estPredio?: string | null;
  codTipoPredio?: string | null;
  codCondicionPropiedad?: string | null;
  codDireccion?: string | null;
  codUsoPredio?: string | null;
  fechaAdquisicion?: string | null;
  numeroCondominos?: string;
  codListaConductor?: string;
  codUbicacionAreaVerde?: string | null;
  areaTerreno?: number;
  numeroPisos?: number;
  totalAreaConstruccion?: number | null;
  valorTotalConstruccion?: number | null;
  valorTerreno?: number | null;
  valorOtrasInstalaciones?: number | null;
  autoavaluo?: number;
  codEstado?: string | null;
  rutaImagenPlano?: string | null;
  codUsuario?: number | null;
  direccion?: string;
  conductor?: string;
  estadoPredio?: string;
  condicionPropiedad?: string;
  codGrupoUso?: number | null;
  descripcionUso?: string | null;
  parametroBusqueda?: string | null;
  nombreSectorCompleto?: string;
  costoArancel?: number | null;
}
/**
 * DTO para crear predios según la estructura exacta del API
 * URL: POST /api/predio
 */
export interface CreatePredioDTO {
  anio: number;
  codPredio: null; // Se asigna por SQL automáticamente
  numeroFinca: number;
  otroNumero: string;
  codClasificacion: string;
  estPredio: string;
  codTipoPredio: string;
  codCondicionPropiedad: string;
  codDireccion: number;
  codUsoPredio: number | null; // null para clasificación "Casa habitación" (0501)
  fechaAdquisicion: string; // Formato "YYYY-MM-DD"
  numeroCondominos: number;
  codListaConductor: string;
  codUbicacionAreaVerde: number;
  areaTerreno: number;
  totalAreaConstruccion: number | null;
  valorTotalConstruccion: number | null;
  valorTerreno: number | null;
  autoavaluo: number | null;
  codEstado: string;
  codUsuario: number;
}

export interface BusquedaPredioParams {
  codPredio?: string;
  anio?: number;
  direccion?: number;
  codPredioBase?: string;
  parametroBusqueda?: string;
}

/**
 * Interfaz para los datos crudos que vienen del API de Predio
 */
export interface PredioRaw {
  anio?: number;
  codPredio?: string;
  codPredioBase?: string | number;
  numeroFinca?: string | number | null;
  otroNumero?: string | null;
  codClasificacion?: string | number | null;
  estPredio?: string | null;
  codTipoPredio?: string | number | null;
  codCondicionPropiedad?: string | number | null;
  codDireccion?: string | number | null;
  codUsoPredio?: string | number | null;
  codUso?: string | number | null;
  fechaAdquisicion?: string | null;
  fechaAdquisicionStr?: string | null;
  numeroCondominos?: string | number;
  codListaConductor?: string | number;
  codUbicacionAreaVerde?: string | number | null;
  areaTerreno?: string | number;
  numeroPisos?: string | number;
  totalAreaConstruccion?: string | number | null;
  areaTotalConstruida?: string | number | null;
  valorTotalConstruccion?: string | number | null;
  valorTerreno?: string | number | null;
  valorOtrasInstalaciones?: string | number | null;
  autoavaluo?: string | number | null;
  codEstado?: string | null;
  codEstadoPredio?: string | null;
  rutaImagenPlano?: string | null;
  codUsuario?: number | null;
  direccion?: string;
  conductor?: string;
  estadoPredio?: string;
  condicionPropiedad?: string;
  codGrupoUso?: number | null;
  descripcionUso?: string | null;
  parametroBusqueda?: string | null;
  nombreSectorCompleto?: string;
  costoArancel?: string | number | null;
}

/**
 * Servicio para gestión de predios con form-data
 */
class PredioService extends BaseApiService<PredioData, CreatePredioDTO, Partial<CreatePredioDTO>, PredioRaw> {
  private static instance: PredioService;
  
  private constructor() {
    super(
      '/api/predio',
      {
        normalizeItem: (item: PredioRaw) => {
          const totalAreaConstruccion = item.totalAreaConstruccion ?? item.areaTotalConstruida;
          // Debug: Ver valores crudos del API
          if (process.env.NODE_ENV === 'development') {
            console.log('[PredioService] Normalizando item:', {
              codPredio: item.codPredio,
              codPredioBase: item.codPredioBase,
              raw: item
            });
          }
          return {
            anio: item.anio,
            codPredio: item.codPredio || undefined,
            codPredioBase: item.codPredioBase?.toString() || undefined,
            numeroFinca: item.numeroFinca?.toString() || null,
            otroNumero: item.otroNumero,
            codClasificacion: item.codClasificacion?.toString() || null,
            estPredio: item.estPredio,
            codTipoPredio: item.codTipoPredio?.toString() || null,
            codCondicionPropiedad: item.codCondicionPropiedad?.toString() || null,
            codDireccion: item.codDireccion?.toString() || null,
            codUsoPredio: (item.codUsoPredio ?? item.codUso)?.toString() || null,
            fechaAdquisicion: item.fechaAdquisicion || item.fechaAdquisicionStr,
            numeroCondominos: item.numeroCondominos?.toString(),
            codListaConductor: item.codListaConductor?.toString(),
            codUbicacionAreaVerde: item.codUbicacionAreaVerde?.toString() || null,
            areaTerreno: parseFloat(item.areaTerreno?.toString() || '0'),
            numeroPisos: typeof item.numeroPisos === 'string' ? parseInt(item.numeroPisos) : item.numeroPisos,
            totalAreaConstruccion: totalAreaConstruccion == null
              ? totalAreaConstruccion
              : Number(totalAreaConstruccion),
            valorTotalConstruccion: typeof item.valorTotalConstruccion === 'string' ? parseFloat(item.valorTotalConstruccion) : item.valorTotalConstruccion,
            valorTerreno: typeof item.valorTerreno === 'string' ? parseFloat(item.valorTerreno) : item.valorTerreno,
            valorOtrasInstalaciones: typeof item.valorOtrasInstalaciones === 'string' ? parseFloat(item.valorOtrasInstalaciones) : item.valorOtrasInstalaciones,
            autoavaluo: typeof item.autoavaluo === 'string' ? parseFloat(item.autoavaluo) : (item.autoavaluo || undefined),
            codEstado: item.codEstado || item.codEstadoPredio,
            rutaImagenPlano: item.rutaImagenPlano,
            codUsuario: item.codUsuario || null,
            direccion: item.direccion,
            conductor: item.conductor,
            estadoPredio: item.estadoPredio,
            condicionPropiedad: item.condicionPropiedad,
            codGrupoUso: item.codGrupoUso,
            descripcionUso: item.descripcionUso,
            parametroBusqueda: item.parametroBusqueda,
            nombreSectorCompleto: item.nombreSectorCompleto,
            costoArancel: typeof item.costoArancel === 'string' ? parseFloat(item.costoArancel) : item.costoArancel,
          };
        },

          validateItem: (item: PredioData) => {
          return !!(
            item.codPredio &&
            item.areaTerreno !== undefined && item.areaTerreno >= 0
          );
        }
      },
      'predios'
    );
  }
  
  public static getInstance(): PredioService {
    if (!PredioService.instance) {
      PredioService.instance = new PredioService();
    }
    return PredioService.instance;
  }


  
  /**
   * Obtiene todos los predios usando el endpoint /all
   * GET: /api/predio/all
   */
  async obtenerTodosPredios(): Promise<PredioData[]> {
    try {
      console.log('📋 [PredioService] Obteniendo todos los predios desde /all');

      const responseData = await this.makeRequest<PredioRaw[] | { data: PredioRaw[], success: boolean }>('/all', {
        method: 'GET'
      });
      
      // La respuesta puede ser un array directo o un objeto con data
      let predios: PredioRaw[] = [];

      if (Array.isArray(responseData)) {
        predios = responseData;
      } else if (responseData && typeof responseData === 'object') {
        const resp = responseData as { data: PredioRaw[], success: boolean };
        if (resp.success && Array.isArray(resp.data)) {
          predios = resp.data;
        } else if (resp.data) {
          predios = Array.isArray(resp.data) ? resp.data : [resp.data as unknown as PredioRaw];
        }
      }

      return this.normalizeData(predios);

    } catch (error: unknown) {
      console.error('❌ [PredioService] Error al obtener todos los predios:', error);
      throw error;
    }
  }

  /**
   * Busca predios con filtros específicos
   * GET: /api/predio/all?codPredioBase=30&anio=2026
   */
  async buscarPrediosConFiltros(params: BusquedaPredioParams): Promise<PredioData[]> {
    try {
      console.log('🔍 [PredioService] Buscando predios con filtros:', params);

      const queryParams = new URLSearchParams();
      queryParams.append('codPredioBase', params.codPredioBase || '');
      queryParams.append('anio', (params.anio || new Date().getFullYear()).toString());

      const queryString = `/all?${queryParams.toString()}`;
      console.log('📡 [PredioService] GET Query:', queryString);

      const responseData = await this.makeRequest<PredioRaw[] | { data: PredioRaw[], success?: boolean }>(queryString, {
        method: 'GET'
      });
      
      let predios: PredioRaw[] = [];

      if (Array.isArray(responseData)) {
        predios = responseData;
      } else if (responseData && typeof responseData === 'object') {
        const resp = responseData as { data: PredioRaw[], success?: boolean };
        if (resp.data && Array.isArray(resp.data)) {
          predios = resp.data;
        } else if (resp.data) {
          predios = [resp.data as unknown as PredioRaw];
        } else {
          predios = [responseData as unknown as PredioRaw];
        }
      }

      return this.normalizeData(predios);

    } catch (error: unknown) {
      console.error('❌ [PredioService] Error al buscar predios:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los predios
   * La API requiere parámetros específicos incluso para listar todos
   */
  async obtenerPredios(params?: BusquedaPredioParams): Promise<PredioData[]> {
    try {
      // Si se proporcionan parámetros específicos, usarlos
      if (params && (params.codPredio || params.anio || params.direccion)) {
        return await this.buscarPredios(params);
      }
      
      // Si no hay parámetros, intentar obtener todos con valores por defecto
      const queryParams = new URLSearchParams({
        codPredio: '20231',
        anio: '2023',
        direccion: '1'
      });
      
      const responseData = await this.makeRequest<{ data: PredioRaw[] | PredioRaw, success: boolean }>(`?${queryParams.toString()}`, {
        method: 'GET'
      });
      
      if (responseData.success && responseData.data) {
        const data = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
        return this.normalizeData(data);
      }
      
      return [];
    } catch (error: unknown) {
      console.error('❌ [PredioService] Error:', error);
      return [];
    }
  }

  /**
   * Busca predios con filtros
   * Usa GET con query parameters
   */
  async buscarPredios(params: BusquedaPredioParams): Promise<PredioData[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('codPredio', params.codPredio || '20231');
      queryParams.append('anio', (params.anio || 2023).toString());
      queryParams.append('direccion', (params.direccion || 1).toString());
      
      const responseData = await this.makeRequest<{ data: PredioRaw[] | PredioRaw, success: boolean }>(`?${queryParams.toString()}`, {
        method: 'GET'
      });
      
      if (responseData.success && responseData.data) {
        const predios = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
        return this.normalizeData(predios);
      }
      
      return [];
    } catch (error: unknown) {
      console.error('❌ [PredioService] Error en buscarPredios:', error);
      return [];
    }
  }

  /**
   * Crea un nuevo predio usando POST sin autenticación
   * URL: POST /api/predio
   * Estructura JSON exacta según especificación del API
   */
  async crearPredio(datos: CreatePredioDTO): Promise<PredioData> {
    try {
      // Validaciones de datos requeridos
      if (!datos.numeroFinca || datos.numeroFinca <= 0) {
        throw new Error('numeroFinca es requerido y debe ser mayor a 0');
      }
      
      if (!datos.areaTerreno || datos.areaTerreno <= 0) {
        throw new Error('areaTerreno es requerido y debe ser mayor a 0');
      }
      
      if (!datos.codDireccion || datos.codDireccion <= 0) {
        throw new Error('codDireccion es requerido y debe ser mayor a 0');
      }
      
      const datosParaEnviar = {
        anio: datos.anio,
        codPredio: null, // SIEMPRE null - SQL lo asigna automáticamente
        numeroFinca: Number(datos.numeroFinca),
        otroNumero: String(datos.otroNumero || ""),
        codClasificacion: String(datos.codClasificacion || "0502").trim(),
        estPredio: String(datos.estPredio || "2503").trim(),
        codTipoPredio: String(datos.codTipoPredio || "2601").trim(),
        codCondicionPropiedad: String(datos.codCondicionPropiedad || "2701").trim(),
        codDireccion: Number(datos.codDireccion),
        codUsoPredio: datos.codUsoPredio === null ? null : Number(datos.codUsoPredio || 1),
        fechaAdquisicion: String(datos.fechaAdquisicion || new Date().toISOString().split('T')[0]),
        numeroCondominos: Number(datos.numeroCondominos || 2),
        codListaConductor: String(datos.codListaConductor || "1401").trim(),
        codUbicacionAreaVerde: Number(datos.codUbicacionAreaVerde || 1),
        areaTerreno: Number(datos.areaTerreno),
        totalAreaConstruccion: datos.totalAreaConstruccion ? Number(datos.totalAreaConstruccion) : null,
        valorTotalConstruccion: datos.valorTotalConstruccion ? Number(datos.valorTotalConstruccion) : null,
        valorTerreno: datos.valorTerreno ? Number(datos.valorTerreno) : null,
        autoavaluo: datos.autoavaluo ? Number(datos.autoavaluo) : null,
        codEstado: String(datos.codEstado || "0201"),
        codUsuario: getAuthenticatedUserCode()
      };
      
      const responseData = await this.makeRequest<{ data: PredioRaw, success: boolean } | PredioRaw>('', {
        method: 'POST',
        body: JSON.stringify(datosParaEnviar)
      });
      
      if (responseData && (responseData as { success?: boolean }).success === false) {
        const resp = responseData as { data?: unknown, message?: string };
        const errorMessage = (resp.data as string) || resp.message || 'Error al crear el predio';
        throw new Error(errorMessage);
      }

      // Normalizar la respuesta
      const rawResult = (responseData as { data: PredioRaw }).data || responseData as PredioRaw;
      return this.normalizeOptions.normalizeItem(rawResult, 0);
      
    } catch (error: unknown) {
      console.error('❌ [PredioService] Error creando predio:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene estadísticas de predios
   * Calculadas a partir del listado completo.
   */
  async obtenerEstadisticas(): Promise<{
    total: number;
    porEstado: Record<string, number>;
    porCondicion: Record<string, number>;
    areaTerrenoTotal: number;
    areaConstruidaTotal: number;
  }> {
    try {
      const predios = await this.obtenerTodosPredios();
      
      const estadisticas = {
        total: predios.length,
        porEstado: {} as Record<string, number>,
        porCondicion: {} as Record<string, number>,
        areaTerrenoTotal: 0,
        areaConstruidaTotal: 0
      };
      
      predios.forEach(predio => {
        const estado = predio.estadoPredio || 'SIN_ESTADO';
        estadisticas.porEstado[estado] = (estadisticas.porEstado[estado] || 0) + 1;
        
        const condicion = predio.condicionPropiedad || 'SIN_CONDICION';
        estadisticas.porCondicion[condicion] = (estadisticas.porCondicion[condicion] || 0) + 1;
        
        estadisticas.areaTerrenoTotal += predio.areaTerreno || 0;
        estadisticas.areaConstruidaTotal += predio.totalAreaConstruccion || 0;
      });
      
      return estadisticas;
      
    } catch (error: unknown) {
      console.error('❌ [PredioService] Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los usos de predios
   * GET /api/predio/usos
   * Sin autenticación
   */
  async obtenerUsosPredio(): Promise<Array<{
    codUsoPredio: number;
    codGrupoUso: number;
    descripcionUso: string;
  }>> {
    try {
      console.log('📡 [PredioService] Obteniendo usos de predios desde API');

      const responseData = await this.makeRequest<Array<{
        codUsoPredio: number;
        codGrupoUso: number;
        descripcionUso: string;
      }> | { success: boolean, data: unknown }>('/usos', {
        method: 'GET'
      });
      
      // Manejar diferentes formatos de respuesta
      let usosData: Array<{
        codUsoPredio: number;
        codGrupoUso: number;
        descripcionUso: string;
      }> = [];

      if (responseData && (responseData as { success?: boolean }).success && (responseData as { data?: unknown }).data) {
        const resp = responseData as { data: unknown };
        usosData = Array.isArray(resp.data) ? (resp.data as Array<{
          codUsoPredio: number;
          codGrupoUso: number;
          descripcionUso: string;
        }>) : [resp.data as {
          codUsoPredio: number;
          codGrupoUso: number;
          descripcionUso: string;
        }];
      } else if (Array.isArray(responseData)) {
        usosData = responseData;
      } else {
        return [];
      }

      // Mapear los datos
      const usosMapeados = usosData.map((item) => ({
        codUsoPredio: item.codUsoPredio,
        codGrupoUso: item.codGrupoUso,
        descripcionUso: item.descripcionUso
      }));

      return usosMapeados;

    } catch (error: unknown) {
      console.error('❌ [PredioService] Error al obtener usos de predios:', error);
      return [];
    }
  }

}

// Exportar instancia única del servicio
export const predioService = PredioService.getInstance();
