// src/services/cuentaCorrienteService.ts
import BaseApiService from "./BaseApiService";
import { buildApiUrl, getApiHeaders } from "../config/api.unified.config";

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

const extraerItemsEstadoCuenta = (payload: unknown): EstadoCuentaRaw[] => {
  if (Array.isArray(payload)) return payload as EstadoCuentaRaw[];
  if (!payload || typeof payload !== "object") return [];

  const response = payload as Record<string, unknown>;
  const data = response.data;
  if (Array.isArray(data)) return data as EstadoCuentaRaw[];
  if (data && typeof data === "object") return [data as EstadoCuentaRaw];
  if ("anio" in response) return [response as unknown as EstadoCuentaRaw];
  return [];
};

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
        normalizeItem: (item: EstadoCuentaRaw) => ({
          codContribuyente: item.codContribuyente,
          codPredio: item.codPredio ?? null,
          anio: item.anio || 0,
          totalPredial: item.totalPredial || 0,
          totalArbitrial: item.totalArbitrial || 0,
          tributo: item.tributo || null,
          grupoTributo: item.grupoTributo || null,
          totalCargos: item.totalCargos || 0,
          totalPagado: item.totalPagado || 0,
          saldoNeto: item.saldoNeto || 0,
          cargo1: item.cargo1 || null,
          abono1: item.abono1 || null,
          cargo2: item.cargo2 || null,
          abono2: item.abono2 || null,
          cargo3: item.cargo3 || null,
          abono3: item.abono3 || null,
          cargo4: item.cargo4 || null,
          abono4: item.abono4 || null,
          cargo5: item.cargo5 || null,
          abono5: item.abono5 || null,
          cargo6: item.cargo6 || null,
          abono6: item.abono6 || null,
          cargo7: item.cargo7 || null,
          abono7: item.abono7 || null,
          cargo8: item.cargo8 || null,
          abono8: item.abono8 || null,
          cargo9: item.cargo9 || null,
          abono9: item.abono9 || null,
          cargo10: item.cargo10 || null,
          abono10: item.abono10 || null,
          cargo11: item.cargo11 || null,
          abono11: item.abono11 || null,
          cargo12: item.cargo12 || null,
          abono12: item.abono12 || null,
          venc_ene: item.venc_ene || null,
          venc_feb: item.venc_feb || null,
          venc_mar: item.venc_mar || null,
          venc_abr: item.venc_abr || null,
          venc_may: item.venc_may || null,
          venc_jun: item.venc_jun || null,
          venc_jul: item.venc_jul || null,
          venc_ago: item.venc_ago || null,
          venc_sep: item.venc_sep || null,
          venc_oct: item.venc_oct || null,
          venc_nov: item.venc_nov || null,
          venc_dic: item.venc_dic || null,
        }),

        validateItem: (item: EstadoCuentaAnual) => {
          return !!item.anio;
        },
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
    try {
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

      const response = await fetch(getUrl, {
        method: "GET",
        credentials: "include",
        headers: getApiHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const items = extraerItemsEstadoCuenta(await response.json());

      return this.normalizeData(items);
    } catch (error) {
      console.error(
        "❌ [CuentaCorrienteService] Error listando estado de cuenta:",
        error,
      );
      throw error;
    }
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
    try {
      console.log("🔄 [CuentaCorrienteService] Listando detalle para:", {
        codContribuyente,
        anio,
      });

      const url = buildApiUrl(`${this.endpoint}/listarDetalle`);
      const queryParams = new URLSearchParams({
        codContribuyente: String(codContribuyente),
        anio: String(anio),
        codPredio: codPredio == null ? "" : String(codPredio),
      });
      const getUrl = `${url}?${queryParams.toString()}`;

      const response = await fetch(getUrl, {
        method: "GET",
        credentials: "include",
        headers: getApiHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const items = extraerItemsEstadoCuenta(await response.json());

      // Normalizar detalles
      return items.map((item) => ({
        codContribuyente: item.codContribuyente,
        codPredio: item.codPredio ?? null,
        anio: item.anio || 0,
        tributo: item.tributo || "",
        grupoTributo: item.grupoTributo || "",
        totalCargos: item.totalCargos || 0,
        totalPagado: item.totalPagado || 0,
        saldoNeto: item.saldoNeto || 0,
        cargo1: item.cargo1 || 0,
        abono1: item.abono1 || 0,
        cargo2: item.cargo2 || 0,
        abono2: item.abono2 || 0,
        cargo3: item.cargo3 || 0,
        abono3: item.abono3 || 0,
        cargo4: item.cargo4 || 0,
        abono4: item.abono4 || 0,
        cargo5: item.cargo5 || 0,
        abono5: item.abono5 || 0,
        cargo6: item.cargo6 || 0,
        abono6: item.abono6 || 0,
        cargo7: item.cargo7 || 0,
        abono7: item.abono7 || 0,
        cargo8: item.cargo8 || 0,
        abono8: item.abono8 || 0,
        cargo9: item.cargo9 || 0,
        abono9: item.abono9 || 0,
        cargo10: item.cargo10 || 0,
        abono10: item.abono10 || 0,
        cargo11: item.cargo11 || 0,
        abono11: item.abono11 || 0,
        cargo12: item.cargo12 || 0,
        abono12: item.abono12 || 0,
        venc_ene: item.venc_ene || null,
        venc_feb: item.venc_feb || null,
        venc_mar: item.venc_mar || null,
        venc_abr: item.venc_abr || null,
        venc_may: item.venc_may || null,
        venc_jun: item.venc_jun || null,
        venc_jul: item.venc_jul || null,
        venc_ago: item.venc_ago || null,
        venc_sep: item.venc_sep || null,
        venc_oct: item.venc_oct || null,
        venc_nov: item.venc_nov || null,
        venc_dic: item.venc_dic || null,
      }));
    } catch (error) {
      console.error(
        "❌ [CuentaCorrienteService] Error listando detalle:",
        error,
      );
      throw error;
    }
  }
}

// Exportar instancia singleton
export const cuentaCorrienteService = CuentaCorrienteService.getInstance();
