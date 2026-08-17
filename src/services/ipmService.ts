import BaseApiService from './BaseApiService';

export interface IPMRaw {
  anio?: number | string | null;
  codMes?: string | number | null;
  mes?: string | number | null;
  indice?: number | string | null;
  variacionMensual?: number | string | null;
  variacionAcumulada?: number | string | null;
  usuario?: number | string | null;
}

export interface IPMData {
  anio: number;
  codMes: string;
  mes: string;
  indice: number;
  variacionMensual: number;
  variacionAcumulada: number;
  usuario: number | string | null;
}

export interface IPMWriteDTO {
  anio: number;
  mes: string;
  indice: number;
  variacionMensual: number;
  variacionAcumulada: number;
  usuario: number | string | null;
}

type IPMResponse = IPMRaw | IPMRaw[] | { data?: IPMRaw | IPMRaw[] } | null;

class IPMService extends BaseApiService<IPMData, IPMWriteDTO, IPMWriteDTO, IPMRaw> {
  private static instance: IPMService;

  private constructor() {
    super('/api/ipm', {
      normalizeItem: (item: IPMRaw): IPMData => {
        const codigoMes = String(item.codMes ?? item.mes ?? '').trim();
        const nombreMes = String(item.codMes != null ? item.mes ?? '' : '').trim();

        return {
          anio: Number(item.anio ?? new Date().getFullYear()),
          codMes: codigoMes,
          mes: nombreMes || codigoMes,
          indice: Number(item.indice ?? 0),
          variacionMensual: Number(item.variacionMensual ?? 0),
          variacionAcumulada: Number(item.variacionAcumulada ?? 0),
          usuario: item.usuario ?? null
        };
      },
      validateItem: (item: IPMData) => (
        Number.isInteger(item.anio) && item.anio >= 1900 && item.codMes !== '' &&
        Number.isFinite(item.indice) && Number.isFinite(item.variacionMensual) &&
        Number.isFinite(item.variacionAcumulada)
      )
    }, 'ipm');
  }

  static getInstance(): IPMService {
    if (!IPMService.instance) IPMService.instance = new IPMService();
    return IPMService.instance;
  }

  private extractItems(response: IPMResponse): IPMRaw[] {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if ('data' in response) {
      if (!response.data) return [];
      return Array.isArray(response.data) ? response.data : [response.data];
    }
    return [response as IPMRaw];
  }

  async listarPorAnio(anio: number): Promise<IPMData[]> {
    const response = await this.makeRequest<IPMResponse>(`?anio=${encodeURIComponent(anio)}`, { method: 'GET' });
    return this.normalizeData(this.extractItems(response));
  }

  async crear(datos: IPMWriteDTO): Promise<IPMData | null> {
    const response = await this.makeRequest<IPMResponse>('', {
      method: 'POST',
      body: JSON.stringify(this.normalizePayload(datos))
    });
    const items = this.extractItems(response);
    return items.length > 0 ? this.normalizeOptions.normalizeItem(items[0], 0) : null;
  }

  async actualizar(datos: IPMWriteDTO): Promise<IPMData | null> {
    const response = await this.makeRequest<IPMResponse>('', {
      method: 'PUT',
      body: JSON.stringify(this.normalizePayload(datos))
    });
    const items = this.extractItems(response);
    return items.length > 0 ? this.normalizeOptions.normalizeItem(items[0], 0) : null;
  }

  private normalizePayload(datos: IPMWriteDTO): IPMWriteDTO {
    return {
      anio: Number(datos.anio),
      mes: String(datos.mes).trim(),
      indice: Number(datos.indice),
      variacionMensual: Number(datos.variacionMensual),
      variacionAcumulada: Number(datos.variacionAcumulada),
      usuario: datos.usuario ?? null
    };
  }
}

export const ipmService = IPMService.getInstance();
