// src/services/asignacionService.ts
import { buildApiUrl, getApiHeaders } from '../config/api.unified.config';
import apiClient from './apiClient';
import {
  extraerAsignaciones,
  getAsignacionErrorMessage,
  normalizarAsignacion,
  toAsignacionRecord,
  toAsignacionWritePayload
} from './asignacion.adapters';

export interface AsignacionPredio {
  id: number | string;
  anio: number;
  codPredio: string;
  codPredioBase: number | null;
  codContribuyente: string;
  codAsignacion: number | string | null;
  porcentajeCondomino: number | null;
  porcentajeCondominoDesc: string;
  fechaDeclaracion: string;
  fechaVenta: string;
  fechaDeclaracionStr: string;
  fechaVentaStr: string;
  codModoDeclaracion: string;
  modoDeclaracion: string;
  pensionista: number | null;
  pensionistaDesc: string | null;
  codEstado: string;
  estado: string;
  codUsuario: number | null;
  nombreContribuyente: string;
  codPredioContribuyente: number | null;
  direccionCompleta: string;
  autoavaluo: number;
  baseImponible: number;
  impuestoAnual: number;
  porcentajeCondominio?: number;
  esPensionista?: boolean;
  porcentajeLibre?: number;
}

export interface AsignacionQueryParams {
  anio?: number | string;
  codContribuyente?: number | string;
}

export interface AsignacionPredioDTO {
  codPredio: string;
  codContribuyente: number;
  codAsignacion: number | string | null;
  porcentajeCondomino: number | null;
  fechaDeclaracion: string;
  fechaVenta: string;
  codModoDeclaracion: string;
}

export type CreateAsignacionAPIDTO = AsignacionPredioDTO;

export interface ApiAsignacionResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  pagina?: number | null;
  limite?: number | null;
  totalPaginas?: number | null;
  totalRegistros?: number | null;
}

export type PrevalidacionBeneficio = ApiAsignacionResponse<string>;

class AsignacionService {
  private readonly endpoint = '/api/asignacionpredio';

  private async request(path: string, init: RequestInit): Promise<unknown> {
    return apiClient.request<unknown>(buildApiUrl(path), {
      ...init,
      credentials: 'include',
      headers: getApiHeaders(true)
    });
  }

  async buscarAsignaciones(params: AsignacionQueryParams): Promise<AsignacionPredio[]> {
    const query = new URLSearchParams();
    if (params.anio !== undefined && params.anio !== '') {
      query.set('anio', String(params.anio));
    }
    if (params.codContribuyente !== undefined && params.codContribuyente !== '') {
      query.set('codContribuyente', String(params.codContribuyente));
    }

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const payload = await this.request(`${this.endpoint}${suffix}`, {
      method: 'GET'
    });
    const response = toAsignacionRecord(payload);
    if (response.success === false) {
      throw new Error(getAsignacionErrorMessage(payload, 'No se pudieron listar las asignaciones'));
    }
    return extraerAsignaciones(payload);
  }

  async crearAsignacionAPI(datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    return this.guardarAsignacion('POST', datos);
  }

  async actualizarAsignacionAPI(datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    return this.guardarAsignacion('PUT', datos);
  }

  private async guardarAsignacion(method: 'POST' | 'PUT', datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    const writePayload = toAsignacionWritePayload(datos);
    const payload = await this.request(this.endpoint, {
      method,
      body: JSON.stringify(writePayload)
    });
    const response = toAsignacionRecord(payload);
    if (response.success === false) {
      throw new Error(getAsignacionErrorMessage(payload, 'No se pudo guardar la asignación'));
    }
    const responseData = toAsignacionRecord(response.data || payload);
    return normalizarAsignacion({ ...writePayload, ...responseData });
  }

  async desasignarAPI(datos: CreateAsignacionAPIDTO): Promise<ApiAsignacionResponse> {
    const payload = await this.request(`${this.endpoint}/desasignar`, {
      method: 'POST',
      body: JSON.stringify(toAsignacionWritePayload(datos))
    });
    const response = toAsignacionRecord(payload);
    if (response.success === false) {
      throw new Error(getAsignacionErrorMessage(payload, 'No se pudo desasignar el predio'));
    }
    return {
      success: response.success !== false,
      message: String(response.message || 'Desasignación realizada correctamente'),
      data: response.data ?? payload
    };
  }

  async prevalidarBeneficioPensionista(codContribuyente: number | string): Promise<PrevalidacionBeneficio> {
    return this.prevalidarBeneficio('prevalidarBeneficioPensionista', codContribuyente);
  }

  async prevalidarBeneficioAdultoMayor(codContribuyente: number | string): Promise<PrevalidacionBeneficio> {
    return this.prevalidarBeneficio('prevalidarBeneficioAdultoMayor', codContribuyente);
  }

  private async prevalidarBeneficio(endpoint: string, codContribuyente: number | string): Promise<PrevalidacionBeneficio> {
    const query = new URLSearchParams({
      codContribuyente: String(codContribuyente)
    });
    const payload = await this.request(`${this.endpoint}/${endpoint}?${query.toString()}`, { method: 'GET' });
    const response = toAsignacionRecord(payload);
    return {
      success: response.success === true,
      message: String(response.message || ''),
      data: typeof response.data === 'string' ? response.data : getAsignacionErrorMessage(payload, 'Sin información de prevalidación'),
      pagina: typeof response.pagina === 'number' ? response.pagina : null,
      limite: typeof response.limite === 'number' ? response.limite : null,
      totalPaginas: typeof response.totalPaginas === 'number' ? response.totalPaginas : null,
      totalRegistros: typeof response.totalRegistros === 'number' ? response.totalRegistros : null
    };
  }
}

export const asignacionService = new AsignacionService();
export default asignacionService;
