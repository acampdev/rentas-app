import BaseApiService from './BaseApiService';
import apiClient from './apiClient';
import {  buildApiUrl } from '../config/api.unified.config';

/**
 * Interface para los datos de constante
 */
export interface ConstanteData {
  codConstante: string;
  nombreCategoria: string;
}

/**
 * Interface para los datos de ruta
 */
export interface RutaData {
  codigo: number;
  descripcion: string;
  abreviatura: string;
}

/**
 * Interface para los datos de zona
 */
export interface ZonaData {
  codigo: number;
  descripcion: string;
  abreviatura: string;
}

/**
 * Interface para los datos de grupo de uso
 */
export interface GrupoUsoData {
  codigo: number;
  descripcion: string;
}

/**
 * Interface para los datos de ubicación de área verde
 */
export interface UbicacionAreaVerdeData {
  codigo: number;
  descripcion: string;
  abreviatura: string;
}

/**
 * Interface para los datos de uso de predio
 */
export interface UsoPredioData {
  codUso: number;
  descripcion: string;
  codCriterio: number;
  anio: number;
  codGrupoUso: number;
}

/**
 * Códigos de constantes padres
 */
export const CODIGO_CONSTANTE_PADRE = {
  TIPO_CONTRIBUYENTE: '03',
  TIPO_DOCUMENTO: '41',
  ESTADO_CIVIL: '18',
  SEXOS: '20',
  NIVEL_ANTIGUEDAD: '06',
  ESTADO: '02',
  MODO_DECLARACION: '04',
  TIPOS_DE_CASA: '05',
  MATERIAL_ESTRUCTURAL_PREDOMINANTE: '07',
  ESCALAS: '08',
  TIPOS_UIT: '09',
  CATEGORIAS_VALORES_UNITARIOS: '10',
  LETRAS_DE_VALORES_UNITARIOS: '11',
  ESTADOS: '13',
  LISTA_CONDUCTOR: '14',
  LISTA_DE_USOS: '15',
  CATEGORIAS: '16',
  TIPO_TERRENO: '17',
  NACIONALIDAD: '19',
  TIPO_INTERES: '21',
  ESTADO_RECIBO: '22',
  MOTIVO: '23',
  MESES: '24',
  ESTADOS_DE_PREDIOS: '25',
  TIPO_DE_PREDIO: '26',
  CONDICION_DE_PROPIEDAD: '27',
  CLASES_DE_INTERES: '28',
  MODO_DECLARACION_TRANSFERENCIA: '29',
  MANZANAS: '30',
  CLASIFICACION: '32',
  INICIO: '33',
  RECONSIDERACION: '34',
  APELACION: '35',
  PERIODO: '36',
  TIPO_VIAS: '38',
  UBICCION_AREA_VERDE: '39',
  TIPO_DE_DECLARANTE: '40',
  LUGAR_DE_OCURRENCIA: '42',
  TRIBUTOS: '46',
  MOTIVOS: '51',
  CONCEPTOS_DE_CONVENIOS: '53',
  TIPO_DE_CONSTANCIA_NO_ADEUDO: '54',
  VALORES_ORDEN_DE_PAGO: '55',
  HISTORIAL_PREDIOS: '56',
  TRINESTRES: '57',
  TIPOS_DE_FORM: '58',
  CONDICION_PREDIO: '59',
  ADJUDICACION_DE_PREDIO_RUSTICO: '60',
  TIPO_DE_PREDIO_RUSTICO: '61',
  TIPO_DE_TRAMITE: '65',
  TRAMITES_TEMPORALES: '66',
  SECTOR_ECONOMICO: '67',
  CONDICION_LICENCIA: '68',
  COMPATIBILIDAD: '69',
  ANIOS: '70',
  TRIBUTOS_RD: '74',
  TIPO_ALCABALA: '76',
  TIPOS_DE_INSCRIPCION_DE_PREDIO: '77',
  TRIMESTRE: '78',
  INFORMES: '79',
  ACTOS_ADMINISTRATIVOS: '80',
  LADOS_DIRECCIONES: '81',
  MODO_TRANSFERENCIA: '83',
  TIPO_FRACCIONAMIENTO: '85',
  MOTIVOS_DE_REGISTRO_DE_PISO: '91',
  CONCEPTO_DE_DESCUENTO_GENERAL: '92',
  CONCEPTO_DE_DESCUENTO_ESPECIAL: '93',
  ESTADOS_DE_CONSERVACION: '94',
} as const;

