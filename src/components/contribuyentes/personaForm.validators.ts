import { BUSINESS_CODES } from "../../config/constants";
import type { OptionFormat } from "../../hooks/useConstantesOptions";
import type { DocumentoConfig } from "./personaForm.types";

export const normalizarEtiquetaDocumento = (label: string): string => label
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toUpperCase()
  .trim();

export const filtrarTiposDocumento = (options: OptionFormat[], isJuridica: boolean): OptionFormat[] => {
  if (isJuridica) {
    const ruc = options.find((option) => normalizarEtiquetaDocumento(option.label).includes("RUC"));
    return ruc ? [ruc] : [{ value: BUSINESS_CODES.TIPO_DOCUMENTO.RUC, label: "RUC", id: BUSINESS_CODES.TIPO_DOCUMENTO.RUC }];
  }
  return options.filter((option) => {
    const code = String(option.value).trim();
    const label = normalizarEtiquetaDocumento(option.label);
    const dni = (code === BUSINESS_CODES.TIPO_DOCUMENTO.DNI || label.includes("DNI")) && !label.includes("SIN DNI");
    const birthCertificate = label.includes("PARTIDA") && label.includes("NACIMIENTO");
    const withoutDni = label.includes("SIN DNI");
    const foreignCard = code === BUSINESS_CODES.TIPO_DOCUMENTO.CE || label.includes("CARNET") || label.includes("EXTRANJER");
    return dni || birthCertificate || withoutDni || foreignCard;
  });
};

export const obtenerConfiguracionDocumento = (type: unknown, options: OptionFormat[]): DocumentoConfig => {
  const code = String(type ?? "").trim();
  const label = normalizarEtiquetaDocumento(options.find((option) => String(option.value).trim() === code)?.label || "");
  if (code === BUSINESS_CODES.TIPO_DOCUMENTO.DNI || (label.includes("DNI") && !label.includes("SIN DNI"))) {
    return { pattern: /^\d{8}$/, maxLength: 8, placeholder: "12345678", errorMessage: "DNI debe tener 8 dígitos" };
  }
  if (code === BUSINESS_CODES.TIPO_DOCUMENTO.RUC || label.includes("RUC")) {
    return { pattern: /^\d{11}$/, maxLength: 11, placeholder: "20123456789", errorMessage: "RUC debe tener 11 dígitos" };
  }
  if (code === BUSINESS_CODES.TIPO_DOCUMENTO.CE || label.includes("CARNET") || label.includes("EXTRANJER")) {
    return { pattern: /^\d{9}$/, maxLength: 9, placeholder: "123456789", errorMessage: "Carnet de Extranjería debe tener 9 dígitos" };
  }
  if (label.includes("PARTIDA") && label.includes("NACIMIENTO")) {
    return { pattern: /^\d{1,15}$/, maxLength: 15, placeholder: "Número de partida", errorMessage: "Partida de Nacimiento debe tener entre 1 y 15 dígitos" };
  }
  if (label.includes("SIN DNI")) {
    return { pattern: /^\d{1,15}$/, maxLength: 15, placeholder: "Número identificador", errorMessage: "Sin DNI debe tener entre 1 y 15 dígitos" };
  }
  return { pattern: /^\d{1,15}$/, maxLength: 15, placeholder: "Número", errorMessage: "El documento debe contener únicamente números" };
};

export const soloNumeros = (value: string, maxLength: number): string => value.replace(/\D/g, "").slice(0, maxLength);
export const soloLetras = (value: string): string => value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "");

export const fechaFormulario = (value: Date | string | null): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
