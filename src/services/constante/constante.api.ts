import { buildApiUrl } from "../../config/api.unified.config";
import { logger } from "../../utils/logger";
import apiClient, { isApiNotFoundError } from "../apiClient";
import type {
  CatalogoRaw,
  ConstanteRaw,
  GrupoUsoData,
  RutaData,
  UbicacionAreaVerdeData,
  UsoPredioData,
  UsoPredioRaw,
  ZonaData,
} from "./constante.types";

const ENDPOINT = "/api/constante";

export const toApiList = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];
  const data = (payload as { data?: unknown }).data;
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") return [data as T];
  return [payload as T];
};

async function requestList<T>(path: string): Promise<T[]> {
  try {
    return toApiList<T>(
      await apiClient.request<unknown>(buildApiUrl(`${ENDPOINT}${path}`)),
    );
  } catch (error) {
    if (isApiNotFoundError(error)) return [];
    throw error;
  }
}

export async function fetchConstants(relation: "Padre" | "Hijo", code: string) {
  try {
    return await requestList<ConstanteRaw>(
      `/listarConstante${relation}?codConstante=${code}`,
    );
  } catch (error) {
    logger.error(
      `[ConstanteService] Error ${relation.toLowerCase()} ${code}:`,
      error,
    );
    throw error;
  }
}

const mapCatalog = (item: CatalogoRaw) => ({
  codigo: item.codigo || 0,
  descripcion: item.descripcion || "",
  abreviatura: item.abreviatura || "",
});

export async function fetchRoutes(): Promise<RutaData[]> {
  return (await requestList<CatalogoRaw>("/listarRuta")).map(mapCatalog);
}

export async function fetchZones(): Promise<ZonaData[]> {
  return (await requestList<CatalogoRaw>("/listarZona")).map(mapCatalog);
}

export async function fetchUseGroups(): Promise<GrupoUsoData[]> {
  return (await requestList<CatalogoRaw>("/listarGrupoUso")).map(
    ({ codigo, descripcion }) => ({
      codigo: codigo || 0,
      descripcion: descripcion || "",
    }),
  );
}

export async function fetchGreenAreaLocations(): Promise<
  UbicacionAreaVerdeData[]
> {
  return (await requestList<CatalogoRaw>("/listarUbicacionAreaVerde")).map(
    mapCatalog,
  );
}

export async function fetchPropertyUses(): Promise<UsoPredioData[]> {
  const items = await requestList<UsoPredioRaw>("/listarUsoPredio");
  return items
    .map((item) => ({
      codUso: Number(item.codUso ?? 0),
      descripcion: String(item.descripcion ?? "").trim(),
      codCriterio: Number(item.codCriterio ?? 0),
      anio: Number(item.anio ?? 0),
      codGrupoUso: Number(item.codGrupoUso ?? 0),
    }))
    .filter((item) => item.codUso > 0 && item.descripcion !== "");
}
