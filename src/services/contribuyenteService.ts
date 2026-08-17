// src/services/contribuyenteService.ts
import BaseApiService from './BaseApiService';
import { buildApiUrl } from '../config/api.unified.config';
import apiClient from './apiClient';

/**
 * Interfaces para Contribuyente
 */
export interface ContribuyenteData {
  codigo: number;
  codigoPersona: number;
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string;
  nombreCompleto: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: number;
  estadoCivil?: string;
  sexo?: string;
  lote?: string;
  estado?: string;
  fechaRegistro?: string;
  codUsuario?: number;
  tipoContribuyente?: string;
  esExonerado?: boolean | null;
  esPensionista?: boolean | null;
  // Datos del cónyuge
  conyuge?: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numeroDocumento: string;
    tipoDocumento: string;
  };
  // Datos del representante legal
  representanteLegal?: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numeroDocumento: string;
    tipoDocumento: string;
  };
}

export interface CreateContribuyenteDTO {
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  sexo?: string;
  lote?: string;
  codUsuario?: number;
  // Datos del cónyuge
  conyugeNombres?: string;
  conyugeApellidoPaterno?: string;
  conyugeApellidoMaterno?: string;
  conyugeNumeroDocumento?: string;
  conyugeTipoDocumento?: string;
  // Datos del representante legal
  repreNombres?: string;
  repreApellidoPaterno?: string;
  repreApellidoMaterno?: string;
  repreNumeroDocumento?: string;
  repreTipoDocumento?: string;
}

export interface UpdateContribuyenteDTO extends Partial<CreateContribuyenteDTO> {
  codigo?: number;
}

export interface CreateContribuyenteAPIDTO {
  codPersona: number;
  codContribuyente?: null;
  codConyuge?: number | null;
  codRepresentanteLegal?: number | null;
  codestado: string;
  codUsuario: number;
  esExonerado?: boolean;
  esPensionista?: boolean;
}

export interface BusquedaContribuyenteParams {
  tipoPersona?: string;
  numeroDocumento?: string;
  nombre?: string;
  parametroBusqueda?: string;
  estado?: string;
  codUsuario?: number;
  codigoContribuyente?: string | number;
  codigoPersona?: string | number;
  codTipoContribuyente?: string;
  esExonerado?: boolean | number | string;
  esPensionista?: boolean | number | string;
  codigo?: string | number;
}

export interface ContribuyenteDetalle {
  codPersona: number | null;
  codTipoContribuyente: string | null;
  codTipopersona: string | null;
  codTipoDocumento: string | null;
  numerodocumento: string | null;
  nombres: string | null;
  apellidomaterno: string | null;
  apellidopaterno: string | null;
  direccion: string | null;
  fechanacimiento: string | null;
  codestadocivil: string | null;
  codsexo: string | null;
  telefono: string | null;
  lote: string | null;
  otros: string | null;
  codestado: string | null;
  codDireccion: string | null;
  codContribuyente: number;
  // Datos del cónyuge
  codConyuge: number | null;
  conyugeTipoDocumento: string | null;
  conyugeNumeroDocumento: string | null;
  conyugeNombres: string | null;
  conyugeApellidopaterno: string | null;
  conyugeApellidomaterno: string | null;
  conyugeEstadocivil: string | null;
  conyugeSexo: string | null;
  conyugeTelefono: string | null;
  conyugeFechanacimiento: string | null;
  conyugeFechanacimientoStr: string | null;
  conyugeDireccion: string | null;
  conyugeCoddireccion: string | null;
  conyugeLote: string | null;
  conyugeOtros: string | null;
  // Datos del representante legal
  codRepresentanteLegal: number | null;
  repreTipoDocumento: string | null;
  repreNumeroDocumento: string | null;
  repreNombres: string | null;
  repreApellidopaterno: string | null;
  repreApellidomaterno: string | null;
  repreEstadocivil: string | null;
  repreSexo: string | null;
  repreTelefono: string | null;
  repreFechanacimiento: string | null;
  repreFechanacimientoStr: string | null;
  repreDireccion: string | null;
  repreCoddireccion: string | null;
  repreLote: string | null;
  repreOtros: string | null;
  // Campos adicionales
  tipoContribuyente: string | null;
  esExonerado: boolean | null;
  esPensionista: boolean | null;
  fechaNacimientoStr: string | null;
}

