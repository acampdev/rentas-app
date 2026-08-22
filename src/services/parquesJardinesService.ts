import BaseApiService from './BaseApiService';
import apiClient, { unwrapApiData, unwrapApiList } from './apiClient';
import {  buildApiUrl } from '../config/api.unified.config';

/**
 * Interfaces para Arbitrio de Parques y Jardines
 */
export interface ParquesJardinesData {
  codigo: number | null;
  anio: number | null;
  codRuta: number | null;
  codUbicacion: number | null;
  tasaMensual: number;
  nombreRuta: string;
  ubicacionAreaVerde: string | null;
  tasaAnual: number;
}

export interface ParquesJardinesRaw {
  codigo?: number | null;
  anio?: number | null;
  codRuta?: number | null;
  codUbicacion?: number | null;
  tasaMensual: string | number;
  nombreRuta?: string;
  ubicacionAreaVerde?: string | null;
  tasaAnual?: string | number;
}

export interface CrearParquesJardinesDTO {
  anio: number;
  codRuta: number;
  codUbicacion: number;
  tasaMensual: number;
}

/**
 * Servicio para gestión de Arbitrios de Parques y Jardines
 */
class ParquesJardinesService extends BaseApiService<ParquesJardinesData, CrearParquesJardinesDTO, CrearParquesJardinesDTO, ParquesJardinesRaw> {
  private static instance: ParquesJardinesService;

  private constructor() {
    super(
      '/api/arbitrioParquesJardines',
      {
        normalizeItem: (item: ParquesJardinesRaw) => ({
          codigo: item.codigo || null,
          anio: item.anio || null,
          codRuta: item.codRuta || null,
          codUbicacion: item.codUbicacion || null,
          tasaMensual: parseFloat(String(item.tasaMensual || 0)),
          nombreRuta: item.nombreRuta || '',
          ubicacionAreaVerde: item.ubicacionAreaVerde || null,
          tasaAnual: parseFloat(String(item.tasaAnual || 0))
        }),
        validateItem: (item: ParquesJardinesData) => !!(item.tasaMensual >= 0)
      },
      'parques-jardines'
    );
  }

  static getInstance(): ParquesJardinesService {
    if (!ParquesJardinesService.instance) {
      ParquesJardinesService.instance = new ParquesJardinesService();
    }
    return ParquesJardinesService.instance;
  }

  async listar(anio?: number): Promise<ParquesJardinesData[]> {
    const url = buildApiUrl(this.endpoint);
    const res = await apiClient.request<unknown>(`${url}${anio ? `?anio=${anio}` : ''}`);
    return this.normalizeData(unwrapApiList<ParquesJardinesRaw>(res));
  }

  async crear(datos: CrearParquesJardinesDTO): Promise<ParquesJardinesData> {
    const url = buildApiUrl(this.endpoint);
    const res = await apiClient.request<unknown>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return this.normalizeOptions.normalizeItem(unwrapApiData<ParquesJardinesRaw>(res), 0);
  }

  async actualizar(datos: CrearParquesJardinesDTO): Promise<ParquesJardinesData> {
    const url = buildApiUrl(this.endpoint);
    const res = await apiClient.request<unknown>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return this.normalizeOptions.normalizeItem(unwrapApiData<ParquesJardinesRaw>(res), 0);
  }
}

export const parquesJardinesService = ParquesJardinesService.getInstance();
export default parquesJardinesService;
