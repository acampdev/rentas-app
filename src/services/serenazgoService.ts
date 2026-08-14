import BaseApiService from './BaseApiService';
import { API_CONFIG, buildApiUrl } from '../config/api.unified.config';

/**
 * Interfaces para Arbitrio de Serenazgo
 */
export interface SerenazgoData {
  codigo: number | null;
  anio: number | null;
  codGrupoUso: number | null;
  codCuadrante: number | null;
  tasaMensual: number;
  nombreCuadrante: string;
  grupoUso: string;
  tasaAnual: number;
}

export interface SerenazgoRaw {
  codigo?: number | null;
  anio?: number | null;
  codGrupoUso?: number | null;
  codCuadrante?: number | null;
  tasaMensual: string | number;
  nombreCuadrante?: string;
  grupoUso?: string;
  tasaAnual?: string | number;
}

export interface CrearSerenazgoDTO {
  anio: number;
  codGrupoUso: number;
  codCuadrante: number;
  tasaMensual: number;
}

/**
 * Servicio para gestión de Arbitrios de Serenazgo
 */
class SerenazgoService extends BaseApiService<SerenazgoData, CrearSerenazgoDTO, CrearSerenazgoDTO, SerenazgoRaw> {
  private static instance: SerenazgoService;

  private constructor() {
    super(
      '/api/arbitrioSerenazgo',
      {
        normalizeItem: (item: any) => ({
          codigo: item.codigo || item.id || null,
          anio: item.anio || item.año || null,
          codGrupoUso: item.codGrupoUso || item.codigoGrupoUso || null,
          codCuadrante: item.codCuadrante || item.codigoCuadrante || null,
          tasaMensual: parseFloat(String(item.tasaMensual || item.montoMensual || 0)),
          nombreCuadrante: item.nombreCuadrante || item.cuadranteNombre || '',
          grupoUso: item.grupoUso || item.descripcionGrupoUso || '',
          tasaAnual: parseFloat(String(item.tasaAnual || item.montoAnual || item.monto || 0))
        }),
        validateItem: (item: SerenazgoData) => !!(item.tasaMensual >= 0)
      },
      'serenazgo'
    );
  }

  static getInstance(): SerenazgoService {
    if (!SerenazgoService.instance) {
      SerenazgoService.instance = new SerenazgoService();
    }
    return SerenazgoService.instance;
  }

  async listar(anio?: number): Promise<SerenazgoData[]> {
    const url = buildApiUrl(this.endpoint);
    const response = await fetch(`${url}${anio ? `?anio=${anio}` : ''}`);
    if (!response.ok) return [];
    const res = await response.json() as any;
    return this.normalizeData(res.data || res);
  }

  async crear(datos: CrearSerenazgoDTO): Promise<SerenazgoData> {
    const url = buildApiUrl(this.endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const res = await response.json() as any;
    return this.normalizeOptions.normalizeItem(res.data || res, 0);
  }

  async actualizar(datos: CrearSerenazgoDTO): Promise<SerenazgoData> {
    const url = buildApiUrl(this.endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const res = await response.json() as any;
    return this.normalizeOptions.normalizeItem(res.data || res, 0);
  }
}

export const serenazgoService = SerenazgoService.getInstance();
export default serenazgoService;
