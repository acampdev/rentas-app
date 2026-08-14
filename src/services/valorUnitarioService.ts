// src/services/valorUnitarioService.ts
import BaseApiService from './BaseApiService';
import { buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';

export const VALOR_UNITARIO_API_URL = buildApiUrl('/api/valoresunitarios');

/**
 * Interfaces para Valor Unitario
 */
export interface ValorUnitarioData {
  id: string;
  año: number;
  categoria: string;
  subcategoria: string;
  letra: string;
  costo: number;
  descripcionCategoria?: string;
  descripcionSubcategoria?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateValorUnitarioDTO {
  año: number;
  categoria: string;
  subcategoria: string;
  letra: string;
  costo: number;
  codUsuario?: number;
}

// DTO específico para la API POST sin autenticación
export interface CrearValorUnitarioApiDTO {
  codigoValorUnitario: null; // Se asigna por SQL
  codigoValorUnitarioAnterior: null;
  anio: number;
  codLetra: string;
  codCategoria: string;
  codSubcategoria: string;
  costo: number;
}

export interface UpdateValorUnitarioDTO extends Partial<CreateValorUnitarioDTO> {
  estado?: string;
  fechaModificacion?: string;
}

export interface BusquedaValorUnitarioParams {
  anio?: number;
  /** @deprecated Usar `anio`. Se mantiene para compatibilidad interna. */
  año?: number;
  categoria?: string;
  subcategoria?: string;
  letra?: string;
  estado?: string;
  codUsuario?: number;
}

// Enums para categorías
export enum CategoriaValorUnitario {
  ESTRUCTURAS = 'ESTRUCTURAS',
  ACABADOS = 'ACABADOS',
  INSTALACIONES = 'INSTALACIONES'
}

// Enums para subcategorías
export enum SubcategoriaValorUnitario {
  MUROS_Y_COLUMNAS = 'MUROS_Y_COLUMNAS',
  TECHOS = 'TECHOS',
  PISOS = 'PISOS',
  PUERTAS_Y_VENTANAS = 'PUERTAS_Y_VENTANAS',
  REVESTIMIENTOS = 'REVESTIMIENTOS',
  BANOS = 'BANOS',
  INSTALACIONES_ELECTRICAS_Y_SANITARIAS = 'INSTALACIONES_ELECTRICAS_Y_SANITARIAS'
}

// Enums para letras
export enum LetraValorUnitario {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I'
}

// Mapeo de subcategorías por categoría - CORREGIDO según especificación del usuario
export const SUBCATEGORIAS_POR_CATEGORIA = {
  [CategoriaValorUnitario.ESTRUCTURAS]: [
    SubcategoriaValorUnitario.MUROS_Y_COLUMNAS,
    SubcategoriaValorUnitario.TECHOS
  ],
  [CategoriaValorUnitario.ACABADOS]: [
    SubcategoriaValorUnitario.PISOS,              // Movido a ACABADOS según especificación
    SubcategoriaValorUnitario.PUERTAS_Y_VENTANAS,
    SubcategoriaValorUnitario.REVESTIMIENTOS,
    SubcategoriaValorUnitario.BANOS
  ],
  [CategoriaValorUnitario.INSTALACIONES]: [
    SubcategoriaValorUnitario.INSTALACIONES_ELECTRICAS_Y_SANITARIAS
  ]
};

export interface ValorUnitarioRaw {
  codValorUnitario?: number | string;
  codigoValorUnitario?: number | string;
  id?: number | string;
  anio?: number;
  año?: number;
  codLetra?: string;
  letra?: string;
  codCategoria?: string;
  categoria?: string;
  codSubcategoria?: string;
  subcategoria?: string;
  costo?: string | number;
  descripcionCategoria?: string;
  descripcionSubcategoria?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

/**
 * Servicio para gestión de valores unitarios
 * 
 * Autenticación:
 * - GET: No requiere token
 * - POST/PUT/DELETE: Requieren token Bearer
 */
class ValorUnitarioService extends BaseApiService<ValorUnitarioData, CreateValorUnitarioDTO, UpdateValorUnitarioDTO, ValorUnitarioRaw> {
  private static instance: ValorUnitarioService;
  
  private constructor() {
    super(
      VALOR_UNITARIO_API_URL,
      {
        normalizeItem: (item: ValorUnitarioRaw, index: number) => ({
          // Los códigos reales tienen 18 dígitos y exceden Number.MAX_SAFE_INTEGER.
          // Mantenerlos como texto evita modificar/eliminar un registro equivocado.
          id: String(item.codigoValorUnitario ?? item.codValorUnitario ?? item.id ?? index + 1),
          año: item.anio || item.año || new Date().getFullYear(),
          categoria: item.codCategoria || item.categoria || '',
          subcategoria: item.codSubcategoria || item.subcategoria || '',
          letra: item.letra || item.codLetra || 'A',
          costo: parseFloat(String(item.costo || '0')),
          descripcionCategoria: item.descripcionCategoria || 
            ValorUnitarioService.obtenerDescripcionCategoria(item.codCategoria || item.categoria || ''),
          descripcionSubcategoria: item.descripcionSubcategoria || 
            ValorUnitarioService.obtenerDescripcionSubcategoria(item.codSubcategoria || item.subcategoria || ''),
          estado: item.estado || 'ACTIVO',
          fechaRegistro: item.fechaRegistro,
          fechaModificacion: item.fechaModificacion,
          codUsuario: item.codUsuario
        }),
        
        validateItem: (item: ValorUnitarioData) => {
          // Validar que tenga los campos requeridos
          return !!(
            item.año > 1990 && 
            item.año <= 2100 && 
            item.categoria && 
            item.subcategoria && 
            item.letra && 
            item.costo >= 0
          );
        }
      },
      'valor_unitario'
    );
  }
  
  /**
   * Obtiene la instancia singleton del servicio
   */
  static getInstance(): ValorUnitarioService {
    if (!ValorUnitarioService.instance) {
      ValorUnitarioService.instance = new ValorUnitarioService();
    }
    return ValorUnitarioService.instance;
  }
  
  /**
   * Obtiene la descripción de una categoría
   */
  private static obtenerDescripcionCategoria(categoria: string): string {
    const descripciones: Record<string, string> = {
      'ESTRUCTURAS': 'Estructuras',
      'ACABADOS': 'Acabados',
      'INSTALACIONES': 'Instalaciones'
    };
    return descripciones[categoria] || categoria;
  }
  
  /**
   * Obtiene la descripción de una subcategoría
   */
  private static obtenerDescripcionSubcategoria(subcategoria: string): string {
    const descripciones: Record<string, string> = {
      'MUROS Y COLUMNAS': 'Muros y Columnas',
      'MUROS_Y_COLUMNAS': 'Muros y Columnas',
      'TECHOS': 'Techos',
      'PISOS': 'Pisos',
      'PUERTAS Y VENTANAS': 'Puertas y Ventanas',
      'PUERTAS_Y_VENTANAS': 'Puertas y Ventanas',
      'REVESTIMIENTOS': 'Revestimientos',
      'BANOS': 'Baños',
      'INSTALACIONES ELECTRICAS Y SANITARIAS': 'Instalaciones Eléctricas y Sanitarias',
      'INSTALACIONES_ELECTRICAS_Y_SANITARIAS': 'Instalaciones Eléctricas y Sanitarias'
    };
    return descripciones[subcategoria] || subcategoria;
  }
  
  /**
   * Lista todos los valores unitarios
   * NO requiere autenticación (método GET)
   */
  async listarValoresUnitarios(incluirInactivos: boolean = false): Promise<ValorUnitarioData[]> {
    try {
      console.log('🔍 [ValorUnitarioService] Listando valores unitarios');
      
      const valores = await this.getAll();
      
      if (!incluirInactivos) {
        return valores.filter(v => v.estado === 'ACTIVO');
      }
      
      return valores;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error listando valores unitarios:', error);
      throw error;
    }
  }

  /**
   * Consulta valores unitarios usando el API específico con GET y query params
   * URL: GET /api/valoresunitarios?anio=2024
   * NO requiere autenticación
   */
  async consultarValoresUnitarios(params: {
    anio?: number;
  }): Promise<ValorUnitarioData[]> {
    try {
      console.log('🔍 [ValorUnitarioService] Consultando valores unitarios con parámetros:', params);
      
      // IMPORTANTE: Usar año actual por defecto si no se proporciona o es inválido
      const anioFinal = (params.anio != null && params.anio !== undefined && params.anio > 0) 
        ? params.anio 
        : new Date().getFullYear();
      
      const queryString = `?anio=${anioFinal}`;
      
      console.log('📡 [ValorUnitarioService] Query string:', queryString);
      
      // Petición directa sin autenticación usando makeRequest
      const responseData = await this.makeRequest<ValorUnitarioRaw[] | { data: ValorUnitarioRaw[], success?: boolean }>(queryString, {
        method: 'GET'
      });
      
      console.log('✅ [ValorUnitarioService] Raw API response:', responseData);
      
      // El API devuelve un array directamente según tu JSON de ejemplo
      let items: ValorUnitarioRaw[] = [];
      if (Array.isArray(responseData)) {
        items = responseData;
      } else if (responseData && typeof responseData === 'object') {
        const resp = responseData as { data: ValorUnitarioRaw[], success?: boolean };
        if (resp.data && Array.isArray(resp.data)) {
          items = resp.data;
        } else if (resp.success !== undefined) {
          items = resp.data ? (Array.isArray(resp.data) ? resp.data : [resp.data as unknown as ValorUnitarioRaw]) : [];
        } else {
          items = [responseData as unknown as ValorUnitarioRaw];
        }
      }
      
      console.log('📊 [ValorUnitarioService] Items a normalizar:', items.length, 'elementos');

      // Normalizar según la estructura real del API
      const valoresFormateados = items.map((item, index) => {
        // Forzar el año si no viene en el item
        const rawWithAnio = { ...item, anio: item.anio || item.año || anioFinal };
        return this.normalizeOptions.normalizeItem(rawWithAnio, index);
      });
      
      console.log(`✅ [ValorUnitarioService] ${valoresFormateados.length} valores unitarios procesados correctamente`);
      return valoresFormateados;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error completo:', error);
      throw error;
    }
  }
  
  /**
   * Lista valores unitarios por año
   * NO requiere autenticación (método GET)
   */
  async listarPorAño(año: number): Promise<ValorUnitarioData[]> {
    try {
      console.log('🔍 [ValorUnitarioService] Listando valores unitarios del año:', año);
      
      return await this.consultarValoresUnitarios({ anio: año });
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error listando por año:', error);
      throw error;
    }
  }
  
  /**
   * Busca valores unitarios por criterios
   * NO requiere autenticación (método GET)
   */
  async buscarValoresUnitarios(criterios: BusquedaValorUnitarioParams): Promise<ValorUnitarioData[]> {
    try {
      console.log('🔍 [ValorUnitarioService] Buscando valores unitarios:', criterios);
      
      const anio = criterios.anio ?? criterios.año ?? new Date().getFullYear();
      const valores = await this.consultarValoresUnitarios({ anio });

      return valores.filter(valor =>
        (!criterios.categoria || valor.categoria === criterios.categoria) &&
        (!criterios.subcategoria || valor.subcategoria === criterios.subcategoria) &&
        (!criterios.letra || valor.letra === criterios.letra) &&
        (!criterios.estado || valor.estado === criterios.estado)
      );
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error buscando valores unitarios:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un valor unitario específico
   * NO requiere autenticación (método GET)
   */
  async obtenerValorUnitario(
    año: number,
    categoria: string,
    subcategoria: string,
    letra: string
  ): Promise<ValorUnitarioData | null> {
    try {
      console.log('🔍 [ValorUnitarioService] Obteniendo valor unitario específico');
      
      const valores = await this.buscarValoresUnitarios({
        año,
        categoria,
        subcategoria,
        letra
      });
      
      return valores.length > 0 ? valores[0] : null;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error obteniendo valor unitario:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene valores agrupados por categoría para un año
   * NO requiere autenticación (método GET)
   */
  async obtenerValoresPorCategoria(año: number): Promise<Record<string, Record<string, Record<string, number>>>> {
    try {
      console.log('🔍 [ValorUnitarioService] Obteniendo valores por categoría del año:', año);
      
      const valores = await this.listarPorAño(año);
      const resultado: Record<string, Record<string, Record<string, number>>> = {};
      
      // Inicializar estructura
      Object.values(CategoriaValorUnitario).forEach(categoria => {
        resultado[categoria] = {};
        const subcategorias = SUBCATEGORIAS_POR_CATEGORIA[categoria] || [];
        
        subcategorias.forEach(subcategoria => {
          resultado[categoria][subcategoria] = {};
          Object.values(LetraValorUnitario).forEach(letra => {
            resultado[categoria][subcategoria][letra] = 0;
          });
        });
      });
      
      // Poblar con datos reales
      valores.forEach(valor => {  
        if (resultado[valor.categoria] && 
            resultado[valor.categoria][valor.subcategoria]) {
          resultado[valor.categoria][valor.subcategoria][valor.letra] = valor.costo;
        }
      });
      
      return resultado;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error obteniendo valores por categoría:', error);
      throw error;
    }
  }
  
  /**
   * Verifica si ya existe un valor unitario
   * NO requiere autenticación (método GET)
   */
  async verificarExiste(
    año: number,
    categoria: string,
    subcategoria: string,
    letra: string,
    excluirId?: string
  ): Promise<boolean> {
    try {
      const valores = await this.buscarValoresUnitarios({
        año,
        categoria,
        subcategoria,
        letra
      });
      
      if (excluirId) {
        return valores.some(v => v.id !== excluirId);
      }
      
      return valores.length > 0;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error verificando existencia:', error);
      return false;
    }
  }
  
  /**
   * Crea un nuevo valor unitario
   * REQUIERE autenticación (método POST)
   */
  async crearValorUnitario(datos: CreateValorUnitarioDTO): Promise<ValorUnitarioData> {
    try {
      console.log('➕ [ValorUnitarioService] Creando valor unitario:', datos);
      
      // Verificar si ya existe
      const existe = await this.verificarExiste(
        datos.año,
        datos.categoria,
        datos.subcategoria,
        datos.letra
      );
      
      if (existe) {
        throw new Error('Ya existe un valor unitario con esas características');
      }
      
      const datosCompletos = {
        ...datos,
        codUsuario: getAuthenticatedUserCode(),
        estado: 'ACTIVO',
        fechaRegistro: new Date().toISOString()
      };
      
      return await this.create(datosCompletos);
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error creando valor unitario:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo valor unitario usando POST sin autenticación
   * URL: POST /api/valoresunitarios
   * NO requiere autenticación
   */
  async crearValorUnitarioSinAuth(datos: CrearValorUnitarioApiDTO): Promise<ValorUnitarioData> {
    try {
      console.log('➕ [ValorUnitarioService] Creando valor unitario sin autenticación:', datos);
      
      // Validar que los datos requeridos estén presentes
      if (!datos.anio || !datos.codLetra || !datos.codCategoria || !datos.codSubcategoria || datos.costo === undefined) {
        throw new Error('Faltan datos requeridos para crear el valor unitario');
      }

      // IMPORTANTE: Asegurar que los códigos automáticos siempre sean null
      const datosParaEnviar = {
        codigoValorUnitario: null, // FORZAR a null - SQL lo asigna automáticamente
        codigoValorUnitarioAnterior: null, // FORZAR a null - SQL lo asigna automáticamente
        anio: Number(datos.anio), 
        codLetra: String(datos.codLetra), 
        codCategoria: String(datos.codCategoria),
        codSubcategoria: String(datos.codSubcategoria),
        costo: Number(datos.costo)
      };

      const responseData = await this.makeRequest<ValorUnitarioRaw>('', {
        method: 'POST',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('✅ [ValorUnitarioService] Valor unitario creado exitosamente:', responseData);
      
      // Normalizar la respuesta
      const valorCreado = this.normalizeData([responseData])[0];
      
      console.log('✅ [ValorUnitarioService] Valor unitario normalizado:', valorCreado);
      return valorCreado;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error creando valor unitario sin auth:', error);
      throw error;
    }
  }

  /**
   * Helper para crear un valor unitario con valores por defecto
   */
  crearValorUnitarioConDefaults(datos: {
    anio: number;
    codLetra: string;
    codCategoria: string;
    codSubcategoria: string;
    costo: number;
  }): Promise<ValorUnitarioData> {
    const valorCompleto: CrearValorUnitarioApiDTO = {
      codigoValorUnitario: null,
      codigoValorUnitarioAnterior: null,
      anio: datos.anio,
      codLetra: datos.codLetra,
      codCategoria: datos.codCategoria,
      codSubcategoria: datos.codSubcategoria,
      costo: datos.costo
    };

    console.log('🔨 [ValorUnitarioService] Helper - Creando con valores por defecto:', valorCompleto);
    return this.crearValorUnitarioSinAuth(valorCompleto);
  }
  
  /**
   * Actualiza un valor unitario existente
   * REQUIERE autenticación (método PUT)
   */
  async actualizarValorUnitario(id: string, datos: UpdateValorUnitarioDTO): Promise<ValorUnitarioData> {
    try {
      console.log('📝 [ValorUnitarioService] Actualizando valor unitario:', id, datos);
      
      // Obtener valor actual
      const valorActual = await this.getById(id);
      if (!valorActual) {
        throw new Error('Valor unitario no encontrado');
      }
      
      // Validaciones
      if (datos.año !== undefined && (datos.año < 1990 || datos.año > 2100)) {
        throw new Error('El año debe estar entre 1990 y 2100');
      }
      
      if (datos.costo !== undefined && datos.costo < 0) {
        throw new Error('El costo no puede ser negativo');
      }
      
      // Si se están cambiando las características, verificar duplicados
      if (datos.año || datos.categoria || datos.subcategoria || datos.letra) {
        const existe = await this.verificarExiste(
          datos.año || valorActual.año,
          datos.categoria || valorActual.categoria,
          datos.subcategoria || valorActual.subcategoria,
          datos.letra || valorActual.letra,
          id
        );
        
        if (existe) {
          throw new Error('Ya existe otro valor unitario con esas características');
        }
      }
      
      const datosCompletos = {
        ...datos,
        fechaModificacion: new Date().toISOString()
      };
      
      return await this.update(id, datosCompletos);
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error actualizando valor unitario:', error);
      throw error;
    }
  }
  
  /**
   * Elimina un valor unitario (cambio de estado lógico)
   * REQUIERE autenticación (método PUT)
   */
  async eliminarValorUnitario(id: string): Promise<void> {
    try {
      console.log('🗑️ [ValorUnitarioService] Eliminando valor unitario:', id);
      
      // En lugar de eliminar físicamente, cambiar estado a INACTIVO
      await this.update(id, {
        estado: 'INACTIVO',
        fechaModificacion: new Date().toISOString()
      });
      
      console.log('✅ [ValorUnitarioService] Valor unitario marcado como inactivo');
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error eliminando valor unitario:', error);
      throw error;
    }
  }
  
  /**
   * Elimina todos los valores unitarios de un año
   * REQUIERE autenticación (método PUT)
   */
  async eliminarPorAño(año: number): Promise<number> {
    try {
      console.log('🗑️ [ValorUnitarioService] Eliminando valores unitarios del año:', año);
      
      const valores = await this.listarPorAño(año);
      let eliminados = 0;
      
      for (const valor of valores) {
        if (valor.estado === 'ACTIVO') {
          await this.eliminarValorUnitario(valor.id);
          eliminados++;
        }
      }
      
      console.log(`✅ [ValorUnitarioService] ${eliminados} valores eliminados del año ${año}`);
      return eliminados;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error eliminando por año:', error);
      throw error;
    }
  }
  
  /**
   * Copia valores unitarios de un año a otro
   * REQUIERE autenticación (método POST)
   */
  async copiarValoresDeAño(añoOrigen: number, añoDestino: number): Promise<number> {
    try {
      console.log(`📋 [ValorUnitarioService] Copiando valores del año ${añoOrigen} al ${añoDestino}`);
      
      // Verificar que no existan valores en el año destino
      const valoresDestino = await this.listarPorAño(añoDestino);
      if (valoresDestino.length > 0) {
        throw new Error(`Ya existen valores unitarios para el año ${añoDestino}`);
      }
      
      // Obtener valores del año origen
      const valoresOrigen = await this.listarPorAño(añoOrigen);
      if (valoresOrigen.length === 0) {
        throw new Error(`No hay valores unitarios en el año ${añoOrigen} para copiar`);
      }
      
      let copiados = 0;
      
      // Copiar cada valor
      for (const valor of valoresOrigen) {
        await this.crearValorUnitario({
          año: añoDestino,
          categoria: valor.categoria,
          subcategoria: valor.subcategoria,
          letra: valor.letra,
          costo: valor.costo
        });
        copiados++;
      }
      
      console.log(`✅ [ValorUnitarioService] ${copiados} valores copiados exitosamente`);
      return copiados;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error copiando valores:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene estadísticas de valores unitarios
   * NO requiere autenticación (método GET)
   */
  async obtenerEstadisticas(año?: number): Promise<{
    total: number;
    activos: number;
    inactivos: number;
    porCategoria: { [key: string]: number };
    porSubcategoria: { [key: string]: number };
    costoPromedio: number;
    añosDisponibles: number[];
  }> {
    try {
      let valores: ValorUnitarioData[];
      
      if (año) {
        valores = await this.listarPorAño(año);
      } else {
        valores = await this.getAll();
      }
      
      const estadisticas = {
        total: valores.length,
        activos: valores.filter(v => v.estado === 'ACTIVO').length,
        inactivos: valores.filter(v => v.estado === 'INACTIVO').length,
        porCategoria: {} as { [key: string]: number },
        porSubcategoria: {} as { [key: string]: number },
        costoPromedio: 0,
        añosDisponibles: [] as number[]
      };
      
      // Agrupar por categoría y subcategoría
      valores.forEach(valor => {
        // Por categoría
        estadisticas.porCategoria[valor.categoria] = 
          (estadisticas.porCategoria[valor.categoria] || 0) + 1;
        
        // Por subcategoría
        estadisticas.porSubcategoria[valor.subcategoria] = 
          (estadisticas.porSubcategoria[valor.subcategoria] || 0) + 1;
      });
      
      // Calcular costo promedio
      if (valores.length > 0) {
        const sumaCostos = valores.reduce((sum, v) => sum + v.costo, 0);
        estadisticas.costoPromedio = sumaCostos / valores.length;
      }
      
      // Obtener años disponibles
      const añosSet = new Set(valores.map(v => v.año));
      estadisticas.añosDisponibles = Array.from(añosSet).sort((a, b) => b - a);
      
      return estadisticas;
      
    } catch (error: unknown) {
      console.error('❌ [ValorUnitarioService] Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const valorUnitarioService = ValorUnitarioService.getInstance();

// Exportar también la clase por si se necesita extender
export default ValorUnitarioService;
