// src/services/direccionService.ts
import {
  buildApiUrl,
  getAuthenticatedUserCode,
} from "../config/api.unified.config";
import BaseApiService from "./BaseApiService";
import apiClient from "./apiClient";
import {
  buildCreateDireccionPayload,
  buildDireccionQuery,
  buildUpdateDireccionPayload,
  isValidDireccion,
  normalizeDireccion,
  resolveCreatedDireccion,
  unwrapDirecciones,
  validateDireccionLots,
} from "./direccion/direccion.adapters";
import type {
  BusquedaDireccionParams,
  CreateDireccionDTO,
  DireccionApiResponse,
  DireccionData,
  DireccionMutationResponse,
  DireccionRaw,
  UpdateDireccionDTO,
} from "./direccion/direccion.types";

export type * from "./direccion/direccion.types";

const DIRECCION_ENDPOINT = "/api/direccion";

class DireccionService extends BaseApiService<
  DireccionData,
  CreateDireccionDTO,
  UpdateDireccionDTO,
  DireccionRaw
> {
  private static instance: DireccionService;

  private constructor() {
    super(
      DIRECCION_ENDPOINT,
      { normalizeItem: normalizeDireccion, validateItem: isValidDireccion },
      "direccion_cache",
    );
  }

  static getInstance(): DireccionService {
    if (!DireccionService.instance) {
      DireccionService.instance = new DireccionService();
    }
    return DireccionService.instance;
  }

  async getAll(params?: BusquedaDireccionParams): Promise<DireccionData[]> {
    const query = buildDireccionQuery(params, getAuthenticatedUserCode());
    const response = await apiClient.request<
      DireccionApiResponse | DireccionRaw[]
    >(`${buildApiUrl(this.endpoint)}?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return unwrapDirecciones(response)
      .map(normalizeDireccion)
      .filter(isValidDireccion);
  }

  obtenerTodos(): Promise<DireccionData[]> {
    return this.getAll({ estado: "ACTIVO", parametrosBusqueda: "a" });
  }

  async buscar(params: BusquedaDireccionParams): Promise<DireccionData[]> {
    const query = buildDireccionQuery(params, getAuthenticatedUserCode());
    const response = await apiClient.request<
      DireccionApiResponse | DireccionRaw[]
    >(`${buildApiUrl(this.endpoint)}?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return unwrapDirecciones(response)
      .map(normalizeDireccion)
      .filter(isValidDireccion);
  }

  buscarPorNombreVia(nombreVia: string): Promise<DireccionData[]> {
    if (!nombreVia.trim()) return this.obtenerTodos();
    return this.buscar({
      parametrosBusqueda: nombreVia.trim(),
      estado: "ACTIVO",
    });
  }

  async crearDireccion(datos: CreateDireccionDTO): Promise<DireccionData> {
    validateDireccionLots(datos);
    const payload = buildCreateDireccionPayload(
      datos,
      getAuthenticatedUserCode(),
    );
    const response = await apiClient.request<DireccionMutationResponse>(
      buildApiUrl(this.endpoint),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    return resolveCreatedDireccion(response);
  }

  async actualizarDireccion(
    id: number,
    datos: UpdateDireccionDTO,
  ): Promise<DireccionData> {
    validateDireccionLots(datos);
    const payload = buildUpdateDireccionPayload(
      id,
      datos,
      getAuthenticatedUserCode(),
    );
    const response = await apiClient.request<DireccionMutationResponse>(
      buildApiUrl(this.endpoint),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    const raw = unwrapDirecciones(response)[0];
    if (!raw) {
      throw new Error("El API no devolvió la dirección actualizada");
    }
    const updated = normalizeDireccion(raw);
    if (!isValidDireccion(updated)) {
      throw new Error(
        "El API no devolvió un identificador válido para la dirección actualizada",
      );
    }
    return updated;
  }
}

export const direccionService = DireccionService.getInstance();
export default direccionService;