/**
 * Interfaz para los datos crudos que vienen del API de Contribuyente
 */
export interface ContribuyenteRaw {
  codContribuyente?: number;
  codigo?: number;
  codPersona?: number;
  codigoPersona?: number;
  tipoContribuyente?: string;
  tipoPersona?: string;
  codTipopersona?: string;
  tipoDocumento?: string;
  codTipoDocumento?: string;
  numeroDocumento?: string;
  numerodocumento?: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidopaterno?: string;
  apellidoMaterno?: string;
  apellidomaterno?: string;
  razonSocial?: string;
  nombreCompleto?: string;
  nombrePersona?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: number;
  fechanacimiento?: number;
  estadoCivil?: string;
  codestadocivil?: string;
  sexo?: string;
  codsexo?: string;
  lote?: string;
  estado?: string;
  codestado?: string;
  fechaRegistro?: string;
  fechaNacimientoStr?: string;
  codUsuario?: number;
  esExonerado?: boolean | null;
  esPensionista?: boolean | null;
  conyugeNombres?: string;
  conyugeApellidopaterno?: string;
  conyugeApellidomaterno?: string;
  conyugeNumeroDocumento?: string;
  conyugeTipoDocumento?: string;
  repreNombres?: string;
  repreApellidopaterno?: string;
  repreApellidomaterno?: string;
  repreNumeroDocumento?: string;
  repreTipoDocumento?: string;
}

/**
 * Servicio unificado para gestión de contribuyentes
 */
class ContribuyenteService extends BaseApiService<ContribuyenteData, CreateContribuyenteDTO, UpdateContribuyenteDTO, ContribuyenteRaw> {
  private static instance: ContribuyenteService;
  
  public static getInstance(): ContribuyenteService {
    if (!ContribuyenteService.instance) {
      ContribuyenteService.instance = new ContribuyenteService();
    }
    return ContribuyenteService.instance;
  }
  
  private constructor() {
    super(
      '/api/contribuyente',
      {
        normalizeItem: (item: ContribuyenteRaw) => {
          const codigo = item.codContribuyente || item.codigo || 0;
          const codigoPersona = item.codPersona || item.codigoPersona || 0;
          
          const nombreCompleto = item.nombreCompleto ||
            item.nombrePersona ||
            ContribuyenteService.construirNombreCompleto(item);

          return {
            codigo,
            codigoPersona,
            tipoPersona: (item.tipoContribuyente === 'Natural' || item.tipoContribuyente === 'NATURAL') ? '0301' :
                        ((item.tipoContribuyente === 'Juridica' || item.tipoContribuyente === 'JURIDICA') ? '0302' :
                        (item.tipoPersona || item.codTipopersona || '0301')),
            tipoDocumento: item.tipoDocumento || item.codTipoDocumento || '',
            numeroDocumento: item.numeroDocumento || item.numerodocumento || '',
            nombres: item.nombres || '',
            apellidoPaterno: item.apellidoPaterno || item.apellidopaterno || '',
            apellidoMaterno: item.apellidoMaterno || item.apellidomaterno || '',
            razonSocial: item.razonSocial || '',
            nombreCompleto,
            direccion: item.direccion === 'null' ? '' : (item.direccion || ''),
            telefono: item.telefono || '',
            email: item.email || '',
            fechaNacimiento: item.fechaNacimiento || item.fechanacimiento,
            estadoCivil: item.estadoCivil || item.codestadocivil,
            sexo: item.sexo || item.codsexo,
            lote: item.lote || '',
            estado: item.estado || item.codestado || 'ACTIVO',
            fechaRegistro: item.fechaRegistro || item.fechaNacimientoStr,
            codUsuario: item.codUsuario,
            tipoContribuyente: item.tipoContribuyente || '',
            esExonerado: item.esExonerado ?? null,
            esPensionista: item.esPensionista ?? null,
            conyuge: item.conyugeNombres ? {
              nombres: item.conyugeNombres,
              apellidoPaterno: item.conyugeApellidopaterno || '',
              apellidoMaterno: item.conyugeApellidomaterno || '',
              numeroDocumento: item.conyugeNumeroDocumento || '',
              tipoDocumento: item.conyugeTipoDocumento || ''
            } : undefined,
            representanteLegal: item.repreNombres ? {
              nombres: item.repreNombres,
              apellidoPaterno: item.repreApellidopaterno || '',
              apellidoMaterno: item.repreApellidomaterno || '',
              numeroDocumento: item.repreNumeroDocumento || '',
              tipoDocumento: item.repreTipoDocumento || ''
            } : undefined
          };
        },
        
        validateItem: (item: ContribuyenteData) => {
          return !!(item.codigo || item.codigoPersona || item.numeroDocumento);
        }
      },
      'contribuyente'
    );
  }
  
