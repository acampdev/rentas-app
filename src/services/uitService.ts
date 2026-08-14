import BaseApiService from './BaseApiService';
import { API_CONFIG, buildApiUrl } from '../config/api.unified.config';

/**
 * Interface para los datos de UIT como vienen del API
 */
export interface UITRaw {
  codUit?: number | null;
  anio?: number;
  valor?: number | null;
  valorUit?: number | null;
  valQuinit?: number;
  alicuota?: number;
  rangoInicial?: number;
  rangoFinal?: number;
  impuestoParcial?: number;
  impuestoAcumulado?: number;
  codEpa?: number;
  estado?: string;
  fechaVigenciaDesde?: string;
  fechaVigenciaHasta?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}

/**
 * Interface para los datos de UIT normalizados
 */
export interface UITData {
  id: number;
  codUit?: number | null;
  anio: number;
  valor: number;
  valorUit?: number;
  valQuinit?: number;
  alicuota?: number;
  rangoInicial?: number;
  rangoFinal?: number;
  impuestoParcial?: number;
  impuestoAcumulado?: number;
  codEpa?: number;
  estado?: string;
  fechaVigenciaDesde?: string;
  fechaVigenciaHasta?: string;
}

export interface CreateUITDTO {
  anio: number;
  valor: number;
  estado?: string;
  codUsuario?: number;
}

export interface UpdateUITDTO {
  codUit: number;
  anio: number;
  valor: number;
}

/**
 * Servicio para gestión de valores UIT
 */
class UITService extends BaseApiService<UITData, CreateUITDTO, UpdateUITDTO, UITRaw> {
  private static instance: UITService;
  
  private constructor() {
    super(
      '/api/uitEpa',
      {
        normalizeItem: (item: UITRaw): UITData => {
          let valorFinal = 0;
          if (item.valor !== null && item.valor !== undefined) valorFinal = parseFloat(item.valor.toString());
          else if (item.valorUit !== null && item.valorUit !== undefined) valorFinal = parseFloat(item.valorUit.toString());

          let rangoFinal = undefined;
          if (item.rangoFinal !== undefined && item.rangoFinal !== null) {
            const rf = parseFloat(item.rangoFinal.toString());
            rangoFinal = rf === 0 ? undefined : rf;
          }

          let anioFinal = new Date().getFullYear();
          if (item.anio !== undefined && item.anio !== null) {
            const parsedAnio = parseInt(item.anio.toString(), 10);
            if (!isNaN(parsedAnio)) {
              anioFinal = parsedAnio;
            }
          }

          return {
            id: item.codEpa || item.codUit || Math.random() * 1000,
            codUit: item.codUit,
            anio: anioFinal,
            valor: valorFinal,
            valorUit: item.valorUit ? parseFloat(item.valorUit.toString()) : undefined,
            valQuinit: item.valQuinit ? parseFloat(item.valQuinit.toString()) : undefined,
            alicuota: item.alicuota ? parseFloat(item.alicuota.toString()) : undefined,
            rangoInicial: item.rangoInicial !== undefined ? parseFloat(item.rangoInicial.toString()) : undefined,
            rangoFinal: rangoFinal,
            impuestoParcial: item.impuestoParcial ? parseFloat(item.impuestoParcial.toString()) : undefined,
            impuestoAcumulado: item.impuestoAcumulado ? parseFloat(item.impuestoAcumulado.toString()) : undefined,
            codEpa: item.codEpa || undefined,
            estado: item.estado || 'ACTIVO',
            fechaVigenciaDesde: item.fechaVigenciaDesde,
            fechaVigenciaHasta: item.fechaVigenciaHasta
          };
        },
        validateItem: (item: UITData) => !!(item.anio > 1990 && item.valor >= 0)
      },
      'uits'
    );
  }
  
  static getInstance(): UITService {
    if (!UITService.instance) {
      UITService.instance = new UITService();
    }
    return UITService.instance;
  }

  async listarUITs(anio?: number): Promise<UITData[]> {
    const anioFinal = anio || new Date().getFullYear();
    try {
      const response = await this.makeRequest<any>(`?anio=${anioFinal}`, {
        method: 'GET'
      });
      
      // Si la API retorna un objeto envuelto en .data, lo extraemos.
      const rawData = response && response.data !== undefined ? response.data : response;
      if (!rawData) return [];

      // Si la API retorna un objeto único en lugar de un array, lo convertimos a array para evitar que normalizeData lo descarte.
      const arrayData = Array.isArray(rawData) ? rawData : [rawData];
      return this.normalizeData(arrayData);
    } catch (error) {
      console.error('Error al listar UITs:', error);
      return [];
    }
  }

  async obtenerVigente(): Promise<UITData | null> {
    const uits = await this.listarUITs();
    const general = uits.find(u => u.valor > 0 && !u.alicuota);
    return general || uits[0] || null;
  }

  async crearUIT(datos: CreateUITDTO): Promise<UITData> {
    try {
      const response = await this.makeRequest<any>('', {
        method: 'POST',
        body: JSON.stringify(datos)
      });
      const created = response && response.data !== undefined ? response.data : response;
      return this.normalizeOptions.normalizeItem(created as UITRaw, 0);
    } catch (error) {
      console.error('Error al crear UIT:', error);
      throw error;
    }
  }

  async actualizarUIT(datos: UpdateUITDTO): Promise<UITData> {
    try {
      const response = await this.makeRequest<any>('', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });
      const updated = response && response.data !== undefined ? response.data : response;
      return this.normalizeOptions.normalizeItem(updated as UITRaw, 0);
    } catch (error) {
      console.error('Error al actualizar UIT:', error);
      throw error;
    }
  }
}

export const uitService = UITService.getInstance();