/**
 * Interface para los datos de constante crudos
 */
export interface ConstanteRaw {
  codConstante?: string | number;
  codigo?: string | number;
  nombreCategoria?: string;
  descripcion?: string;
}

/**
 * Interface para los datos de ruta crudos
 */
export interface RutaRaw {
  codigo?: number;
  descripcion?: string;
  abreviatura?: string;
}

/**
 * Interface para los datos de grupo de uso crudos
 */
export interface GrupoUsoRaw {
  codigo?: number;
  descripcion?: string;
}

/**
 * Interface para los datos de ubicación de área verde crudos
 */
export interface UbicacionAreaVerdeRaw {
  codigo?: number;
  descripcion?: string;
  abreviatura?: string;
}

/**
 * Interface para los datos de uso de predio crudos
 */
export interface UsoPredioRaw {
  codUso?: number | null;
  descripcion?: string | null;
  codCriterio?: number | null;
  anio?: number | null;
  codGrupoUso?: number | null;
}

/**
 * Interface para los datos de zona crudas
 */
export interface ZonaRaw {
  codigo?: number;
  descripcion?: string;
  abreviatura?: string;
}

/**
 * Servicio para gestión de constantes optimizado
 */
class ConstanteService extends BaseApiService<ConstanteData, void, void, ConstanteRaw> {
  private static instance: ConstanteService;
  
  private constructor() {
    super('/api/constante', {
      normalizeItem: (item: ConstanteRaw, _index: number) => ({
        codConstante: String(item.codConstante || item.codigo || ''),
        nombreCategoria: item.nombreCategoria || item.descripcion || ''
      }),
      validateItem: (item: ConstanteData) => !!item.codConstante
    }, 'constantes');
  }
  
  static getInstance(): ConstanteService {
    if (!ConstanteService.instance) {
      ConstanteService.instance = new ConstanteService();
    }
    return ConstanteService.instance;
  }
  