  private static construirNombreCompleto(item: Partial<ContribuyenteRaw>): string {
    if ((item.tipoPersona === '0302' || item.codTipopersona === '0302' || item.tipoContribuyente === 'Juridica') 
        && item.razonSocial) {
      return item.razonSocial;
    }
    
    const partes = [
      item.apellidoPaterno || item.apellidopaterno,
      item.apellidoMaterno || item.apellidomaterno,
      item.nombres
    ].filter(Boolean);
    
    return partes.join(' ').trim() || item.nombres || 'Sin nombre';
  }

  /**
   * Busca contribuyentes usando el API general
   * GET /api/contribuyente/general?parametroBusqueda=&codigoContribuyente=21&codTipoContribuyente=&esExonerado=1&esPensionista=
   */
  async buscarContribuyentes(criterios: BusquedaContribuyenteParams = {}): Promise<ContribuyenteData[]> {
    try {
      console.log('🔍 [ContribuyenteService] Buscando contribuyentes con API general:', criterios);

      const tieneFiltros = [
        criterios.parametroBusqueda,
        criterios.nombre,
        criterios.numeroDocumento,
        criterios.codigoContribuyente,
        criterios.codigoPersona,
        criterios.codigo,
        criterios.codTipoContribuyente,
        criterios.tipoPersona,
        criterios.esExonerado,
        criterios.esPensionista
      ].some(valor => valor !== undefined && valor !== null && String(valor).trim() !== '');

      // El endpoint /general devuelve una lista vacía cuando no recibe filtros.
      // Para poblar selectores y listados iniciales, el padrón completo se obtiene
      // desde el endpoint base con ambos identificadores vacíos.
      if (!tieneFiltros) {
        console.log('📋 [ContribuyenteService] Cargando padrón completo desde el endpoint base');
        return await this.getAll(
          { codigoContribuyente: '', codigoPersona: '' }
        );
      }

      const url = buildApiUrl('/api/contribuyente/general');

      let paramBusqueda = '';
      if (criterios.parametroBusqueda && criterios.parametroBusqueda !== 'a') {
        paramBusqueda = criterios.parametroBusqueda;
      } else if (criterios.nombre) {
        paramBusqueda = criterios.nombre;
      } else if (criterios.numeroDocumento) {
        paramBusqueda = criterios.numeroDocumento;
      }

      let codContribuyenteStr = '';
      if (criterios.codigoContribuyente !== undefined && criterios.codigoContribuyente !== null && criterios.codigoContribuyente !== '') {
        codContribuyenteStr = String(criterios.codigoContribuyente);
      } else if (criterios.codigo !== undefined && criterios.codigo !== null && criterios.codigo !== '') {
        codContribuyenteStr = String(criterios.codigo);
      } else if (criterios.codigoPersona !== undefined && criterios.codigoPersona !== null && criterios.codigoPersona !== '') {
        codContribuyenteStr = String(criterios.codigoPersona);
      }

      // Si parametroBusqueda es numérico de 1 a 6 dígitos, asignarlo a codigoContribuyente
      if (!codContribuyenteStr && paramBusqueda && /^\d+$/.test(paramBusqueda) && paramBusqueda.length <= 6) {
        codContribuyenteStr = paramBusqueda;
        paramBusqueda = '';
      }

      const codTipoContribuyenteStr = criterios.codTipoContribuyente || (criterios.tipoPersona && criterios.tipoPersona !== '0301' && criterios.tipoPersona !== '0302' ? criterios.tipoPersona : '');
      
      let esExoneradoStr = '';
      if (criterios.esExonerado !== undefined && criterios.esExonerado !== null && criterios.esExonerado !== '') {
        esExoneradoStr = (criterios.esExonerado === true || criterios.esExonerado === 1 || criterios.esExonerado === '1') ? '1' : '0';
      }

      let esPensionistaStr = '';
      if (criterios.esPensionista !== undefined && criterios.esPensionista !== null && criterios.esPensionista !== '') {
        esPensionistaStr = (criterios.esPensionista === true || criterios.esPensionista === 1 || criterios.esPensionista === '1') ? '1' : '0';
      }

      const queryParams = new URLSearchParams();
      queryParams.append('parametroBusqueda', paramBusqueda);
      queryParams.append('codigoContribuyente', codContribuyenteStr);
      queryParams.append('codTipoContribuyente', codTipoContribuyenteStr);
      queryParams.append('esExonerado', esExoneradoStr);
      queryParams.append('esPensionista', esPensionistaStr);

      const getUrl = `${url}?${queryParams.toString()}`;
      console.log('📡 [ContribuyenteService] GET URL general:', getUrl);
      
      const response = await apiClient.fetch(getUrl, {
        method: 'GET'
      });
      
      console.log(`📥 [ContribuyenteService] Respuesta API general: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ContribuyenteService] Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const responseData = await response.json() as Record<string, unknown> | unknown[];
      console.log('✅ [ContribuyenteService] Datos obtenidos de API general:', responseData);
      
      let items: ContribuyenteRaw[] = [];
      
      if (Array.isArray(responseData)) {
        items = responseData as ContribuyenteRaw[];
      } else if (responseData && typeof responseData === 'object') {
        const respObj = responseData as Record<string, unknown>;
        if (respObj.data && Array.isArray(respObj.data)) {
          items = respObj.data as ContribuyenteRaw[];
        } else if (respObj.success && respObj.data) {
          items = Array.isArray(respObj.data) ? (respObj.data as ContribuyenteRaw[]) : [respObj.data as ContribuyenteRaw];
        } else if (respObj.data) {
          items = [respObj.data as ContribuyenteRaw];
        } else if ((respObj as any).codContribuyente || (respObj as any).numerodocumento || (respObj as any).nombres) {
          items = [respObj as unknown as ContribuyenteRaw];
        }
      }
      
      const contribuyentesNormalizados = this.normalizeData(items);
      console.log(`✅ [ContribuyenteService] ${contribuyentesNormalizados.length} contribuyentes procesados`);
      return contribuyentesNormalizados;
      
    } catch (error) {
      console.error('❌ [ContribuyenteService] Error en API general:', error);
      throw error;
    }
  }

  async obtenerTodosContribuyentes(): Promise<ContribuyenteData[]> {
    console.log('📋 [ContribuyenteService] Obteniendo todos los contribuyentes con API general');
    return this.buscarContribuyentes({});
  }

  /**
   * Obtiene un contribuyente detallado usando query params
   * GET /api/contribuyente?codigoContribuyente=4&codigoPersona=
   */
  async obtenerContribuyenteDetalle(codigoContribuyente: number | string, codigoPersona: number | string = ""): Promise<ContribuyenteDetalle | null> {
    try {
      console.log('🔍 [ContribuyenteService] Obteniendo detalle del contribuyente:', { codigoContribuyente, codigoPersona });

      const url = buildApiUrl(this.endpoint);
      const codPersonaValue = (codigoPersona === "" || codigoPersona === 0 || codigoPersona === "0") ? "" : String(codigoPersona);
      const codContribuyenteValue = (codigoContribuyente === "" || codigoContribuyente === 0 || codigoContribuyente === "0") ? "" : String(codigoContribuyente);

      const getUrl = `${url}?codigoContribuyente=${codContribuyenteValue}&codigoPersona=${codPersonaValue}`;
      console.log('📡 [ContribuyenteService] GET URL:', getUrl);
      
      const response = await apiClient.fetch(getUrl, {
        method: 'GET'
      });
      
      console.log(`📥 [ContribuyenteService] Respuesta: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ContribuyenteService] Error del servidor:', errorText);
        if (response.status === 404) return null;
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const responseData = await response.json() as Record<string, unknown> | unknown[];
      console.log('✅ [ContribuyenteService] Detalle obtenido:', responseData);

      if (Array.isArray(responseData)) {
        if (responseData.length > 0) {
          return responseData[0] as unknown as ContribuyenteDetalle;
        }
        return null;
      }

      if (Object.keys(responseData).length === 0) {
        return null;
      }

      const respObj = responseData as Record<string, unknown>;
      if (respObj.data) {
        const data = Array.isArray(respObj.data) ? respObj.data[0] : respObj.data;
        return data as unknown as ContribuyenteDetalle;
      } else if (respObj.codPersona !== undefined || respObj.codContribuyente !== undefined) {
        return respObj as unknown as ContribuyenteDetalle;
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ [ContribuyenteService] Error obteniendo detalle del contribuyente:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo contribuyente usando el API directo (POST /api/contribuyente)
   */
  async crearContribuyenteAPI(datos: CreateContribuyenteAPIDTO): Promise<ContribuyenteData> {
    try {
      console.log('➕ [ContribuyenteService] Creando contribuyente con API directa:', datos);
      const API_URL = buildApiUrl('/api/contribuyente');
      
      if (!datos.codPersona || !datos.codestado) {
        throw new Error('Código de persona y estado son requeridos');
      }
      
      const { codContribuyente: _codContribuyente, ...datosParaEnviar } = datos;
      console.log('📤 [ContribuyenteService] Enviando datos (codContribuyente omitido):', JSON.stringify(datosParaEnviar, null, 2));
      
      const response = await apiClient.fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log(`📥 [ContribuyenteService] Respuesta del servidor: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ContribuyenteService] Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const responseJson = await response.json() as Record<string, unknown>;
      console.log('✅ [ContribuyenteService] Respuesta completa del API:', responseJson);

      const isNumeric = (val: any) => val !== null && val !== undefined && !isNaN(val) && !isNaN(parseFloat(val));
      let codContribuyenteId = 0;
      let rawData: any = null;

      if (responseJson && typeof responseJson === 'object') {
        const dataVal = responseJson.data;
        if (dataVal !== undefined && dataVal !== null) {
          if (isNumeric(dataVal)) {
            codContribuyenteId = parseInt(dataVal as string, 10);
          } else {
            rawData = dataVal;
          }
        } else {
          rawData = responseJson;
        }
      } else if (isNumeric(responseJson)) {
        codContribuyenteId = parseInt(responseJson as any, 10);
      }

      if (codContribuyenteId > 0) {
        const normalized: ContribuyenteData = {
          codigo: codContribuyenteId,
          codigoPersona: datos.codPersona,
          tipoPersona: '',
          tipoDocumento: '',
          numeroDocumento: '',
          nombreCompleto: '',
          estado: 'ACTIVO',
          codUsuario: datos.codUsuario,
          esExonerado: datos.esExonerado ?? false,
          esPensionista: datos.esPensionista ?? false
        };
        console.log('✅ [ContribuyenteService] Contribuyente normalizado a partir de ID y DTO:', normalized);
        return normalized;
      }

      if (rawData) {
        if (Array.isArray(rawData)) {
          rawData = rawData[0];
        }
        return this.normalizeOptions.normalizeItem(rawData as ContribuyenteRaw, 0);
      }

      throw new Error('La respuesta del servidor no contiene un ID de contribuyente válido.');
      
    } catch (error) {
      console.error('❌ [ContribuyenteService] Error al crear contribuyente:', error);
      throw error;
    }
  }
}

export const contribuyenteService = ContribuyenteService.getInstance();
export default ContribuyenteService;
