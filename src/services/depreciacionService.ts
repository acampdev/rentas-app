import BaseApiService from './BaseApiService';
import apiClient from './apiClient';
import {  buildApiUrl } from '../config/api.unified.config';

/**
 * Interfaces para Depreciación
 */
export interface DepreciacionData {
  id: number;
  anio: number;
  codTipoCasa: string;
  tipoCasa: string;
  material: string;
  antiguedad: string;
  porcMuyBueno: number;
  porcBueno: number;
  porcRegular: number;
  porcMalo: number;
  estado: string;
}

export interface DepreciacionRaw {
  id?: number;
  codDepreciacion?: number;
  anio?: number;
  año?: number;
  codTipoCasa?: string;
  descripcionTipoCasa?: string;
  tipoCasa?: string;
  materialEstructural?: string;
  material?: string;
  nivelAntiguedad?: string;
  antiguedad?: string;
  muyBueno?: number | string;
  bueno?: number | string;
  regular?: number | string;
  malo?: number | string;
  porcMuyBueno?: number | string;
  porcBueno?: number | string;
  porcRegular?: number | string;
  porcMalo?: number | string;
  estado?: string;
}

export interface CreateDepreciacionDTO {
  anio: string;
  codTipoCasa: string;
  codNivelAntiguedad: string;
  codMaterialEstructural: string;
  muyBueno: number;
  bueno: number;
  regular: number;
  malo: number;
}

/**
 * Servicio para gestión de Depreciación
 */
class DepreciacionService extends BaseApiService<DepreciacionData, CreateDepreciacionDTO, Partial<CreateDepreciacionDTO>, DepreciacionRaw> {
  private static instance: DepreciacionService;

  private constructor() {
    super(
      '/api/depreciacion',
      {
        normalizeItem: (item: any) => ({
          id: item.codDepreciacion || item.id || Math.floor(Math.random() * 1000000),
          anio: item.anio || item.año || 0,
          codTipoCasa: String(item.codTipoCasa || item.codigoTipoCasa || '').trim(),
          tipoCasa: item.descripcionTipoCasa || item.tipoCasa || '',
          material: item.materialEstructural || item.material || item.descripcionMaterial || '',
          antiguedad: item.nivelAntiguedad || item.antiguedad || item.descripcionAntiguedad || '',
          porcMuyBueno: parseFloat(String(item.muyBueno || item.porcMuyBueno || item.montoMuyBueno || 0)),
          porcBueno: parseFloat(String(item.bueno || item.porcBueno || item.montoBueno || 0)),
          porcRegular: parseFloat(String(item.regular || item.porcRegular || item.montoRegular || 0)),
          porcMalo: parseFloat(String(item.malo || item.porcMalo || item.montoMalo || 0)),
          estado: item.estado || 'ACTIVO'
        }),
        validateItem: (item: DepreciacionData) => !!(item.material || item.id)
      },
      'depreciaciones'
    );
  }

  public static getInstance(): DepreciacionService {
    if (!DepreciacionService.instance) {
      DepreciacionService.instance = new DepreciacionService();
    }
    return DepreciacionService.instance;
  }

  async consultar(anio: number, codTipoCasa: string): Promise<DepreciacionData[]> {
    const url = buildApiUrl(`${this.endpoint}?anio=${anio}&codTipoCasa=${codTipoCasa}`);
    const res = await apiClient.request<{ data?: DepreciacionRaw[] } | DepreciacionRaw[]>(url);
    const data = Array.isArray(res) ? res : (res.data ?? []);
    return this.normalizeData(data);
  }

  async crear(datos: any): Promise<DepreciacionData> {
    const url = buildApiUrl(this.endpoint);
    const response = await apiClient.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const res = await response.json() as any;
    return this.normalizeOptions.normalizeItem(res.data || res, 0);
  }

  async actualizar(datos: any): Promise<DepreciacionData> {
    const url = buildApiUrl(this.endpoint);
    const response = await apiClient.fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const res = await response.json() as any;
    return this.normalizeOptions.normalizeItem(res.data || res, 0);
  }
}

export const depreciacionService = DepreciacionService.getInstance();
export default depreciacionService;
