import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import type {
  ActualizarArancelApiDTO,
  ArancelData,
  ArancelListParams,
  ArancelRaw,
  CreateArancelDTO,
  CrearArancelApiDTO,
  UpdateArancelDTO,
} from "./arancel.types";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;

export const normalizeArancel = (item: ArancelRaw): ArancelData => {
  const aliases = item as unknown as Record<string, unknown>;
  const rawCode = item.codArancel ?? aliases.id ?? aliases.idArancel;
  const code = rawCode == null ? null : Number(rawCode);
  return {
    codArancel: Number.isFinite(code) ? code : null,
    anio: item.anio || new Date().getFullYear(),
    codDireccion: item.codDireccion || 0,
    costo: item.costo ?? null,
    codUsuario: item.codUsuario ?? null,
    costoArancel: Number.parseFloat(
      String(item.costoArancel || item.costo || 0),
    ),
    direccionCompleta: item.direccionCompleta || "",
    sector: item.sector ?? "",
    barrio: item.barrio ?? "",
    calle: item.calle ?? "",
  };
};

export const isValidArancel = (item: ArancelData): boolean =>
  Boolean(item.anio && item.codDireccion && item.costoArancel >= 0);

export const unwrapArancelList = (response: unknown): ArancelRaw[] => {
  if (Array.isArray(response)) return response as ArancelRaw[];
  const record = asRecord(response);
  if (!record) return [];
  if (Array.isArray(record.data)) return record.data as ArancelRaw[];
  if (asRecord(record.data)) return [record.data as unknown as ArancelRaw];
  return "anio" in record && "codDireccion" in record
    ? [record as unknown as ArancelRaw]
    : [];
};

export const normalizeArancelMutation = (
  response: unknown,
): ArancelData | null => {
  const record = asRecord(response);
  const payload = record && "success" in record ? record.data : response;
  const candidate = Array.isArray(payload) ? payload[0] : payload;
  const raw = asRecord(candidate);
  return raw && "anio" in raw && "codDireccion" in raw
    ? normalizeArancel(raw as unknown as ArancelRaw)
    : null;
};

export const buildArancelQuery = (
  params: ArancelListParams = {},
  defaultSearch = "",
): string => {
  const query = new URLSearchParams({
    codDireccion:
      params.codDireccion && params.codDireccion > 0
        ? String(params.codDireccion)
        : "",
    anio: params.anio && params.anio > 0 ? String(params.anio) : "",
    parametroBusqueda: params.parametroBusqueda ?? defaultSearch,
    codUsuario: String(getAuthenticatedUserCode()),
  });
  return `?${query.toString()}`;
};

export const buildArancelFormData = (
  data: CreateArancelDTO | UpdateArancelDTO,
): FormData => {
  const form = new FormData();
  if (data.anio !== undefined) form.append("anio", String(data.anio));
  if (data.codDireccion !== undefined) {
    form.append("codDireccion", String(data.codDireccion));
  }
  if (data.costoArancel !== undefined) {
    form.append("costoArancel", String(data.costoArancel));
  }
  form.append("codUsuario", String(getAuthenticatedUserCode()));
  return form;
};

export const buildCreateArancelPayload = (data: CrearArancelApiDTO) => {
  if (
    !data.anio ||
    !data.codDireccion ||
    data.costo === undefined ||
    !data.codUsuario
  ) {
    throw new Error("Faltan datos requeridos para crear el arancel");
  }
  return {
    codArancel: null,
    anio: Number(data.anio),
    codDireccion: Number(data.codDireccion),
    costo: Number(data.costo),
    codUsuario: Number(data.codUsuario),
  };
};

export const buildUpdateArancelPayload = (data: ActualizarArancelApiDTO) => {
  if (
    !data.codArancel ||
    !data.anio ||
    !data.codDireccion ||
    data.costo === undefined ||
    !data.codUsuario
  ) {
    throw new Error("Faltan datos requeridos para actualizar el arancel");
  }
  return {
    codArancel: Number(data.codArancel),
    anio: Number(data.anio),
    codDireccion: Number(data.codDireccion),
    costo: Number(data.costo),
    codUsuario: Number(data.codUsuario),
  };
};
