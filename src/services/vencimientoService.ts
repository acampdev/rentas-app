import BaseApiService from './BaseApiService';
import apiClient from './apiClient';
import {  buildApiUrl } from '../config/api.unified.config';

/**
 * Interface para los datos de Vencimiento
 */
export interface VencimientoData {
  anio: number;
  mes: string;
  tipoImpuesto: string;
  diaSemana: string;
  ultimoDiaHabilStr: string;
}

export interface VencimientoRaw {
  anio: number;
  mes: string;
  tipoImpuesto: string;
  diaSemana: string;
  ultimoDiaHabilStr: string;
}

export interface CreateVencimientoDTO {
  anio: number;
}

/**
 * Servicio para gestión de Vencimientos
 */
class VencimientoService extends BaseApiService<VencimientoData, CreateVencimientoDTO, void, VencimientoRaw> {
  private static instance: VencimientoService;

  private constructor() {
    super(
      '/api/vencimiento',
      {
        normalizeItem: (item: VencimientoRaw) => ({
          anio: item.anio,
          mes: item.mes,
          tipoImpuesto: item.tipoImpuesto,
          diaSemana: item.diaSemana,
          ultimoDiaHabilStr: item.ultimoDiaHabilStr
        }),
        validateItem: (item: VencimientoData) => !!(item.anio && item.mes)
      },
      'vencimientos'
    );
  }

  static getInstance(): VencimientoService {
    if (!VencimientoService.instance) {
      VencimientoService.instance = new VencimientoService();
    }
    return VencimientoService.instance;
  }

  async obtenerPorAnio(anio: number): Promise<VencimientoData[]> {
    const url = buildApiUrl(`${this.endpoint}?anio=${anio}`);
    const res = await apiClient.request<{ data?: VencimientoRaw[] } | VencimientoRaw[]>(url);
    const data = Array.isArray(res) ? res : (res.data ?? []);
    return this.normalizeData(data);
  }

  async crearVencimientos(anio: number): Promise<VencimientoData[]> {
    const url = buildApiUrl(this.endpoint);
    const response = await apiClient.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anio })
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const res = await response.json() as any;
    return this.normalizeData(res.data || res);
  }
}

export const vencimientoService = VencimientoService.getInstance();
export default vencimientoService;
