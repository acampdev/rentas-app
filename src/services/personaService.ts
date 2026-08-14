// src/services/personaService.ts
import BaseApiService from './BaseApiService';
import { getEndpoint, buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';
import { ContribuyenteData } from './contribuyenteService';

/**
 * Interfaces para Persona
 */
export interface PersonaData {
  codPersona: number;
  codTipopersona?: string;
  codTipoDocumento?: string;
  numerodocumento: string;
  nombres?: string;
  apellidomaterno?: string;
  apellidopaterno?: string;
  razonSocial?: string;
  direccion?: string | null;
  fechanacimiento?: number | string | null;
  codestadocivil?: string;
  codsexo?: string;
  telefono?: string;
  email?: string;
  codDireccion?: number | null;
  lote?: string | number | null;
  otros?: string | null;
  parametroBusqueda?: string | null;
  codUsuario?: number | null;
  nombrePersona?: string;
  estado?: string;
  fechaRegistro?: string;
}

export interface CreatePersonaDTO {
  codTipopersona: string;
  codTipoDocumento: string | number;
  numerodocumento: string;
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  fechanacimiento: string;
  codestadocivil: string | number;
  codsexo: string | number;
  telefono: string;
  codDireccion: number | null;
  lote: number | string | null;
  otros: string | null;
  parametroBusqueda?: string | null;
  usuario?: number;
  codUsuario?: number;
}

export interface UpdatePersonaDTO extends CreatePersonaDTO {
  codPersona: number;
}

/**
 * DTO para la API de creación de Persona
 */
export type CreatePersonaAPIDTO = CreatePersonaDTO;

export interface BusquedaPersonaParams {
  codTipoPersona?: string;
  codTipoDocumento?: string;
  numeroDocumento?: string;
  parametroBusqueda?: string;
  codUsuario?: number;
}

/**
 * Constantes de tipos de persona
 */
const TIPO_PERSONA_CODES = {
  PERSONA_NATURAL: '0301',
  PERSONA_JURIDICA: '0302'
} as const;

/**
 * Interfaz para los datos crudos que vienen del API de Persona
 */
export interface PersonaRaw {
  codPersona: number;
  codTipopersona?: string | null;
  codTipoDocumento?: string | null;
  numerodocumento: string;
  nombres?: string | null;
  apellidomaterno?: string | null;
  apellidopaterno?: string | null;
  razonSocial?: string | null;
  direccion?: string | null;
  fechanacimiento?: number | string | null;
  codestadocivil?: string | null;
  codsexo?: string | null;
  telefono?: string | null;
  email?: string | null;
  codDireccion?: number | null;
  lote?: string | number | null;
  otros?: string | null;
  parametroBusqueda?: string | null;
  codUsuario?: number | null;
  usuario?: number | null;
  nombrePersona?: string | null;
  estado?: string | null;
  fechaRegistro?: string | null;
}

/**
 * Servicio para manejar las operaciones de personas
 */
class PersonaService extends BaseApiService<PersonaData, CreatePersonaDTO, UpdatePersonaDTO, PersonaRaw> {
  private static instance: PersonaService;
  
  private constructor() {
    super(
      getEndpoint('persona', 'base'),
      {
        normalizeItem: (item: PersonaRaw) => {
          const codPersonaRaw = item.codPersona ?? 
                               (item as any).codpersona ?? 
                               (item as any).codigoPersona ?? 
                               (item as any).codigo ?? 
                               (item as any).id;
          const codPersona = typeof codPersonaRaw === 'number' ? codPersonaRaw : 
                             (codPersonaRaw ? parseInt(codPersonaRaw, 10) : 0);

          return {
            codPersona,
            codTipopersona: item.codTipopersona || '',
            codTipoDocumento: item.codTipoDocumento ? String(item.codTipoDocumento) : '',
            numerodocumento: item.numerodocumento || '',
            nombres: item.nombres || '',
            apellidomaterno: item.apellidomaterno || '',
            apellidopaterno: item.apellidopaterno || '',
            razonSocial: item.razonSocial || '',
            direccion: item.direccion === 'null' ? null : (item.direccion || null),
            fechanacimiento: item.fechanacimiento,
            codestadocivil: item.codestadocivil ? String(item.codestadocivil) : '',
            codsexo: item.codsexo ? String(item.codsexo) : '',
            telefono: item.telefono || '',
            email: item.email || '',
            codDireccion: item.codDireccion,
            lote: item.lote,
            otros: item.otros,
            parametroBusqueda: item.parametroBusqueda,
            codUsuario: item.codUsuario || item.usuario,
            nombrePersona: item.nombrePersona || this.construirNombreCompleto(item),
            estado: item.estado || 'ACTIVO',
            fechaRegistro: item.fechaRegistro || undefined
          };
        },
        
        validateItem: (item: PersonaData) => {
          return !!(item.codPersona && item.numerodocumento);
        }
      },
      'persona'
    );
  }
  
  /**
   * Obtiene la instancia singleton del servicio
   */
  static getInstance(): PersonaService {
    if (!PersonaService.instance) {
      PersonaService.instance = new PersonaService();
    }
    return PersonaService.instance;
  }
  
  /**
   * Construye el nombre completo de una persona
   */
  private construirNombreCompleto(item: Partial<PersonaRaw>): string {
    if (item.codTipopersona === TIPO_PERSONA_CODES.PERSONA_JURIDICA && item.razonSocial) {
      return item.razonSocial;
    }
    
    const partes = [
      item.apellidopaterno,
      item.apellidomaterno,
      item.nombres
    ].filter(Boolean);
    
    return partes.join(' ').trim() || 'Sin nombre';
  }

  /**
   * Obtiene una persona por su código
   */
  async obtenerPorId(id: number): Promise<PersonaData | null> {
    try {
      return await this.getById(id);
    } catch (error) {
      console.error(`❌ [PersonaService] Error obteniendo persona ${id}:`, error);
      return null;
    }
  }

  /**
   * Lista persona por tipo documento y número documento
   * GET /api/persona/listarPersona?codTipoDocumento=4101&numeroDocumento=72222224
   */
  async listarPersona(codTipoDocumento: string = '4101', numeroDocumento: string): Promise<PersonaData[]> {
    try {
      console.log('🔍 [PersonaService] GET /api/persona/listarPersona:', { codTipoDocumento, numeroDocumento });
      
      const queryParams = new URLSearchParams({
        codTipoDocumento: String(codTipoDocumento),
        numeroDocumento: String(numeroDocumento)
      });
      
      const endpoint = getEndpoint('persona', 'listarPersona');
      const url = buildApiUrl(endpoint);
      const fullUrl = `${url}?${queryParams.toString()}`;
      
      console.log('📡 [PersonaService] GET URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}`);
      
      const result = await response.json() as any;
      let items: PersonaRaw[] = [];
      
      if (Array.isArray(result)) {
        items = result;
      } else if (result.data && Array.isArray(result.data)) {
        items = result.data;
      } else if (result.data) {
        items = [result.data];
      } else if (result && typeof result === 'object' && result.codPersona) {
        items = [result];
      }
      
      return this.normalizeData(items);
      
    } catch (error) {
      console.error('❌ [PersonaService] Error en listarPersona:', error);
      throw error;
    }
  }

  /**
   * Obtiene una persona por su número de documento
   * Intenta primero listarPersona y luego el fallback general
   */
  async obtenerPorDocumento(dni: string, codTipoDocumento: string = '4101'): Promise<PersonaData | null> {
    try {
      console.log('🔍 [PersonaService] Buscando persona por documento:', { dni, codTipoDocumento });
      const personas = await this.listarPersona(codTipoDocumento, dni);
      if (personas.length > 0) {
        return personas[0];
      }
      
      const response = await this.getAll({ parametroBusqueda: dni });
      if (Array.isArray(response) && response.length > 0) {
        const personaEncontrada = response.find(p => p.numerodocumento === dni);
        return personaEncontrada || response[0];
      }
      
      return null;
    } catch (error) {
      console.error(`❌ [PersonaService] Error obteniendo persona por documento ${dni}:`, error);
      return null;
    }
  }

  /**
   * Lista personas llamando al API real GET /api/persona/listarPersona?codTipoDocumento=4101&numeroDocumento=72222224
   */
  async listarPorTipoYNombre(params: BusquedaPersonaParams): Promise<PersonaData[]> {
    try {
      const codTipoDoc = params.codTipoDocumento || '4101';
      const numDoc = params.numeroDocumento || params.parametroBusqueda;
      
      if (!numDoc || numDoc === 'a') {
        return [];
      }
      
      return await this.listarPersona(codTipoDoc, numDoc);
    } catch (error) {
      console.error('❌ [PersonaService] Error en listarPorTipoYNombre:', error);
      return [];
    }
  }

  /**
   * Crea una nueva persona usando la API directa (POST /api/persona)
   * Body JSON:
   * {
   *   "codTipopersona": "0301",
   *   "codTipoDocumento": "4101",
   *   "numerodocumento": "72222224",
   *   "nombres": "Roberto",
   *   "apellidomaterno": "Perez",
   *   "apellidopaterno": "Davila",
   *   "fechanacimiento": "1998-02-23",
   *   "codestadocivil": "1801",
   *   "codsexo": "2001",
   *   "telefono": "987678921",
   *   "codDireccion": 2,
   *   "lote": 45,
   *   "otros": null,
   *   "parametroBusqueda": null,
   *   "usuario": 1
   * }
   */
  async crearPersonaAPI(datos: CreatePersonaDTO): Promise<PersonaData> {
    try {
      console.log('➕ [PersonaService] Creando persona con API directa (POST):', datos);
      
      const API_URL = buildApiUrl('/api/persona');
      const bodyPayload = {
        codTipopersona: datos.codTipopersona || "0301",
        codTipoDocumento: String(datos.codTipoDocumento || "4101"),
        numerodocumento: String(datos.numerodocumento),
        nombres: datos.nombres,
        apellidomaterno: datos.apellidomaterno,
        apellidopaterno: datos.apellidopaterno,
        fechanacimiento: datos.fechanacimiento,
        codestadocivil: String(datos.codestadocivil || "1801"),
        codsexo: String(datos.codsexo || "2001"),
        telefono: datos.telefono || "",
        codDireccion: datos.codDireccion ?? 2,
        lote: datos.lote ?? null,
        otros: datos.otros ?? null,
        parametroBusqueda: datos.parametroBusqueda ?? null,
        usuario: getAuthenticatedUserCode()
      };
      
      console.log('📡 [PersonaService] POST URL:', API_URL);
      console.log('📦 [PersonaService] Payload:', bodyPayload);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });
      
      console.log(`📥 [PersonaService] Respuesta POST: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [PersonaService] Error del servidor POST:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const responseData = await response.json() as any;
      console.log('✅ [PersonaService] Persona creada (raw response):', responseData);

      const isNumeric = (val: any) => val !== null && val !== undefined && !isNaN(val) && !isNaN(parseFloat(val));
      
      let codPersona = 0;
      let itemToNormalize: any = null;

      if (responseData && typeof responseData === 'object') {
        const dataVal = responseData.data;
        if (dataVal !== undefined && dataVal !== null) {
          if (isNumeric(dataVal)) {
            codPersona = parseInt(dataVal, 10);
          } else {
            itemToNormalize = dataVal;
          }
        } else {
          itemToNormalize = responseData;
        }
      } else if (isNumeric(responseData)) {
        codPersona = parseInt(responseData, 10);
      }

      if (codPersona > 0) {
        const normalized: PersonaData = {
          codPersona,
          codTipopersona: datos.codTipopersona || '0301',
          codTipoDocumento: String(datos.codTipoDocumento || '4101'),
          numerodocumento: datos.numerodocumento || '',
          nombres: datos.nombres || '',
          apellidomaterno: datos.apellidomaterno || '',
          apellidopaterno: datos.apellidopaterno || '',
          fechanacimiento: datos.fechanacimiento,
          codestadocivil: String(datos.codestadocivil || '1801'),
          codsexo: String(datos.codsexo || '2001'),
          telefono: datos.telefono || '',
          codDireccion: datos.codDireccion || null,
          lote: datos.lote,
          otros: datos.otros || null,
          parametroBusqueda: null,
          codUsuario: getAuthenticatedUserCode(),
          nombrePersona: [datos.apellidopaterno, datos.apellidomaterno, datos.nombres].filter(Boolean).join(' ').trim() || 'Sin nombre',
          estado: 'ACTIVO'
        };
        console.log('✅ [PersonaService] Persona normalizada a partir de ID y DTO:', normalized);
        return normalized;
      }

      if (itemToNormalize) {
        if (Array.isArray(itemToNormalize)) {
          itemToNormalize = itemToNormalize[0];
        }
        const normalized = this.normalizeOptions.normalizeItem(itemToNormalize as PersonaRaw, 0);
        console.log('✅ [PersonaService] Persona normalizada:', normalized);
        return normalized;
      }

      throw new Error('La respuesta del servidor no contiene un ID de persona válido.');
      
    } catch (error) {
      console.error('❌ [PersonaService] Error al crear persona:', error);
      throw error;
    }
  }

  /**
   * Actualiza una persona existente usando la API directa (PUT /api/persona)
   * Body JSON:
   * {
   *   "codPersona": 3024,
   *   "codTipopersona": "0301",
   *   "codTipoDocumento": "4101",
   *   "numerodocumento": "72222224",
   *   "nombres": "Juan Roberto",
   *   "apellidomaterno": "Perez",
   *   "apellidopaterno": "Davila",
   *   "fechanacimiento": "1998-02-23",
   *   "codestadocivil": "1801",
   *   "codsexo": "2001",
   *   "telefono": "987678921",
   *   "codDireccion": 2,
   *   "lote": 45,
   *   "otros": null,
   *   "parametroBusqueda": null,
   *   "usuario": 1
   * }
   */
  async actualizarPersonaAPI(datos: UpdatePersonaDTO): Promise<PersonaData> {
    try {
      console.log('✏️ [PersonaService] Actualizando persona con API directa (PUT):', datos);
      
      const API_URL = buildApiUrl('/api/persona');
      const bodyPayload = {
        codPersona: datos.codPersona,
        codTipopersona: datos.codTipopersona || "0301",
        codTipoDocumento: String(datos.codTipoDocumento || "4101"),
        numerodocumento: String(datos.numerodocumento),
        nombres: datos.nombres,
        apellidomaterno: datos.apellidomaterno,
        apellidopaterno: datos.apellidopaterno,
        fechanacimiento: datos.fechanacimiento,
        codestadocivil: String(datos.codestadocivil || "1801"),
        codsexo: String(datos.codsexo || "2001"),
        telefono: datos.telefono || "",
        codDireccion: datos.codDireccion ?? 2,
        lote: datos.lote ?? null,
        otros: datos.otros ?? null,
        parametroBusqueda: datos.parametroBusqueda ?? null,
        usuario: getAuthenticatedUserCode()
      };
      
      console.log('📡 [PersonaService] PUT URL:', API_URL);
      console.log('📦 [PersonaService] Payload:', bodyPayload);
      
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });
      
      console.log(`📥 [PersonaService] Respuesta PUT: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [PersonaService] Error del servidor PUT:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const responseData = await response.json() as any;
      console.log('✅ [PersonaService] Persona actualizada (raw response):', responseData);
      
      const rawItem = responseData.data || responseData;
      const normalized = this.normalizeOptions.normalizeItem(
        Array.isArray(rawItem) ? rawItem[0] : (rawItem || bodyPayload),
        0
      );
      return normalized;
      
    } catch (error) {
      console.error('❌ [PersonaService] Error al actualizar persona:', error);
      throw error;
    }
  }

  /**
   * Convierte datos del formulario al formato requerido por la API
   */
  convertirFormularioAApiDTO(datosFormulario: Record<string, any>): CreatePersonaAPIDTO {
    let fechaNacimiento = '1998-02-23'; // Valor por defecto en formato YYYY-MM-DD
    if (datosFormulario.fechaNacimiento) {
      if (datosFormulario.fechaNacimiento instanceof Date) {
        fechaNacimiento = datosFormulario.fechaNacimiento.toISOString().split('T')[0];
      } else if (typeof datosFormulario.fechaNacimiento === 'string') {
        fechaNacimiento = datosFormulario.fechaNacimiento.split('T')[0];
      }
    } else if (datosFormulario.fechanacimiento) {
      if (typeof datosFormulario.fechanacimiento === 'string') {
        fechaNacimiento = datosFormulario.fechanacimiento.split('T')[0];
      }
    }

    const tipoDocumento = String(datosFormulario.tipoDocumento || datosFormulario.codTipoDocumento || '4101');
    const estadoCivil = String(datosFormulario.estadoCivil || datosFormulario.codestadocivil || '1801');
    const sexo = String(datosFormulario.sexo || datosFormulario.codsexo || '2001');

    let codDireccion: number | null = 2;
    if (datosFormulario.codDireccion !== undefined && datosFormulario.codDireccion !== null) {
      codDireccion = Number(datosFormulario.codDireccion);
    } else if (datosFormulario.direccion) {
      codDireccion = datosFormulario.direccion.id || 
                     datosFormulario.direccion.codigo || 
                     datosFormulario.direccion.codigoSector || 
                     2;
    }

    const datosAPI: CreatePersonaAPIDTO = {
      codTipopersona: String(datosFormulario.tipoPersona || datosFormulario.codTipopersona || (datosFormulario.isJuridica ? "0302" : "0301")),
      codTipoDocumento: tipoDocumento,
      numerodocumento: datosFormulario.numeroDocumento?.toString() || datosFormulario.numerodocumento?.toString() || '',
      nombres: datosFormulario.nombres || datosFormulario.razonSocial || '',
      apellidomaterno: datosFormulario.apellidoMaterno || datosFormulario.apellidomaterno || '',
      apellidopaterno: datosFormulario.apellidoPaterno || datosFormulario.apellidopaterno || '',
      fechanacimiento: fechaNacimiento,
      codestadocivil: estadoCivil,
      codsexo: sexo,
      telefono: datosFormulario.telefono?.toString() || '',
      codDireccion: codDireccion,
      lote: datosFormulario.lote ?? (datosFormulario.nFinca ? Number(datosFormulario.nFinca) || datosFormulario.nFinca : null),
      otros: datosFormulario.otros ?? (datosFormulario.otroNumero ? datosFormulario.otroNumero.toString() : null),
      parametroBusqueda: null,
      usuario: getAuthenticatedUserCode(),
      codUsuario: getAuthenticatedUserCode()
    };

    console.log('📋 [PersonaService] Datos API generados:', datosAPI);
    return datosAPI;
  }

  /**
   * Convierte PersonaData a formato compatible con ContribuyenteData
   */
  convertirAContribuyente(persona: PersonaData): Partial<ContribuyenteData> {
    return {
      codigoPersona: persona.codPersona,
      tipoPersona: persona.codTipopersona || undefined,
      tipoDocumento: persona.codTipoDocumento || undefined,
      numeroDocumento: persona.numerodocumento,
      nombres: persona.nombres || '',
      apellidoPaterno: persona.apellidopaterno || '',
      apellidoMaterno: persona.apellidomaterno || '',
      razonSocial: persona.razonSocial || '',
      nombreCompleto: persona.nombrePersona,
      direccion: persona.direccion || '',
      telefono: persona.telefono || '',
      email: persona.email || '',
      fechaNacimiento: typeof persona.fechanacimiento === 'number' ? persona.fechanacimiento : (persona.fechanacimiento ? new Date(persona.fechanacimiento).getTime() : undefined),
      estadoCivil: persona.codestadocivil || undefined,
      sexo: persona.codsexo || undefined,
      lote: persona.lote ? String(persona.lote) : undefined,
      estado: persona.estado || 'ACTIVO'
    };
  }

  /**
   * Valida un número de documento según el tipo
   */
  validarDocumento(tipoDocumento: string, numeroDocumento: string): { valido: boolean; mensaje?: string } {
    if (!numeroDocumento) return { valido: false, mensaje: 'El número de documento es requerido' };
    
    if (tipoDocumento === 'DNI' || tipoDocumento === '0101' || tipoDocumento === '4101') {
      if (!/^\d{8}$/.test(numeroDocumento)) {
        return { valido: false, mensaje: 'El DNI debe tener exactamente 8 dígitos' };
      }
    }
    
    if (tipoDocumento === 'RUC' || tipoDocumento === '0102' || tipoDocumento === '4102') {
      if (!/^\d{10}$/.test(numeroDocumento)) {
        return { valido: false, mensaje: 'El RUC debe tener exactamente 10 dígitos' };
      }
    }
    
    if (tipoDocumento === 'CE' || tipoDocumento === '0103' || tipoDocumento === '4103') {
      if (!/^\d{9}$/.test(numeroDocumento)) {
        return { 
          valido: false, 
          mensaje: 'El Carnet de Extranjería debe tener exactamente 9 dígitos' 
        };
      }
    }

    if (tipoDocumento === 'PARTIDA_NACIMIENTO' || tipoDocumento === '4104') {
      if (!/^\d{1,15}$/.test(numeroDocumento)) {
        return { valido: false, mensaje: 'La Partida de Nacimiento debe tener entre 1 y 15 dígitos' };
      }
    }
    
    return { valido: true };
  }
}

export const personaService = PersonaService.getInstance();
export default PersonaService;
