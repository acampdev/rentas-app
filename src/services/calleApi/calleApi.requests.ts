import { buildApiUrl } from "../../config/api.unified.config";
import apiClient, { unwrapApiData, unwrapApiList } from "../apiClient";
import type {
  BusquedaCalleParams,
  CreateViaPayload,
  RawCalle,
  UpdateSectorDTO,
  UpdateViaPayload,
} from "./calleApi.types";

const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const requestVias = async (params?: BusquedaCalleParams) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) query.set(key, String(value));
  });
  const suffix = query.size ? `?${query.toString()}` : "";
  const response = await apiClient.request<unknown>(
    `${buildApiUrl("/api/via/listarVia")}${suffix}`,
    {
      method: "GET",
      headers: jsonHeaders,
    },
  );
  return unwrapApiList<RawCalle>(response);
};

export const requestCreateVia = async (payload: CreateViaPayload) => {
  const response = await apiClient.request<unknown>(
    buildApiUrl("/api/via/insertarVias"),
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    },
  );
  return unwrapApiData<RawCalle>(response);
};

export const requestUpdateVia = (payload: UpdateViaPayload) =>
  apiClient.request<unknown>(buildApiUrl("/api/via/actualizarVias"), {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

export const requestViasByName = async (endpoint: string, nombre: string) => {
  const response = await apiClient.request<unknown>(
    `${buildApiUrl(`${endpoint}/buscar`)}?nombre=${encodeURIComponent(nombre)}`,
  );
  return unwrapApiList<RawCalle>(response);
};

export const requestUpdateSector = async (
  sectorId: number,
  data: UpdateSectorDTO,
) => {
  const url = import.meta.env.DEV
    ? `/api/sector/${sectorId}`
    : buildApiUrl(`/api/sector/${sectorId}`);
  const response = await apiClient.request<unknown>(url, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  return response && typeof response === "object"
    ? (response as { success: boolean; message?: string })
    : {
        success: true,
        message: typeof response === "string" ? response : undefined,
      };
};
