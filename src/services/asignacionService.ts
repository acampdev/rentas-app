// src/services/asignacionService.ts
import { buildApiUrl, getApiHeaders } from '../config/api.unified.config';

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
  anio: number;
  codPredio: string;
  codContribuyente: number;
  codAsignacion: number | string | null;
  porcentajeCondomino: number | null;
  fechaDeclaracion: string;
  fechaVenta: string;
  codModoDeclaracion: string;
  pensionista: number;
  codEstado: string;
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

const formatPercentage = (value: number): string =>
  value.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const toRecord = (value: unknown): Record<string, unknown> => (value && typeof value === 'object' ? (value as Record<string, unknown>) : {});

const getErrorMessage = (payload: unknown, fallback: string): string => {
  const response = toRecord(payload);
  if (typeof response.data === 'string' && response.data.trim()) {
    return response.data.trim();
  }
  if (typeof response.message === 'string' && response.message.trim()) {
    return response.message.trim();
  }
  return fallback;
};

class AsignacionService {
  private readonly endpoint = '/api/asignacionpredio';

  private normalizeItem(item: unknown, index = 0): AsignacionPredio {
    const raw = toRecord(item);
    const porcentajeRaw = raw.porcentajeCondomino;
    const porcentaje = porcentajeRaw === null || porcentajeRaw === undefined ? null : Number(porcentajeRaw);
    const pensionistaRaw = raw.pensionista;
    const pensionista = pensionistaRaw === null || pensionistaRaw === undefined ? null : Number(pensionistaRaw);
    const codEstado = String(raw.codEstado || '0201').trim();
    const codPredio = String(raw.codPredio || '').trim();
    const codPredioContribuyente = raw.codPredioContribuyente === null || raw.codPredioContribuyente === undefined ? null : Number(raw.codPredioContribuyente);
    const codAsignacion = raw.codAsignacion === null || raw.codAsignacion === undefined ? null : (raw.codAsignacion as number | string);

    return {
      id: codAsignacion ?? codPredioContribuyente ?? `${codPredio}-${index}`,
      anio: Number(raw.anio) || new Date().getFullYear(),
      codPredio,
      codPredioBase: raw.codPredioBase === null || raw.codPredioBase === undefined ? null : Number(raw.codPredioBase),
      codContribuyente: String(raw.codContribuyente || '').trim(),
      codAsignacion,
      porcentajeCondomino: porcentaje,
      porcentajeCondominoDesc: String(raw.porcentajeCondominoDesc || '').trim() || `${formatPercentage(porcentaje ?? 100)} %`,
      fechaDeclaracion: String(raw.fechaDeclaracion || '').trim(),
      fechaVenta: String(raw.fechaVenta || '').trim(),
      fechaDeclaracionStr: String(raw.fechaDeclaracionStr || raw.fechaDeclaracion || '').trim(),
      fechaVentaStr: String(raw.fechaVentaStr || raw.fechaVenta || '').trim(),
      codModoDeclaracion: String(raw.codModoDeclaracion || '').trim(),
      modoDeclaracion: String(raw.modoDeclaracion || '').trim(),
      pensionista,
      pensionistaDesc:
        raw.pensionistaDesc === null || raw.pensionistaDesc === undefined
          ? pensionista === null
            ? null
            : pensionista === 1
              ? 'Sí'
              : 'No'
          : String(raw.pensionistaDesc).trim(),
      codEstado,
      estado: String(raw.estado || '').trim() || (codEstado === '0201' ? 'ACTIVO' : 'INACTIVO'),
      codUsuario: raw.codUsuario === null || raw.codUsuario === undefined ? null : Number(raw.codUsuario),
      nombreContribuyente: String(raw.nombreContribuyente || raw.contribuyente || '').trim(),
      codPredioContribuyente,
      direccionCompleta: String(raw.direccionCompleta || '').trim(),
      autoavaluo: Number(raw.autoavaluo) || 0,
      baseImponible: Number(raw.baseImponible) || 0,
      impuestoAnual: Number(raw.impuestoAnual) || 0,
      porcentajeCondominio: porcentaje ?? 100,
      esPensionista: pensionista === 1,
      porcentajeLibre: 100 - (porcentaje ?? 100)
    };
  }

  private async request(path: string, init: RequestInit): Promise<unknown> {
    const response = await fetch(buildApiUrl(path), {
      ...init,
      credentials: 'include',
      headers: getApiHeaders(true)
    });

    const responseText = await response.text();
    let payload: unknown = responseText;
    if (responseText) {
      try {
        payload = JSON.parse(responseText) as unknown;
      } catch {
        payload = responseText;
      }
    }

    if (!response.ok) {
      throw new Error(getErrorMessage(payload, `Error ${response.status}: ${response.statusText}`));
    }
    return payload;
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
    const response = toRecord(payload);
    if (response.success === false) {
      throw new Error(getErrorMessage(payload, 'No se pudieron listar las asignaciones'));
    }

    const rawData = 'data' in response ? response.data : payload;
    const items = Array.isArray(rawData) ? rawData : rawData && typeof rawData === 'object' ? [rawData] : [];
    const seen = new Set<string>();

    return items
      .filter((item) => {
        const raw = toRecord(item);
        const key = `${raw.anio || ''}-${String(raw.codPredio || '').trim()}-${String(raw.codContribuyente || '').trim()}`;
        if (!String(raw.codPredio || '').trim() || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((item, index) => this.normalizeItem(item, index));
  }

  async crearAsignacionAPI(datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    return this.guardarAsignacion('POST', datos);
  }

  async actualizarAsignacionAPI(datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    return this.guardarAsignacion('PUT', datos);
  }

  private async guardarAsignacion(method: 'POST' | 'PUT', datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    const payload = await this.request(this.endpoint, {
      method,
      body: JSON.stringify(datos)
    });
    const response = toRecord(payload);
    if (response.success === false) {
      throw new Error(getErrorMessage(payload, 'No se pudo guardar la asignación'));
    }
    const responseData = toRecord(response.data || payload);
    return this.normalizeItem({ ...datos, ...responseData });
  }

  async desasignarAPI(datos: CreateAsignacionAPIDTO): Promise<ApiAsignacionResponse> {
    const payload = await this.request(`${this.endpoint}/desasignar`, {
      method: 'POST',
      body: JSON.stringify(datos)
    });
    const response = toRecord(payload);
    if (response.success === false) {
      throw new Error(getErrorMessage(payload, 'No se pudo desasignar el predio'));
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
    const response = toRecord(payload);
    return {
      success: response.success === true,
      message: String(response.message || ''),
      data: typeof response.data === 'string' ? response.data : getErrorMessage(payload, 'Sin información de prevalidación'),
      pagina: typeof response.pagina === 'number' ? response.pagina : null,
      limite: typeof response.limite === 'number' ? response.limite : null,
      totalPaginas: typeof response.totalPaginas === 'number' ? response.totalPaginas : null,
      totalRegistros: typeof response.totalRegistros === 'number' ? response.totalRegistros : null
    };
  }
}

export const asignacionService = new AsignacionService();
export default asignacionService;
