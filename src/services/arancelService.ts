import { NotificationService } from "../components/utils/Notification";
import { getAuthenticatedUserCode } from "../config/api.unified.config";
import BaseApiService from "./BaseApiService";
import {
  buildArancelFormData,
  buildArancelQuery,
  buildCreateArancelPayload,
  buildUpdateArancelPayload,
  isValidArancel,
  normalizeArancel,
  normalizeArancelMutation,
  unwrapArancelList,
} from "./arancel/arancel.adapters";
import { requestArancel } from "./arancel/arancel.api";
import type {
  ActualizarArancelApiDTO,
  ArancelData,
  ArancelListParams,
  ArancelRaw,
  CreateArancelDTO,
  CrearArancelApiDTO,
  UpdateArancelDTO,
} from "./arancel/arancel.types";

export type {
  ActualizarArancelApiDTO,
  ArancelData,
  ArancelListParams,
  ArancelRaw,
  ArancelResponse,
  CreateArancelDTO,
  CrearArancelApiDTO,
  UpdateArancelDTO,
} from "./arancel/arancel.types";

export class ArancelService extends BaseApiService<
  ArancelData,
  CreateArancelDTO,
  UpdateArancelDTO,
  ArancelRaw
> {
  private static instance: ArancelService;

  private constructor() {
    super(
      "/api/arancel",
      { normalizeItem: normalizeArancel, validateItem: isValidArancel },
      "arancel",
    );
  }

  static getInstance(): ArancelService {
    if (!ArancelService.instance) {
      ArancelService.instance = new ArancelService();
    }
    return ArancelService.instance;
  }

  private async list(
    params: ArancelListParams,
    defaultSearch: string,
  ): Promise<ArancelData[]> {
    const response = await requestArancel<unknown>(
      buildArancelQuery(params, defaultSearch),
      { method: "GET" },
    );
    return this.normalizeData(unwrapArancelList(response));
  }

  async listarArancelesGeneral(
    params: ArancelListParams = {},
  ): Promise<ArancelData[]> {
    return this.list(params, "");
  }

  async obtenerTodosAranceles(): Promise<ArancelData[]> {
    return this.listarArancelesGeneral({ parametroBusqueda: "a" });
  }

  async getAll(): Promise<ArancelData[]> {
    return this.obtenerTodosAranceles();
  }

  async listarAranceles(
    params: ArancelListParams = {},
  ): Promise<ArancelData[]> {
    return this.list(params, "a");
  }

  async obtenerPorAnioYDireccion(
    anio: number,
    codDireccion: number,
  ): Promise<ArancelData | null> {
    const results = await this.listarArancelesGeneral({ anio, codDireccion });
    return (
      results.find(
        (item) => item.anio === anio && item.codDireccion === codDireccion,
      ) ?? null
    );
  }

  async crearArancel(data: CreateArancelDTO): Promise<ArancelData> {
    try {
      const response = await requestArancel<unknown>("", {
        method: "POST",
        body: buildArancelFormData(data),
      });
      const created = normalizeArancelMutation(response);
      if (!created) throw new Error("Error al crear el arancel");
      NotificationService.success("Arancel creado exitosamente");
      return created;
    } catch (error: unknown) {
      NotificationService.error(
        error instanceof Error ? error.message : "Error al crear el arancel",
      );
      throw error;
    }
  }

  async crearArancelSinAuth(
    data: CrearArancelApiDTO,
  ): Promise<ArancelData | null> {
    const response = await requestArancel<unknown>("", {
      method: "POST",
      body: JSON.stringify(buildCreateArancelPayload(data)),
    });
    return normalizeArancelMutation(response);
  }

  crearArancelConDefaults(data: {
    anio: number;
    codDireccion: number;
    costo: number;
    codUsuario?: number;
  }): Promise<ArancelData | null> {
    return this.crearArancelSinAuth({
      codArancel: null,
      anio: data.anio,
      codDireccion: data.codDireccion,
      costo: data.costo,
      codUsuario: getAuthenticatedUserCode(),
    });
  }

  async actualizarArancel(
    codArancel: number,
    data: UpdateArancelDTO,
  ): Promise<ArancelData> {
    try {
      const response = await requestArancel<unknown>(`/${codArancel}`, {
        method: "PUT",
        body: buildArancelFormData(data),
      });
      const updated = normalizeArancelMutation(response);
      if (!updated) throw new Error("Error al actualizar el arancel");
      NotificationService.success("Arancel actualizado exitosamente");
      return updated;
    } catch (error: unknown) {
      NotificationService.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar el arancel",
      );
      throw error;
    }
  }

  async actualizarArancelSinAuth(
    data: ActualizarArancelApiDTO,
  ): Promise<ArancelData | null> {
    const response = await requestArancel<unknown>("", {
      method: "PUT",
      body: JSON.stringify(buildUpdateArancelPayload(data)),
    });
    return normalizeArancelMutation(response);
  }

  async eliminarArancel(codArancel: number): Promise<void> {
    try {
      await requestArancel<unknown>(`/${codArancel}`, { method: "PUT" });
      NotificationService.success("Arancel eliminado exitosamente");
    } catch (error: unknown) {
      NotificationService.error(
        error instanceof Error ? error.message : "Error al eliminar el arancel",
      );
      throw error;
    }
  }
}

export const arancelService = ArancelService.getInstance();
export default arancelService;
