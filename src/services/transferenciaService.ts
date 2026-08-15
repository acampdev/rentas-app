// src/services/transferenciaService.ts
import BaseApiService from './BaseApiService';

export interface TransferenciaPredioRaw {
  codTransferencia?: number | string | null;
  anio?: number | string | null;
  codPredio?: number | string | null;
  codContribuyenteVenta?: number | string | null;
  codContribuyenteCompra?: number | string | null;
  porcentajeTransferencia?: number | string | null;
  fechaMinuta?: string | null;
  documento?: string | null;
  CodModoTransferencia?: number | string | null;
  codModoTransferencia?: number | string | null;
  valorTransferencia?: number | string | null;
  esConstructor?: boolean | string | null;
  contribuyenteVenta?: string | null;
  nombreContribuyenteVenta?: string | null;
  vendedor?: string | null;
  contribuyenteCompra?: string | null;
  nombreContribuyenteCompra?: string | null;
  comprador?: string | null;
  modoTransferencia?: string | null;
  descripcionModoTransferencia?: string | null;
}

export interface TransferenciaPredioData {
  codTransferencia: number;
  anio: number;
  codPredio: string;
  codContribuyenteVenta: number;
  codContribuyenteCompra: number;
  porcentajeTransferencia: number;
  fechaMinuta: string;
  documento: string;
  codModoTransferencia: string;
  valorTransferencia: number;
  esConstructor: boolean;
  nombreContribuyenteVenta: string;
  nombreContribuyenteCompra: string;
  descripcionModoTransferencia: string;
}

export interface CreateTransferenciaPredioDTO {
  codTransferencia: null;
  anio: number;
  codPredio: string;
  codContribuyenteVenta: number;
  codContribuyenteCompra: number;
  porcentajeTransferencia: number;
  fechaMinuta: string;
  documento: string;
  CodModoTransferencia: string;
  valorTransferencia: number;
  esConstructor: 'true' | 'false';
}

export interface UpdateTransferenciaPredioDTO extends Omit<CreateTransferenciaPredioDTO, 'codTransferencia'> {
  codTransferencia: number;
}

export interface BuscarTransferenciaPredioParams {
  codTransferencia?: number;
  codPredio?: string;
  anio?: number;
  codContribuyenteVenta?: number;
  codContribuyenteCompra?: number;
}

interface TransferenciaApiResponse {
  success?: boolean;
  message?: string;
  data?: TransferenciaPredioRaw | TransferenciaPredioRaw[] | null;
}

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toBoolean = (value: unknown): boolean => value === true || String(value).toLowerCase() === 'true';

const normalizeTransferencia = (item: TransferenciaPredioRaw): TransferenciaPredioData => ({
  codTransferencia: toNumber(item.codTransferencia),
  anio: toNumber(item.anio),
  codPredio: String(item.codPredio ?? ''),
  codContribuyenteVenta: toNumber(item.codContribuyenteVenta),
  codContribuyenteCompra: toNumber(item.codContribuyenteCompra),
  porcentajeTransferencia: toNumber(item.porcentajeTransferencia),
  fechaMinuta: String(item.fechaMinuta ?? ''),
  documento: String(item.documento ?? ''),
  codModoTransferencia: String(item.CodModoTransferencia ?? item.codModoTransferencia ?? ''),
  valorTransferencia: toNumber(item.valorTransferencia),
  esConstructor: toBoolean(item.esConstructor),
  nombreContribuyenteVenta: String(item.nombreContribuyenteVenta ?? item.contribuyenteVenta ?? item.vendedor ?? ''),
  nombreContribuyenteCompra: String(item.nombreContribuyenteCompra ?? item.contribuyenteCompra ?? item.comprador ?? ''),
  descripcionModoTransferencia: String(item.descripcionModoTransferencia ?? item.modoTransferencia ?? '')
});

class TransferenciaService extends BaseApiService<
  TransferenciaPredioData,
  CreateTransferenciaPredioDTO,
  UpdateTransferenciaPredioDTO,
  TransferenciaPredioRaw
> {
  private static instance: TransferenciaService;

  private constructor() {
    super(
      '/api/transferenciaPredio',
      {
        normalizeItem: normalizeTransferencia,
        validateItem: (item) => item.codTransferencia > 0
      },
      'transferenciasPredio'
    );
  }

  static getInstance(): TransferenciaService {
    if (!TransferenciaService.instance) {
      TransferenciaService.instance = new TransferenciaService();
    }
    return TransferenciaService.instance;
  }

  private obtenerItems(response: TransferenciaApiResponse | TransferenciaPredioRaw[]): TransferenciaPredioRaw[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    return response.data ? [response.data] : [];
  }

  async buscar(params: BuscarTransferenciaPredioParams): Promise<TransferenciaPredioData[]> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        queryParams.set(key, String(value));
      }
    });

    const response = await this.makeRequest<TransferenciaApiResponse | TransferenciaPredioRaw[]>(
      `?${queryParams.toString()}`,
      { method: 'GET' }
    );

    return this.normalizeData(this.obtenerItems(response));
  }

  async crear(datos: CreateTransferenciaPredioDTO): Promise<TransferenciaPredioData> {
    const response = await this.makeRequest<TransferenciaApiResponse | TransferenciaPredioRaw>('', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
    const items = this.obtenerItems(response as TransferenciaApiResponse);
    return items[0] ? normalizeTransferencia(items[0]) : normalizeTransferencia(datos);
  }

  async actualizar(datos: UpdateTransferenciaPredioDTO): Promise<TransferenciaPredioData> {
    const response = await this.makeRequest<TransferenciaApiResponse | TransferenciaPredioRaw>('', {
      method: 'PUT',
      body: JSON.stringify(datos)
    });
    const items = this.obtenerItems(response as TransferenciaApiResponse);
    return items[0] ? normalizeTransferencia(items[0]) : normalizeTransferencia(datos);
  }
}

export const transferenciaService = TransferenciaService.getInstance();
