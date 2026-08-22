import BaseApiService from './BaseApiService';
import apiClient, { unwrapApiData, unwrapApiList } from './apiClient';
import {  buildApiUrl } from '../config/api.unified.config';

/**
 * Interfaces para Arbitrio de Limpieza Publica
 */
export interface LimpiezaPublicaData {
  codigo: number | null;
  anio: number | null;
  tasaMensual: number;
  codZona: number | null;
  codCriterio: number | null;
  nombreZona: string | null;
  tasaAnual: number;
  criterioUso: string | null;
}

export interface LimpiezaPublicaRaw {
  codigo?: number | null;
  anio?: number | null;
  tasaMensual: string | number;
  codZona?: number | string | null;
  codCriterio?: number | string | null;
  nombreZona?: string | null;
  tasaAnual?: string | number;
  criterioUso?: string | null;
}

export interface CreateLimpiezaPublicaDTO {
  anio: number;
  tasaMensual: number;
  codZona: number;
  codCriterio: number;
}

/**
 * Servicio para gestión de Arbitrios de Limpieza Pública
 */
class LimpiezaPublicaService extends BaseApiService<LimpiezaPublicaData, CreateLimpiezaPublicaDTO, CreateLimpiezaPublicaDTO, LimpiezaPublicaRaw> {
  private static instance: LimpiezaPublicaService;

  private constructor() {
    super(
      '/api/arbitrioLimpiezaPublica',
      {
        normalizeItem: (item: any) => ({
          codigo: item.codigo || item.id || null,
          anio: item.anio || item.año || null,
          tasaMensual: parseFloat(String(item.tasaMensual || item.montoMensual || 0)),
          codZona: item.codZona !== undefined && item.codZona !== null
            ? Number(item.codZona)
            : item.codigoZona !== undefined && item.codigoZona !== null
              ? Number(item.codigoZona)
              : null,
          codCriterio: item.codCriterio !== undefined && item.codCriterio !== null
            ? Number(item.codCriterio)
            : item.codigoCriterio !== undefined && item.codigoCriterio !== null
              ? Number(item.codigoCriterio)
              : null,
          nombreZona: item.nombreZona || item.zonaNombre || null,
          tasaAnual: parseFloat(String(item.tasaAnual || item.monto || item.totalAnual || item.tasaAnualizado || 0)),
          criterioUso: item.criterioUso || item.descripcionCriterio || null
        }),
        validateItem: (item: LimpiezaPublicaData) => !!(item.tasaMensual >= 0)
      },
      'limpieza-publica'
    );
  }

  static getInstance(): LimpiezaPublicaService {
    if (!LimpiezaPublicaService.instance) {
      LimpiezaPublicaService.instance = new LimpiezaPublicaService();
    }
    return LimpiezaPublicaService.instance;
  }

  async listar(anio?: number, tipo: 'normal' | 'otros' = 'normal'): Promise<LimpiezaPublicaData[]> {
    const baseUrl = buildApiUrl(this.endpoint);
    const suffix = tipo === 'otros' ? '/listarArbitrioLimpiezaPublicaOtros' : '';
    const url = `${baseUrl}${suffix}${anio ? `?anio=${anio}` : ''}`;
    
    const res = await apiClient.request<unknown>(url);
    return this.normalizeData(unwrapApiList<LimpiezaPublicaRaw>(res));
  }

  async crear(datos: CreateLimpiezaPublicaDTO, tipo: 'normal' | 'otros' = 'normal'): Promise<LimpiezaPublicaData> {
    const baseUrl = buildApiUrl(this.endpoint);
    const suffix = tipo === 'otros' ? '/insertarArbitrioLimpiezaPublicaOtros' : '';
    
    const res = await apiClient.request<unknown>(`${baseUrl}${suffix}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return this.normalizeOptions.normalizeItem(unwrapApiData<LimpiezaPublicaRaw>(res), 0);
  }

  async actualizar(datos: CreateLimpiezaPublicaDTO, tipo: 'normal' | 'otros' = 'normal'): Promise<LimpiezaPublicaData> {
    const baseUrl = buildApiUrl(this.endpoint);
    const suffix = tipo === 'otros' ? '/actualizarArbitrioLimpiezaPublicaOtros' : '';
    
    const res = await apiClient.request<unknown>(`${baseUrl}${suffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return this.normalizeOptions.normalizeItem(unwrapApiData<LimpiezaPublicaRaw>(res), 0);
  }
}

export const limpiezaPublicaService = LimpiezaPublicaService.getInstance();
export default limpiezaPublicaService;
