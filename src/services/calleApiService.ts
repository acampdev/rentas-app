import { logger } from "../utils/logger";
import BaseApiService, { type QueryParams } from "./BaseApiService";
import { isApiNotFoundError } from "./apiClient";
import {
  isValidCalle,
  normalizeCalle,
  toCreatedCalle,
  toCreateViaPayload,
  toUpdatedCalle,
  toUpdateViaPayload,
} from "./calleApi/calleApi.adapters";
import {
  requestCreateVia,
  requestUpdateSector,
  requestUpdateVia,
  requestVias,
  requestViasByName,
} from "./calleApi/calleApi.requests";
import type {
  BusquedaCalleParams,
  CalleData,
  CreateCalleDTO,
  RawCalle,
  UpdateCalleDTO,
  UpdateSectorDTO,
} from "./calleApi/calleApi.types";

export type {
  BusquedaCalleParams,
  CalleData,
  CreateCalleDTO,
  RawCalle,
  UpdateCalleDTO,
  UpdateSectorDTO,
} from "./calleApi/calleApi.types";

class CalleApiService extends BaseApiService<
  CalleData,
  CreateCalleDTO,
  UpdateCalleDTO,
  RawCalle
> {
  private static instance: CalleApiService;

  private constructor() {
    super(
      "/api/via",
      { normalizeItem: normalizeCalle, validateItem: isValidCalle },
      "calle_cache",
    );
  }

  static getInstance(): CalleApiService {
    if (!CalleApiService.instance)
      CalleApiService.instance = new CalleApiService();
    return CalleApiService.instance;
  }

  async getAll<P extends QueryParams = QueryParams>(
    params?: P,
  ): Promise<CalleData[]> {
    try {
      logger.log("[CalleApiService] Obteniendo vías");
      const items = await requestVias(
        params as BusquedaCalleParams | undefined,
      );
      return this.normalizeData(items);
    } catch (error) {
      logger.error("[CalleApiService] Error obteniendo vías:", error);
      throw error;
    }
  }

  async create(data: CreateCalleDTO): Promise<CalleData> {
    try {
      const response = await requestCreateVia(toCreateViaPayload(data));
      return toCreatedCalle(data, response);
    } catch (error) {
      logger.error("[CalleApiService] Error creando vía:", error);
      throw error;
    }
  }

  async update(id: number, data: UpdateCalleDTO): Promise<CalleData> {
    try {
      const payload = toUpdateViaPayload(id, data);
      await requestUpdateVia(payload);
      return toUpdatedCalle(payload);
    } catch (error) {
      logger.error("[CalleApiService] Error actualizando vía:", error);
      throw error;
    }
  }

  async buscarPorNombreVia(nombre: string): Promise<CalleData[]> {
    try {
      return this.normalizeData(await requestViasByName(this.endpoint, nombre));
    } catch (error) {
      if (isApiNotFoundError(error)) return [];
      logger.error("[CalleApiService] Error buscando vías por nombre:", error);
      throw error;
    }
  }

  async buscarPorNombre(nombre: string): Promise<CalleData[]> {
    return this.buscarPorNombreVia(nombre);
  }

  async actualizarSector(
    sectorId: number,
    data: UpdateSectorDTO,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      return await requestUpdateSector(sectorId, data);
    } catch (error) {
      logger.error("[CalleApiService] Error actualizando sector:", error);
      throw error;
    }
  }
}

const calleService = CalleApiService.getInstance();
export default calleService;
export { CalleApiService };