  /**
   * Lista constantes por código de padre
   */
  async listarConstantesPorPadre(codConstante: string): Promise<ConstanteData[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/listarConstantePadre?codConstante=${codConstante}`);
      const response = await apiClient.fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res = await response.json();
      const items = (res.data || (Array.isArray(res) ? res : [res])) as ConstanteRaw[];
      return this.normalizeData(items);
    } catch (error) {
      console.error(`[ConstanteService] Error padre ${codConstante}:`, error);
      return [];
    }
  }

  /**
   * Lista constantes por código de hijo
   */
  async listarConstantesPorHijo(codConstante: string): Promise<ConstanteData[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/listarConstanteHijo?codConstante=${codConstante}`);
      const response = await apiClient.fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res = await response.json();
      const items = (res.data || (Array.isArray(res) ? res : [res])) as ConstanteRaw[];
      return this.normalizeData(items);
    } catch (error) {
      console.error(`[ConstanteService] Error hijo ${codConstante}:`, error);
      return [];
    }
  }

  // Métodos específicos (Atajos)
  obtenerTiposContribuyente = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPO_CONTRIBUYENTE);
  obtenerTiposDocumento = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPO_DOCUMENTO);
  obtenerTiposEstadoCivil = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.ESTADO_CIVIL);
  obtenerTiposSexo = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.SEXOS);
  obtenerTiposNivelAntiguedad = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.NIVEL_ANTIGUEDAD);
  obtenerTiposEstado = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.ESTADO);
  obtenerTiposModoDeclaracion = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.MODO_DECLARACION);
  obtenerTiposCasa = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPOS_DE_CASA);
  obtenerTiposMaterialEstructural = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.MATERIAL_ESTRUCTURAL_PREDOMINANTE);
  obtenerTiposEscala = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.ESCALAS);
  obtenerTiposCategoriasValoresUnitarios = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.CATEGORIAS_VALORES_UNITARIOS);
  obtenerTiposLetrasValoresUnitarios = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.LETRAS_DE_VALORES_UNITARIOS);
  obtenerTiposEstadoPredio = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.ESTADOS_DE_PREDIOS);
  obtenerTiposTipoPredio = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPO_DE_PREDIO);
  obtenerTiposCondicionPropiedad = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.CONDICION_DE_PROPIEDAD);
  obtenerTiposTipoVia = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPO_VIAS);
  obtenerTiposEstadosConservacion = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.ESTADOS_DE_CONSERVACION);
  obtenerTiposLadosDirecciones = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.LADOS_DIRECCIONES);
  obtenerTiposListaConductor = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.LISTA_CONDUCTOR);
  obtenerTiposListaUso = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.LISTA_DE_USOS);
  obtenerTiposInteres = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPO_INTERES);
  obtenerTiposEstadoRecibo = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.ESTADO_RECIBO);
  obtenerTiposMotivo = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.MOTIVO);
  obtenerTiposMeses = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.MESES);
  obtenerTiposEstadosPredio = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.ESTADOS_DE_PREDIOS);
  obtenerTributos = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TRIBUTOS);
  obtenerTiposFraccionamiento = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPO_FRACCIONAMIENTO);
  obtenerClaseDeInteres = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.CLASES_DE_INTERES);
  obtenerTiposModoTransferencia = () => this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.MODO_TRANSFERENCIA);
  obtenerTipoInscripcion = () =>  this.listarConstantesPorPadre(CODIGO_CONSTANTE_PADRE.TIPOS_DE_INSCRIPCION_DE_PREDIO);
  /**
   * Obtiene rutas
   */
  async obtenerRutas(): Promise<RutaData[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/listarRuta`);
      const response = await apiClient.fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      const items = (Array.isArray(data) ? data : data.data || []) as RutaRaw[];
      return items.map((i: RutaRaw) => ({
        codigo: i.codigo || 0,
        descripcion: i.descripcion || '',
        abreviatura: i.abreviatura || ''
      }));
    } catch {
      return [];
    }
  }

  async listarGrupoUso(): Promise<GrupoUsoData[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/listarGrupoUso`);
      const response = await apiClient.fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      const items = (Array.isArray(data) ? data : data.data || []) as GrupoUsoRaw[];
      return items.map((i: GrupoUsoRaw) => ({
        codigo: i.codigo || 0,
        descripcion: i.descripcion || ''
      }));
    } catch {
      return [];
    }
  }

  async listarUbicacionAreaVerde(): Promise<UbicacionAreaVerdeData[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/listarUbicacionAreaVerde`);
      const response = await apiClient.fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      const items = (Array.isArray(data) ? data : data.data || []) as UbicacionAreaVerdeRaw[];
      return items.map((i: UbicacionAreaVerdeRaw) => ({
        codigo: i.codigo || 0,
        descripcion: i.descripcion || '',
        abreviatura: i.abreviatura || ''
      }));
    } catch {
      return [];
    }
  }

  async listarUsoPredio(): Promise<UsoPredioData[]> {
    try {
      const response = await this.makeRequest<UsoPredioRaw[] | { data?: UsoPredioRaw[] }>('/listarUsoPredio', {
        method: 'GET'
      });
      const items = Array.isArray(response) ? response : response?.data || [];

      return items
        .map((i) => ({
          codUso: Number(i.codUso ?? 0),
          descripcion: String(i.descripcion ?? '').trim(),
          codCriterio: Number(i.codCriterio ?? 0),
          anio: Number(i.anio ?? 0),
          codGrupoUso: Number(i.codGrupoUso ?? 0)
        }))
        .filter((i) => i.codUso > 0 && i.descripcion !== '');
    } catch {
      return [];
    }
  }

  async obtenerZonas(): Promise<ZonaData[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/listarZona`);
      const response = await apiClient.fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      const items = (Array.isArray(data) ? data : data.data || []) as ZonaRaw[];
      return items.map((i: ZonaRaw) => ({
        codigo: i.codigo || 0,
        descripcion: i.descripcion || '',
        abreviatura: i.abreviatura || ''
      }));
    } catch {
      return [];
    }
  }
}

export const constanteService = ConstanteService.getInstance();
export default constanteService;
