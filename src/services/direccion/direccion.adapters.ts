import type {
  BusquedaDireccionParams,
  CreateDireccionDTO,
  DireccionApiResponse,
  DireccionData,
  DireccionMutationResponse,
  DireccionRaw,
  DireccionRequestPayload,
  UpdateDireccionDTO,
} from "./direccion.types";

const positiveIntegerOrNull = (
  value: number | null | undefined,
): number | null => (value && value > 0 ? Math.floor(Number(value)) : null);

const optionalInteger = (
  value: string | number | undefined,
): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const getCodLado = (lado?: string): number => {
  if (lado === "PAR" || lado === "8101") return 8101;
  if (lado === "IMPAR" || lado === "8102") return 8102;
  return 8103;
};

export const getLadoDescription = (codLado?: number): string => {
  if (codLado === 8101) return "PAR";
  if (codLado === 8102) return "IMPAR";
  return codLado === 8103 ? "NINGUNO" : "";
};

export const normalizeDireccion = (item: DireccionRaw): DireccionData => {
  const id = item.codDireccion ?? item.id ?? 0;
  const description =
    item.direccionCompleta ??
    `${item.nombreTipoVia || "CALLE"} ${item.nombreVia || ""} ${item.cuadra ? `CUADRA ${item.cuadra}` : ""}`.trim();

  return {
    id,
    codigo: id,
    codigoSector: item.codSector ?? item.codigoSector ?? null,
    codigoBarrio: item.codBarrio ?? item.codigoBarrio ?? null,
    codigoCalle: item.codVia ?? item.codigoCalle ?? null,
    codigoTipoVia: item.codTipoVia,
    codigoBarrioVia: item.codBarrioVia,
    nombreSector: item.nombreSector ?? "",
    nombreBarrio: item.nombreBarrio ?? "",
    nombreCalle: item.nombreVia ?? item.nombreCalle ?? "",
    nombreVia: item.nombreVia ?? "",
    nombreTipoVia: item.nombreTipoVia ?? "",
    cuadra: item.cuadra != null ? String(item.cuadra) : "",
    manzana: item.manzana != null ? String(item.manzana) : "",
    lado: getLadoDescription(item.codLado),
    codLado: item.codLado ?? null,
    loteInicial: optionalInteger(item.loteInicial),
    loteFinal: optionalInteger(item.loteFinal),
    descripcion: description,
    estado: item.estado ?? "ACTIVO",
    fechaRegistro: item.fechaRegistro,
    fechaModificacion: item.fechaModificacion,
    codUsuario: item.codUsuario,
    ruta: item.codRuta,
    zona: item.codZona,
    rutaNombre: item.ruta ?? "",
    zonaNombre: item.zona ?? "",
    ubicacionAreaVerde: item.codUbicacionAreaVerde,
    ubicacionAreaVerdeNombre: item.ubicacionAreaVerde ?? "",
  };
};

export const isValidDireccion = (item: DireccionData): boolean => item.id > 0;

export const validateDireccionLots = (
  data: CreateDireccionDTO | UpdateDireccionDTO,
): void => {
  if (data.loteInicial && data.loteFinal && data.loteInicial > data.loteFinal) {
    throw new Error("El lote inicial no puede ser mayor al lote final");
  }
};

const basePayload = (
  data: CreateDireccionDTO | UpdateDireccionDTO,
  userCode: number,
): Omit<DireccionRequestPayload, "codSector" | "codBarrio"> => ({
  codVia: positiveIntegerOrNull(data.codigoCalle),
  cuadra: positiveIntegerOrNull(data.cuadra),
  manzana: data.manzana?.trim() || null,
  codLado: getCodLado(data.lado),
  loteInicial: positiveIntegerOrNull(data.loteInicial),
  loteFinal: positiveIntegerOrNull(data.loteFinal),
  codZona: positiveIntegerOrNull(data.zona),
  codRuta: positiveIntegerOrNull(data.ruta),
  codUbicacionAreaVerde: positiveIntegerOrNull(data.ubicacionAreaVerde),
  parametroBusqueda: null,
  codUsuario: userCode,
});

export const buildCreateDireccionPayload = (
  data: CreateDireccionDTO,
  userCode: number,
): DireccionRequestPayload => ({
  ...basePayload(data, userCode),
  codSector: positiveIntegerOrNull(data.codigoSector),
  codBarrio: positiveIntegerOrNull(data.codigoBarrio),
});

export const buildUpdateDireccionPayload = (
  id: number,
  data: UpdateDireccionDTO,
  userCode: number,
): DireccionRequestPayload => {
  const hasBarrio = Boolean(data.codigoBarrio && data.codigoBarrio > 0);
  return {
    ...basePayload(data, userCode),
    codDireccion: id,
    codSector: hasBarrio ? null : positiveIntegerOrNull(data.codigoSector),
    codBarrio: hasBarrio ? positiveIntegerOrNull(data.codigoBarrio) : null,
  };
};

export const buildDireccionQuery = (
  params: BusquedaDireccionParams | undefined,
  userCode: number,
): URLSearchParams => {
  const query = new URLSearchParams({
    parametrosBusqueda: params?.parametrosBusqueda || params?.nombreVia || "a",
    codUsuario: String(userCode),
  });
  if (params?.estado) query.set("estado", params.estado);
  return query;
};

const isWrapper = (value: object): value is DireccionApiResponse =>
  "success" in value;

export const unwrapDirecciones = (
  response: DireccionMutationResponse,
): DireccionRaw[] => {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== "object") {
    throw new Error(
      "El API de direcciones devolvió una estructura de respuesta no reconocida.",
    );
  }
  if (isWrapper(response)) {
    if (!response.success) {
      throw new Error(
        typeof response.data === "string"
          ? response.data
          : response.message ||
              response.mensaje ||
              "La operación de dirección falló",
      );
    }
    if (Array.isArray(response.data)) return response.data;
    if (response.data && typeof response.data === "object")
      return [response.data];
    return [];
  }
  return [response as DireccionRaw];
};

export const resolveCreatedDireccion = (
  response: DireccionMutationResponse,
): DireccionData => {
  if (typeof response === "number" || typeof response === "string") {
    const id = Number.parseInt(String(response), 10);
    if (id > 0) return normalizeDireccion({ codDireccion: id });
    throw new Error(
      String(response) || "El servidor no devolvió la dirección creada",
    );
  }
  const raw = unwrapDirecciones(response)[0];
  if (!raw) throw new Error("El API no devolvió la dirección creada");
  const normalized = normalizeDireccion(raw);
  if (!isValidDireccion(normalized)) {
    throw new Error(
      "El API no devolvió un identificador válido para la dirección creada",
    );
  }
  return normalized;
};
