import BaseApiService from './BaseApiService';
import apiClient, { isApiNotFoundError, unwrapApiList } from './apiClient';
import { buildApiUrl } from '../config/api.unified.config';

/**
 * Interface para los datos de Hoja de Resumen (HR)
 */
export interface HRData {
  codPredio: string;
  codContribuyente: string;
  nombreContribuyenteCompleto: string;
  numeroDocumento: string;
  nombreRepresentanteOConyuge: string | null;
  numeroDocumentoRepresentanteOConyuge: string | null;
  direccionFiscal: string;
  tipoContribuyente: string;
  codPredioBase: string;
  tipoPredio: string;
  porcentajeCondomino: string;
  autoavaluo: string;
  baseImponible: string;
  impuestoPredial: string;
  impuestoMensual: string;
  impuestoTrimestral: string;
}

/**
 * Interfaz para los datos crudos que vienen del API de HR
 */
export interface HRRaw {
  codPredio?: string;
  codContribuyente?: string | number;
  nombreContribuyenteCompleto?: string;
  numeroDocumento?: string;
  nombreRepresentanteOConyuge?: string | null;
  numeroDocumentoRepresentanteOConyuge?: string | null;
  direccionFiscal?: string;
  tipoContribuyente?: string;
  codPredioBase?: string | number;
  tipoPredio?: string;
  porcentajeCondomino?: string | number;
  autoavaluo?: string | number;
  baseImponible?: string | number;
  impuestoPredial?: string | number;
  impuestoMensual?: string | number;
  impuestoTrimestral?: string | number;
}

export interface HRQueryParams {
  codContribuyente?: string;
}

/**
 * Servicio para gestión de Hoja de Resumen (HR)
 */
class HRService extends BaseApiService<HRData, void, void> {
  private static instance: HRService;

  private constructor() {
    super(
      '/api/hr',
      {
        normalizeItem: (item: HRRaw): HRData => ({
          codPredio: (item.codPredio || '').trim(),
          codContribuyente: item.codContribuyente?.toString() || '',
          nombreContribuyenteCompleto: item.nombreContribuyenteCompleto || '',
          numeroDocumento: item.numeroDocumento || '',
          nombreRepresentanteOConyuge: item.nombreRepresentanteOConyuge || null,
          numeroDocumentoRepresentanteOConyuge: item.numeroDocumentoRepresentanteOConyuge || null,
          direccionFiscal: item.direccionFiscal || '',
          tipoContribuyente: item.tipoContribuyente || '',
          codPredioBase: item.codPredioBase?.toString() || '',
          tipoPredio: item.tipoPredio || '',
          porcentajeCondomino: String(item.porcentajeCondomino || '0'),
          autoavaluo: String(item.autoavaluo || '0'),
          baseImponible: String(item.baseImponible || '0'),
          impuestoPredial: String(item.impuestoPredial || '0'),
          impuestoMensual: String(item.impuestoMensual || '0'),
          impuestoTrimestral: String(item.impuestoTrimestral || '0')
        }),
        validateItem: (item: HRData) => !!item.codPredio
      },
      'hr'
    );
  }

  public static getInstance(): HRService {
    if (!HRService.instance) {
      HRService.instance = new HRService();
    }
    return HRService.instance;
  }

  async buscarHR(params: HRQueryParams): Promise<HRData[]> {
    try {
      const url = buildApiUrl(this.endpoint);
      const queryParams = new URLSearchParams();
      if (params.codContribuyente) {
        queryParams.append('codContribuyente', params.codContribuyente);
      }

      const payload = await apiClient.request<unknown>(`${url}?${queryParams.toString()}`);
      const items = unwrapApiList<Record<string, unknown>>(payload);
      
      return this.normalizeData(Array.isArray(items) ? items : []);
    } catch (error) {
      if (isApiNotFoundError(error)) return [];
      console.error('[HRService] Error:', error);
      throw error;
    }
  }
}

export const hrService = HRService.getInstance();
export default hrService;
