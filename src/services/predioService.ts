import { logger } from "../utils/logger";
import BaseApiService from "./BaseApiService";
import { extractApiMessage, isApiNotFoundError } from "./apiClient";
import {
  buildCreatePredio,
  calcularEstadisticasPredio,
  normalizePredio,
  normalizeUsosPredio,
  unwrapPredios,
  validateCreatePredio,
} from "./predio/predio.adapters";
import type {
  BusquedaPredioParams,
  CreatePredioDTO,
  PredioData,
  PredioEstadisticas,
  PredioListResponse,
  PredioRaw,
  UsoPredio,
  UsoPredioRaw,
} from "./predio/predio.types";

export type * from "./predio/predio.types";

class PredioService extends BaseApiService<
  PredioData,
  CreatePredioDTO,
  Partial<CreatePredioDTO>,
  PredioRaw
> {
  private static instance: PredioService;

  private constructor() {
    super(
      "/api/predio",
      {
        normalizeItem: normalizePredio,
        validateItem: (item) =>
          Boolean(
            item.codPredio &&
            item.areaTerreno !== undefined &&
            item.areaTerreno >= 0,
          ),
      },
      "predios",
    );
  }

  public static getInstance(): PredioService {
    if (!PredioService.instance) PredioService.instance = new PredioService();
    return PredioService.instance;
  }

  async obtenerTodosPredios(): Promise<PredioData[]> {
    try {
      const response = await this.makeRequest<PredioListResponse>("/all", {
        method: "GET",
      });
      return this.normalizeData(unwrapPredios(response));
    } catch (error: unknown) {
      logger.error(
        "[PredioService] Error al obtener todos los predios:",
        error,
      );
      throw error;
    }
  }

  async buscarPrediosConFiltros(
    params: BusquedaPredioParams,
  ): Promise<PredioData[]> {
    try {
      const query = new URLSearchParams({
        codPredioBase: params.codPredioBase || "",
        anio: String(params.anio || new Date().getFullYear()),
      });
      const response = await this.makeRequest<PredioListResponse>(
        `/all?${query}`,
        { method: "GET" },
      );
      return this.normalizeData(unwrapPredios(response, true));
    } catch (error: unknown) {
      logger.error("[PredioService] Error al buscar predios:", error);
      throw error;
    }
  }

  async obtenerPredios(params?: BusquedaPredioParams): Promise<PredioData[]> {
    try {
      if (params && (params.codPredio || params.anio || params.direccion))
        return await this.buscarPredios(params);
      return await this.consultarPredios({
        codPredio: "20231",
        anio: 2023,
        direccion: 1,
      });
    } catch (error: unknown) {
      logger.error("[PredioService] Error al obtener predios:", error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async buscarPredios(params: BusquedaPredioParams): Promise<PredioData[]> {
    try {
      return await this.consultarPredios({
        codPredio: params.codPredio || "20231",
        anio: params.anio || 2023,
        direccion: params.direccion || 1,
      });
    } catch (error: unknown) {
      logger.error("[PredioService] Error en buscarPredios:", error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  private async consultarPredios(
    params: Required<
      Pick<BusquedaPredioParams, "codPredio" | "anio" | "direccion">
    >,
  ): Promise<PredioData[]> {
    const query = new URLSearchParams({
      codPredio: params.codPredio,
      anio: String(params.anio),
      direccion: String(params.direccion),
    });
    const response = await this.makeRequest<PredioListResponse>(`?${query}`, {
      method: "GET",
    });
    if (!Array.isArray(response) && response.success === false) return [];
    return this.normalizeData(unwrapPredios(response));
  }

  async crearPredio(datos: CreatePredioDTO): Promise<PredioData> {
    try {
      validateCreatePredio(datos);
      const response = await this.makeRequest<
        { data?: PredioRaw | string; success?: boolean; message?: string } | PredioRaw
      >("", { method: "POST", body: JSON.stringify(buildCreatePredio(datos)) });
      if ("success" in response && response.success === false)
        throw new Error(
          typeof response.data === "string"
            ? response.data
            : response.message || "Error al crear el predio",
        );
      const responseData = "data" in response ? response.data : undefined;
      const raw = responseData && typeof responseData === "object"
        ? responseData
        : "success" in response
          ? (buildCreatePredio(datos) as PredioRaw)
          : (response as PredioRaw);
      const operationMessage =
        typeof responseData === "string" && responseData.trim()
          ? responseData.trim()
          : extractApiMessage(response, "Predio registrado correctamente");
      return { ...normalizePredio(raw), operationMessage };
    } catch (error: unknown) {
      logger.error("[PredioService] Error creando predio:", error);
      throw error;
    }
  }

  async actualizarPredio(datos: CreatePredioDTO): Promise<PredioData> {
    try {
      validateCreatePredio(datos);
      const codPredio = String(datos.codPredio || "").trim();
      if (!codPredio) throw new Error("El código del predio es requerido para actualizar");

      const payload = buildCreatePredio({ ...datos, codPredio });
      const response = await this.makeRequest<
        { data?: PredioRaw | string; success?: boolean; message?: string } | PredioRaw
      >("", { method: "PUT", body: JSON.stringify(payload) });
      if ("success" in response && response.success === false)
        throw new Error(
          typeof response.data === "string"
            ? response.data
            : response.message || "Error al actualizar el predio",
        );
      const responseData = "data" in response ? response.data : undefined;
      const raw = responseData && typeof responseData === "object"
        ? responseData
        : "success" in response
          ? (payload as PredioRaw)
          : (response as PredioRaw);
      const operationMessage =
        typeof responseData === "string" && responseData.trim()
          ? responseData.trim()
          : extractApiMessage(response, "Predio actualizado correctamente");
      return { ...normalizePredio(raw), operationMessage };
    } catch (error: unknown) {
      logger.error("[PredioService] Error actualizando predio:", error);
      throw error;
    }
  }

  async obtenerEstadisticas(): Promise<PredioEstadisticas> {
    try {
      return calcularEstadisticasPredio(await this.obtenerTodosPredios());
    } catch (error: unknown) {
      logger.error("[PredioService] Error obteniendo estadísticas:", error);
      throw error;
    }
  }

  async obtenerUsosPredio(): Promise<UsoPredio[]> {
    try {
      const response = await this.makeRequest<
        UsoPredioRaw[] | { data?: UsoPredioRaw[] | UsoPredioRaw }
      >("/usos", { method: "GET" });
      const items = Array.isArray(response)
        ? response
        : response.data
          ? Array.isArray(response.data)
            ? response.data
            : [response.data]
          : [];
      return normalizeUsosPredio(items);
    } catch (error: unknown) {
      logger.error("[PredioService] Error al obtener usos de predios:", error);
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }
}

export const predioService = PredioService.getInstance();
