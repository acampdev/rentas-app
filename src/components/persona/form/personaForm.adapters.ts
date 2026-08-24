import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type {
  CreatePersonaAPIDTO,
  PersonaData,
} from "../../../services/personaService";
import type { ContribuyenteDireccion } from "../../../types/formTypes";
import type { DocumentoConfig, PersonaFormValues } from "./personaForm.types";

export const createEmptyPersonaFormValues = (): PersonaFormValues => ({
  codTipopersona: "0301",
  codTipoDocumento: "4101",
  numerodocumento: "",
  nombres: "",
  apellidopaterno: "",
  apellidomaterno: "",
  fechanacimiento: "",
  codestadocivil: "",
  codsexo: "",
  telefono: "",
  nFinca: "",
  otroNumero: "",
});

const documentOrder = (label: string): number => {
  const name = label.toUpperCase();
  const isForeignerCard =
    name.includes("CARNET") ||
    name.includes("EXTRANJ") ||
    /\bC\.?E\.?\b/.test(name);
  if (name.includes("DNI") && !name.includes("SIN")) return 1;
  if (name.includes("PARTIDA")) return 2;
  if (name.includes("SIN DNI")) return 3;
  if (isForeignerCard) return 4;
  if (name.includes("RUC")) return 5;
  return 99;
};

export const sortDocumentOptions = (options: OptionFormat[]): OptionFormat[] =>
  [...options].sort(
    (left, right) => documentOrder(left.label) - documentOrder(right.label),
  );

export const getAvailableOptionValue = (
  options: OptionFormat[],
  value: string,
): string =>
  options.some((option) => String(option.value) === value) ? value : "";

export const getDocumentoConfig = (
  options: OptionFormat[],
  documentType: string,
): DocumentoConfig => {
  const name =
    options
      .find((option) => String(option.value) === documentType)
      ?.label.toUpperCase() ?? "";
  const isForeignerCard =
    name.includes("CARNET") ||
    name.includes("EXTRANJ") ||
    /\bC\.?E\.?\b/.test(name);
  if (
    (name.includes("DNI") && !name.includes("SIN")) ||
    documentType === "4101"
  ) {
    return { maxLength: 8, helperText: "DNI: 8 dígitos" };
  }
  if (name.includes("PARTIDA") || name.includes("SIN DNI")) {
    return {
      maxLength: 15,
      helperText: name.includes("SIN")
        ? "Sin DNI: de 1 a 15 dígitos"
        : "Partida de nacimiento: de 1 a 15 dígitos",
    };
  }
  if (isForeignerCard || documentType === "4103") {
    return { maxLength: 9, helperText: "Carnet de extranjería: 9 dígitos" };
  }
  if (name.includes("RUC") || documentType === "4102") {
    return { maxLength: 10, helperText: "RUC: 10 dígitos" };
  }
  return { maxLength: 15, helperText: "" };
};

export const normalizeDocumentNumber = (
  value: string,
  maxLength: number,
): string => value.replace(/\D/g, "").slice(0, maxLength);

export const mapPersonaToForm = (persona: PersonaData): PersonaFormValues => ({
  codTipopersona: persona.codTipopersona || "0301",
  codTipoDocumento: persona.codTipoDocumento || "4101",
  numerodocumento: persona.numerodocumento || "",
  nombres: persona.nombres || persona.razonSocial || "",
  apellidopaterno: persona.apellidopaterno || "",
  apellidomaterno: persona.apellidomaterno || "",
  fechanacimiento: String(persona.fechanacimiento || "").slice(0, 10),
  codestadocivil: persona.codestadocivil || "",
  codsexo: persona.codsexo || "",
  telefono: persona.telefono || "",
  nFinca: persona.lote != null ? String(persona.lote) : "",
  otroNumero: persona.otros || "",
});

export const getPersonaAddress = (
  persona: PersonaData,
): ContribuyenteDireccion | null =>
  persona.codDireccion
    ? {
        id: persona.codDireccion,
        descripcion: persona.direccion || "Dirección registrada",
      }
    : null;

export const buildFullAddress = (
  address: ContribuyenteDireccion | null,
  finca: string,
  otherNumber: string,
): string => {
  if (!address) return "";
  return [
    address.descripcion,
    finca.trim() ? `N.º Finca ${finca.trim()}` : "",
    otherNumber.trim() ? `Otro N.º ${otherNumber.trim()}` : "",
  ]
    .filter(Boolean)
    .join(" - ");
};

export const buildPersonaPayload = (
  values: PersonaFormValues,
  address: ContribuyenteDireccion | null,
  userCode: number,
): CreatePersonaAPIDTO => {
  const { nFinca, otroNumero, ...personaValues } = values;
  return {
    ...personaValues,
    fechanacimiento: values.fechanacimiento || "1998-02-23",
    codestadocivil: values.codestadocivil || "1801",
    codsexo: values.codsexo || "2001",
    codDireccion: address?.id ?? null,
    lote: nFinca.trim() || null,
    otros: otroNumero.trim() || null,
    usuario: userCode,
  };
};
