// src/services/cuentaCorrienteService.ts
import BaseApiService from "./BaseApiService";
import apiClient from "./apiClient";
import { buildApiUrl, getApiHeaders } from "../config/api.unified.config";
import {
  adaptarDetalleEstadoCuenta,
  adaptarEstadoCuentaAnual,
  esEstadoCuentaAnualValido,
  extraerItemsEstadoCuenta,
} from "./cuentaCorriente.adapters";

export interface EstadoCuentaFiltros {
  codContribuyente: number | string;
  anio?: number | string | null;
  codPredio?: number | string | null;
}

/**
 * Interfaces para Estado de Cuenta
 */
export interface EstadoCuentaAnual {
  codContribuyente: number | null;
  codPredio?: number | null;
  anio: number;
  totalPredial: number;
  totalArbitrial: number;
  tributo: string | null;
  grupoTributo: string | null;
  totalCargos: number;
  totalPagado: number;
  saldoNeto: number;
  cargo1: number | null;
  abono1: number | null;
  cargo2: number | null;
  abono2: number | null;
  cargo3: number | null;
  abono3: number | null;
  cargo4: number | null;
  abono4: number | null;
  cargo5: number | null;
  abono5: number | null;
  cargo6: number | null;
  abono6: number | null;
  cargo7: number | null;
  abono7: number | null;
  cargo8: number | null;
  abono8: number | null;
  cargo9: number | null;
  abono9: number | null;
  cargo10: number | null;
  abono10: number | null;
  cargo11: number | null;
  abono11: number | null;
  cargo12: number | null;
  abono12: number | null;
  venc_ene: string | null;
  venc_feb: string | null;
  venc_mar: string | null;
  venc_abr: string | null;
  venc_may: string | null;
  venc_jun: string | null;
  venc_jul: string | null;
  venc_ago: string | null;
  venc_sep: string | null;
  venc_oct: string | null;
  venc_nov: string | null;
  venc_dic: string | null;
}

export interface EstadoCuentaDetalle {
  codContribuyente: number | null;
  codPredio?: number | null;
  anio: number;
  tributo: string;
  grupoTributo: string;
  totalCargos: number;
  totalPagado: number;
  saldoNeto: number;
  cargo1: number;
  abono1: number;
  cargo2: number;
  abono2: number;
  cargo3: number;
  abono3: number;
  cargo4: number;
  abono4: number;
  cargo5: number;
  abono5: number;
  cargo6: number;
  abono6: number;
  cargo7: number;
  abono7: number;
  cargo8: number;
  abono8: number;
  cargo9: number;
  abono9: number;
  cargo10: number;
  abono10: number;
  cargo11: number;
  abono11: number;
  cargo12: number;
  abono12: number;
  venc_ene: string | null;
  venc_feb: string | null;
  venc_mar: string | null;
  venc_abr: string | null;
  venc_may: string | null;
  venc_jun: string | null;
  venc_jul: string | null;
  venc_ago: string | null;
  venc_sep: string | null;
  venc_oct: string | null;
  venc_nov: string | null;
  venc_dic: string | null;
}

/**
 * Interfaz para los datos crudos que vienen del API de Estado de Cuenta
 */
export interface EstadoCuentaRaw {
  codContribuyente: number | null;
  codPredio?: number | null;
  anio: number;
  totalPredial?: number;
  totalArbitrial?: number;
  tributo?: string | null;
  grupoTributo?: string | null;
  totalCargos?: number;
  totalPagado?: number;
  saldoNeto?: number;
  cargo1?: number | null;
  abono1?: number | null;
  cargo2?: number | null;
  abono2?: number | null;
  cargo3?: number | null;
  abono3?: number | null;
  cargo4?: number | null;
  abono4?: number | null;
  cargo5?: number | null;
  abono5?: number | null;
  cargo6?: number | null;
  abono6?: number | null;
  cargo7?: number | null;
  abono7?: number | null;
  cargo8?: number | null;
  abono8?: number | null;
  cargo9?: number | null;
  abono9?: number | null;
  cargo10?: number | null;
  abono10?: number | null;
  cargo11?: number | null;
  abono11?: number | null;
  cargo12?: number | null;
  abono12?: number | null;
  venc_ene?: string | null;
  venc_feb?: string | null;
  venc_mar?: string | null;
  venc_abr?: string | null;
  venc_may?: string | null;
  venc_jun?: string | null;
  venc_jul?: string | null;
  venc_ago?: string | null;
  venc_sep?: string | null;
  venc_oct?: string | null;
  venc_nov?: string | null;
  venc_dic?: string | null;
}

/**
 * Servicio para gestión de Cuenta Corriente y Estado de Cuenta
 */
class CuentaCorrienteService extends BaseApiService<
  EstadoCuentaAnual,
  void,
  void,
  EstadoCuentaRaw
> {
  private static instance: CuentaCorrienteService;

  public static getInstance(): CuentaCorrienteService {
    if (!CuentaCorrienteService.instance) {
      CuentaCorrienteService.instance = new CuentaCorrienteService();
    }
    return CuentaCorrienteService.instance;
  }

  private constructor() {
    super(
      "/api/estadoCuenta",
      {
        normalizeItem: adaptarEstadoCuentaAnual,
        validateItem: esEstadoCuentaAnualValido,
      },
      "estadoCuenta",
    );
  }

  /**
   * Lista el estado de cuenta de un contribuyente
   * GET /api/estadoCuenta/listar?codContribuyente=8&anio=&codPredio=
   */
  async listarEstadoCuenta(
    filtrosOContribuyente: EstadoCuentaFiltros | number | string,
    anio?: number | string | null,
    codPredio?: number | string | null,
  ): Promise<EstadoCuentaAnual[]> {
    const filtros: EstadoCuentaFiltros =
      typeof filtrosOContribuyente === "object"
        ? filtrosOContribuyente
        : { codContribuyente: filtrosOContribuyente, anio, codPredio };

    const url = buildApiUrl(`${this.endpoint}/listar`);
    const queryParams = new URLSearchParams({
      codContribuyente: String(filtros.codContribuyente),
      anio: filtros.anio == null ? "" : String(filtros.anio),
      codPredio: filtros.codPredio == null ? "" : String(filtros.codPredio),
    });
    const getUrl = `${url}?${queryParams.toString()}`;

    const payload = await apiClient.request<unknown>(getUrl, {
      method: "GET",
      credentials: "include",
      headers: getApiHeaders(true),
    });

    return this.normalizeData(extraerItemsEstadoCuenta(payload));
  }

  /**
   * Lista el detalle del estado de cuenta de un contribuyente por año
   * GET /api/estadoCuenta/listarDetalle?codContribuyente=2&anio=2026&codPredio=
   */
  async listarDetalleEstadoCuenta(
    codContribuyente: number | string,
    anio: number,
    codPredio?: number | string | null,
  ): Promise<EstadoCuentaDetalle[]> {
    const url = buildApiUrl(`${this.endpoint}/listarDetalle`);
    const queryParams = new URLSearchParams({
      codContribuyente: String(codContribuyente),
      anio: String(anio),
      codPredio: codPredio == null ? "" : String(codPredio),
    });
    const getUrl = `${url}?${queryParams.toString()}`;

    const payload = await apiClient.request<unknown>(getUrl, {
      method: "GET",
      credentials: "include",
      headers: getApiHeaders(true),
    });

    return extraerItemsEstadoCuenta(payload).map(adaptarDetalleEstadoCuenta);
  }
}

// Exportar instancia singleton
export const cuentaCorrienteService = CuentaCorrienteService.getInstance();
