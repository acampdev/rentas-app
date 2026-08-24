import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import type { ContribuyenteData } from "../contribuyenteService";
import type {
  CreatePersonaAPIDTO,
  CreatePersonaDTO,
  DocumentoValidation,
  PersonaApiPayload,
  PersonaData,
  PersonaRaw,
  UpdatePersonaDTO,
} from "./persona.types";

const PERSONA_JURIDICA = "0302";
const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;

const parseCode = (value: unknown): number => {
  if (typeof value === "number") return value;
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const buildPersonaName = (item: Partial<PersonaRaw>): string => {
  if (item.codTipopersona === PERSONA_JURIDICA && item.razonSocial) {
    return item.razonSocial;
  }
  return (
    [item.apellidopaterno, item.apellidomaterno, item.nombres]
      .filter(Boolean)
      .join(" ")
      .trim() || "Sin nombre"
  );
};

export const normalizePersona = (item: PersonaRaw): PersonaData => {
  const aliases = item as unknown as Record<string, unknown>;
  const codPersona = parseCode(
    item.codPersona ??
      aliases.codpersona ??
      aliases.codigoPersona ??
      aliases.codigo ??
      aliases.id,
  );
  return {
    codPersona,
    codTipopersona: item.codTipopersona || "",
    codTipoDocumento: String(item.codTipoDocumento ?? ""),
    numerodocumento: item.numerodocumento || "",
    nombres: item.nombres || "",
    apellidomaterno: item.apellidomaterno || "",
    apellidopaterno: item.apellidopaterno || "",
    razonSocial: item.razonSocial || "",
    direccion: item.direccion === "null" ? null : item.direccion || null,
    fechanacimiento: item.fechanacimiento,
    codestadocivil: String(item.codestadocivil ?? ""),
    codsexo: String(item.codsexo ?? ""),
    telefono: item.telefono || "",
    email: item.email || "",
    codDireccion: item.codDireccion,
    lote: item.lote,
    otros: item.otros,
    parametroBusqueda: item.parametroBusqueda,
    codUsuario: item.codUsuario || item.usuario,
    nombrePersona: item.nombrePersona || buildPersonaName(item),
    estado: item.estado || "ACTIVO",
    fechaRegistro: item.fechaRegistro || undefined,
  };
};

export const unwrapPersonaList = (response: unknown): PersonaRaw[] => {
  if (Array.isArray(response)) return response as PersonaRaw[];
  const record = asRecord(response);
  if (!record) return [];
  if (Array.isArray(record.data)) return record.data as PersonaRaw[];
  if (asRecord(record.data)) return [record.data as unknown as PersonaRaw];
  return record.codPersona ? [record as unknown as PersonaRaw] : [];
};

export const buildPersonaPayload = (
  data: CreatePersonaDTO | UpdatePersonaDTO,
): PersonaApiPayload => ({
  ...("codPersona" in data ? { codPersona: data.codPersona } : {}),
  codTipopersona: data.codTipopersona || "0301",
  codTipoDocumento: String(data.codTipoDocumento || "4101"),
  numerodocumento: String(data.numerodocumento),
  nombres: data.nombres,
  apellidomaterno: data.apellidomaterno,
  apellidopaterno: data.apellidopaterno,
  fechanacimiento: data.fechanacimiento,
  codestadocivil: String(data.codestadocivil || "1801"),
  codsexo: String(data.codsexo || "2001"),
  telefono: data.telefono || "",
  codDireccion: data.codDireccion ?? 2,
  lote: data.lote ?? null,
  otros: data.otros ?? null,
  parametroBusqueda: data.parametroBusqueda ?? null,
  usuario: getAuthenticatedUserCode(),
});

export const resolveCreatedPersona = (
  response: unknown,
  data: CreatePersonaDTO,
): PersonaData => {
  const record = asRecord(response);
  const responseData = record?.data ?? response;
  const code = parseCode(responseData);
  if (code > 0) {
    return normalizePersona({
      codPersona: code,
      codTipopersona: data.codTipopersona || "0301",
      codTipoDocumento: String(data.codTipoDocumento || "4101"),
      numerodocumento: data.numerodocumento || "",
      nombres: data.nombres || "",
      apellidomaterno: data.apellidomaterno || "",
      apellidopaterno: data.apellidopaterno || "",
      fechanacimiento: data.fechanacimiento,
      codestadocivil: String(data.codestadocivil || "1801"),
      codsexo: String(data.codsexo || "2001"),
      telefono: data.telefono || "",
      codDireccion: data.codDireccion || null,
      lote: data.lote,
      otros: data.otros || null,
      parametroBusqueda: null,
      codUsuario: getAuthenticatedUserCode(),
    });
  }

  let raw = asRecord(responseData) ? responseData : record;
  if (Array.isArray(responseData)) raw = asRecord(responseData[0]);
  if (raw) return normalizePersona(raw as unknown as PersonaRaw);
  throw new Error(
    "La respuesta del servidor no contiene un ID de persona válido.",
  );
};

export const resolveUpdatedPersona = (
  response: unknown,
  payload: PersonaApiPayload,
): PersonaData => {
  const record = asRecord(response);
  const raw = record?.data ?? response;
  const item = Array.isArray(raw) ? raw[0] : raw;
  return normalizePersona((asRecord(item) ?? payload) as unknown as PersonaRaw);
};

const dateOnly = (value: unknown): string | null => {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return typeof value === "string" ? value.split("T")[0] : null;
};

const textValue = (...values: unknown[]): string => {
  const value = values.find(
    (candidate) =>
      candidate !== undefined && candidate !== null && candidate !== "",
  );
  return value === undefined ? "" : String(value);
};

const nullableScalar = (value: unknown): string | number | null =>
  typeof value === "string" || typeof value === "number" ? value : null;

export const mapPersonaFormToApi = (input: object): CreatePersonaAPIDTO => {
  const form = input as Record<string, unknown>;
  const address = asRecord(form.direccion);
  const codDireccion =
    form.codDireccion != null
      ? Number(form.codDireccion)
      : parseCode(address?.id ?? address?.codigo ?? address?.codigoSector) || 2;
  return {
    codTipopersona:
      textValue(form.tipoPersona, form.codTipopersona) ||
      (form.isJuridica ? "0302" : "0301"),
    codTipoDocumento:
      textValue(form.tipoDocumento, form.codTipoDocumento) || "4101",
    numerodocumento: textValue(form.numeroDocumento, form.numerodocumento),
    nombres: textValue(form.nombres, form.razonSocial),
    apellidomaterno: textValue(form.apellidoMaterno, form.apellidomaterno),
    apellidopaterno: textValue(form.apellidoPaterno, form.apellidopaterno),
    fechanacimiento:
      dateOnly(form.fechaNacimiento) ||
      dateOnly(form.fechanacimiento) ||
      "1998-02-23",
    codestadocivil: textValue(form.estadoCivil, form.codestadocivil) || "1801",
    codsexo: textValue(form.sexo, form.codsexo) || "2001",
    telefono: textValue(form.telefono),
    codDireccion,
    lote: nullableScalar(
      form.lote ??
        (form.nFinca ? Number(form.nFinca) || textValue(form.nFinca) : null),
    ),
    otros: textValue(form.otros, form.otroNumero) || null,
    parametroBusqueda: null,
    usuario: getAuthenticatedUserCode(),
    codUsuario: getAuthenticatedUserCode(),
  };
};

export const mapPersonaToContribuyente = (
  persona: PersonaData,
): Partial<ContribuyenteData> => ({
  codigoPersona: persona.codPersona,
  tipoPersona: persona.codTipopersona || undefined,
  tipoDocumento: persona.codTipoDocumento || undefined,
  numeroDocumento: persona.numerodocumento,
  nombres: persona.nombres || "",
  apellidoPaterno: persona.apellidopaterno || "",
  apellidoMaterno: persona.apellidomaterno || "",
  razonSocial: persona.razonSocial || "",
  nombreCompleto: persona.nombrePersona,
  direccion: persona.direccion || "",
  telefono: persona.telefono || "",
  email: persona.email || "",
  fechaNacimiento:
    typeof persona.fechanacimiento === "number"
      ? persona.fechanacimiento
      : persona.fechanacimiento
        ? new Date(persona.fechanacimiento).getTime()
        : undefined,
  estadoCivil: persona.codestadocivil || undefined,
  sexo: persona.codsexo || undefined,
  lote: persona.lote ? String(persona.lote) : undefined,
  estado: persona.estado || "ACTIVO",
});

const documentRules: Record<string, { pattern: RegExp; message: string }> = {
  DNI: {
    pattern: /^\d{8}$/,
    message: "El DNI debe tener exactamente 8 dígitos",
  },
  RUC: {
    pattern: /^\d{10}$/,
    message: "El RUC debe tener exactamente 10 dígitos",
  },
  CE: {
    pattern: /^\d{9}$/,
    message: "El Carnet de Extranjería debe tener exactamente 9 dígitos",
  },
  PARTIDA_NACIMIENTO: {
    pattern: /^\d{1,15}$/,
    message: "La Partida de Nacimiento debe tener entre 1 y 15 dígitos",
  },
};

const documentAliases: Record<string, keyof typeof documentRules> = {
  "0101": "DNI",
  "4101": "DNI",
  "0102": "RUC",
  "4102": "RUC",
  "0103": "CE",
  "4103": "CE",
  "4104": "PARTIDA_NACIMIENTO",
};

export const validatePersonaDocument = (
  type: string,
  number: string,
): DocumentoValidation => {
  if (!number)
    return { valido: false, mensaje: "El número de documento es requerido" };
  const rule = documentRules[documentAliases[type] ?? type];
  return !rule || rule.pattern.test(number)
    ? { valido: true }
    : { valido: false, mensaje: rule.message };
};
