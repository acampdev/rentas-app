import type {
  BusquedaContribuyenteParams,
  ContribuyenteData,
  ContribuyenteDetalle,
  ContribuyenteRaw,
  CreateContribuyenteAPIDTO,
} from "./contribuyente.types";

const fullName = (item: ContribuyenteRaw): string => {
  const legal = ["0302", "Juridica", "JURIDICA"].includes(
    item.tipoPersona || item.codTipopersona || item.tipoContribuyente || "",
  );
  if (legal && item.razonSocial) return item.razonSocial;
  return (
    [
      item.apellidoPaterno || item.apellidopaterno,
      item.apellidoMaterno || item.apellidomaterno,
      item.nombres,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    item.nombres ||
    "Sin nombre"
  );
};

export const normalizeContributor = (
  item: ContribuyenteRaw,
): ContribuyenteData => ({
  codigo: item.codContribuyente || item.codigo || 0,
  codigoPersona: item.codPersona || item.codigoPersona || 0,
  tipoPersona: /natural/i.test(item.tipoContribuyente || "")
    ? "0301"
    : /juridica/i.test(item.tipoContribuyente || "")
      ? "0302"
      : item.tipoPersona || item.codTipopersona || "0301",
  tipoDocumento: item.tipoDocumento || item.codTipoDocumento || "",
  numeroDocumento: item.numeroDocumento || item.numerodocumento || "",
  nombres: item.nombres || "",
  apellidoPaterno: item.apellidoPaterno || item.apellidopaterno || "",
  apellidoMaterno: item.apellidoMaterno || item.apellidomaterno || "",
  razonSocial: item.razonSocial || "",
  nombreCompleto: item.nombreCompleto || item.nombrePersona || fullName(item),
  direccion: item.direccion === "null" ? "" : item.direccion || "",
  telefono: item.telefono || "",
  email: item.email || "",
  fechaNacimiento: item.fechaNacimiento || item.fechanacimiento,
  estadoCivil: item.estadoCivil || item.codestadocivil,
  sexo: item.sexo || item.codsexo,
  lote: item.lote || "",
  estado: item.estado || item.codestado || "ACTIVO",
  fechaRegistro: item.fechaRegistro || item.fechaNacimientoStr,
  codUsuario: item.codUsuario,
  tipoContribuyente: item.tipoContribuyente || "",
  esExonerado: item.esExonerado ?? null,
  esPensionista: item.esPensionista ?? null,
  conyuge: item.conyugeNombres
    ? {
        nombres: item.conyugeNombres,
        apellidoPaterno: item.conyugeApellidopaterno || "",
        apellidoMaterno: item.conyugeApellidomaterno || "",
        numeroDocumento: item.conyugeNumeroDocumento || "",
        tipoDocumento: item.conyugeTipoDocumento || "",
      }
    : undefined,
  representanteLegal: item.repreNombres
    ? {
        nombres: item.repreNombres,
        apellidoPaterno: item.repreApellidopaterno || "",
        apellidoMaterno: item.repreApellidomaterno || "",
        numeroDocumento: item.repreNumeroDocumento || "",
        tipoDocumento: item.repreTipoDocumento || "",
      }
    : undefined,
});

export const unwrapContributorList = (payload: unknown): ContribuyenteRaw[] => {
  if (Array.isArray(payload)) return payload as ContribuyenteRaw[];
  if (!payload || typeof payload !== "object") return [];
  const object = payload as Record<string, unknown>;
  if (Array.isArray(object.data)) return object.data as ContribuyenteRaw[];
  if (object.data && typeof object.data === "object")
    return [object.data as ContribuyenteRaw];
  return ["codContribuyente", "numerodocumento", "nombres"].some(
    (key) => key in object,
  )
    ? [object as ContribuyenteRaw]
    : [];
};

export const unwrapContributorDetail = (
  payload: unknown,
): ContribuyenteDetalle | null => {
  const value = Array.isArray(payload)
    ? payload[0]
    : payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;
  const detail = Array.isArray(value) ? value[0] : value;
  if (
    !detail ||
    typeof detail !== "object" ||
    !("codPersona" in detail || "codContribuyente" in detail)
  )
    return null;
  return detail as ContribuyenteDetalle;
};

export const createdContributor = (
  payload: unknown,
  dto: CreateContribuyenteAPIDTO,
): ContribuyenteData | ContribuyenteRaw | null => {
  const object =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;
  const value = object && "data" in object ? object.data : payload;
  const numericId =
    typeof value === "number" ||
    (typeof value === "string" && /^\d+$/.test(value))
      ? Number(value)
      : 0;
  if (numericId > 0)
    return {
      codigo: numericId,
      codigoPersona: dto.codPersona,
      tipoPersona: "",
      tipoDocumento: "",
      numeroDocumento: "",
      nombreCompleto: "",
      estado: "ACTIVO",
      codUsuario: dto.codUsuario,
      esExonerado: dto.esExonerado ?? false,
      esPensionista: dto.esPensionista ?? false,
    };
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && typeof raw === "object" ? (raw as ContribuyenteRaw) : null;
};

export const hasContributorFilters = (
  criteria: BusquedaContribuyenteParams,
): boolean =>
  [
    criteria.parametroBusqueda,
    criteria.nombre,
    criteria.numeroDocumento,
    criteria.codigoContribuyente,
    criteria.codigoPersona,
    criteria.codigo,
    criteria.codTipoContribuyente,
    criteria.tipoPersona,
    criteria.esExonerado,
    criteria.esPensionista,
  ].some((value) => value != null && String(value).trim() !== "");

const booleanParam = (value: boolean | number | string | undefined): string =>
  value == null || value === ""
    ? ""
    : value === true || value === 1 || value === "1"
      ? "1"
      : "0";

export const buildContributorSearchParams = (
  criteria: BusquedaContribuyenteParams,
): URLSearchParams => {
  let query =
    criteria.parametroBusqueda && criteria.parametroBusqueda !== "a"
      ? criteria.parametroBusqueda
      : criteria.nombre || criteria.numeroDocumento || "";
  let code =
    criteria.codigoContribuyente ??
    criteria.codigo ??
    criteria.codigoPersona ??
    "";
  if (!code && /^\d{1,6}$/.test(query)) {
    code = query;
    query = "";
  }
  return new URLSearchParams({
    parametroBusqueda: query,
    codigoContribuyente: String(code),
    codTipoContribuyente:
      criteria.codTipoContribuyente ||
      (criteria.tipoPersona && !["0301", "0302"].includes(criteria.tipoPersona)
        ? criteria.tipoPersona
        : ""),
    esExonerado: booleanParam(criteria.esExonerado),
    esPensionista: booleanParam(criteria.esPensionista),
  });
};
