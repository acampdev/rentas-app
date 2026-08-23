import { BUSINESS_CODES } from "../../config/constants";
import type { ContribuyenteFormValues } from "../../hooks/useContribuyenteForm";
import type { PersonaData } from "../../services/personaService";

export const adaptarPersonaAFormulario = (
  persona: PersonaData,
  isJuridica: boolean,
  tipoDocumento: string,
  numeroDocumento: string,
): Partial<ContribuyenteFormValues> => ({
  codPersona: persona.codPersona,
  tipoDocumento: String(persona.codTipoDocumento || tipoDocumento),
  numeroDocumento: persona.numerodocumento || numeroDocumento,
  nombres: isJuridica ? "" : (persona.nombres || ""),
  razonSocial: isJuridica ? (persona.razonSocial || persona.nombres || "") : "",
  apellidoPaterno: persona.apellidopaterno || "",
  apellidoMaterno: persona.apellidomaterno || "",
  fechaNacimiento: persona.fechanacimiento ? String(persona.fechanacimiento).slice(0, 10) : null,
  estadoCivil: persona.codestadocivil || "",
  sexo: persona.codsexo || BUSINESS_CODES.SEXO.MASCULINO,
  telefono: persona.telefono || "",
  direccion: persona.codDireccion ? { id: persona.codDireccion, descripcion: persona.direccion || "Dirección registrada" } : null,
  nFinca: persona.lote != null ? String(persona.lote) : "",
  otroNumero: persona.otros || "",
});

export const CAMPOS_PERSONA_EXISTENTE: Array<keyof ContribuyenteFormValues> = [
  "codPersona", "nombres", "razonSocial", "apellidoPaterno", "apellidoMaterno",
  "fechaNacimiento", "estadoCivil", "sexo", "telefono", "direccion", "nFinca", "otroNumero",
];

export const limpiarPersonaEncontrada = (): Partial<ContribuyenteFormValues> => ({
  codPersona: null,
  nombres: "",
  razonSocial: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  fechaNacimiento: null,
  estadoCivil: "",
  sexo: BUSINESS_CODES.SEXO.MASCULINO,
  telefono: "",
  direccion: null,
  nFinca: "",
  otroNumero: "",
});
