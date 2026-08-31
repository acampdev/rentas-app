import type { Predio } from "../../../models/Predio";
import type { CreateSubdivicionDTO } from "../../../services/subdivicionService";
import type { SubdivicionFormData } from "./subdivicion.types";

const today = () => new Date().toISOString().slice(0, 10);

export const normalizePositiveDecimalInput = (value: string): string | null => {
  const normalized = value.replace(",", ".");
  return /^\d*(?:\.\d*)?$/.test(normalized) ? normalized : null;
};

export const createInitialSubdivicionForm = (): SubdivicionFormData => ({
  anio: new Date().getFullYear(),
  predioMatriz: null,
  codPredioMatriz: "",
  areaTerrenoNuevaMatriz: "",
  valorTerrenoNuevoMatriz: "",
  codDireccionNuevo: "",
  numeroFincaNuevo: "",
  otroNumeroNuevo: "",
  codClasificacionNuevo: "",
  estPredioNuevo: "",
  codTipoPredioNuevo: "",
  codCondicionPropiedadNuevo: "",
  codUsoNuevo: "",
  fechaAdquisicionNuevo: today(),
  codListaConductorNuevo: "",
  areaTerrenoNuevo: "",
  valorOtrasInstalacionesNuevo: "",
  fechaSubdivision: today(),
  periodoEfectivoArbitrios: String(new Date().getMonth() + 1),
});

export const getFullPredioCode = (predio: Predio): string => {
  const fullCode = String(predio.codPredio || predio.codigoPredio || "").trim();
  const year = String(predio.anio || "").trim();
  const base = String(predio.codPredioBase || "").trim();
  if (fullCode && (!base || fullCode !== base)) return fullCode;
  return year && base ? `${year}${base}` : fullCode || base;
};

export const getMatrixAddress = (predio: Predio | null): string => {
  if (!predio) return "";
  const address = String(predio.direccion || predio.direccionCompleta || "");
  return address
    .replace(/,?\s*(?:LT|Lote)\s*(?:N[.º°o]*\s*)?\d+[A-Za-z]?/gi, "")
    .replace(/[,\-\s]+$/, "")
    .trim();
};

const getAddressText = (predio: Predio): string =>
  String(predio.direccion || predio.direccionCompleta || "");

const extractLotNumber = (predio: Predio): string => {
  const explicitLot = String(predio.numeroFinca ?? "").trim();
  if (explicitLot) return explicitLot;

  return (
    getAddressText(predio).match(
      /\b(?:LT|Lote)\.?\s*(?:N[.º°o]*\s*)?[:#-]?\s*(\d+[A-Za-z]?)/i,
    )?.[1] ?? ""
  );
};

const extractOtherNumber = (predio: Predio): string => {
  const explicitOther = String(predio.otroNumero ?? "").trim();
  if (explicitOther) return explicitOther;

  return (
    getAddressText(predio).match(
      /\bOtro\s*(?:N[.º°o]*\s*)?[:#-]?\s*(\d+[A-Za-z]?)/i,
    )?.[1] ?? ""
  );
};

export const applySelectedPredio = (
  form: SubdivicionFormData,
  predio: Predio,
): SubdivicionFormData => ({
  ...form,
  predioMatriz: predio,
  anio: Number(predio.anio) || form.anio,
  codPredioMatriz: getFullPredioCode(predio),
  areaTerrenoNuevaMatriz:
    predio.areaTerreno !== null && predio.areaTerreno !== undefined
      ? String(predio.areaTerreno)
      : form.areaTerrenoNuevaMatriz,
  valorTerrenoNuevoMatriz:
    predio.valorTerreno !== null && predio.valorTerreno !== undefined
      ? String(predio.valorTerreno)
      : form.valorTerrenoNuevoMatriz,
  numeroFincaNuevo: extractLotNumber(predio),
  otroNumeroNuevo: extractOtherNumber(predio),
  codDireccionNuevo: predio.codDireccion
    ? String(predio.codDireccion)
    : predio.direccionId
      ? String(predio.direccionId)
      : form.codDireccionNuevo,
  codClasificacionNuevo: predio.codClasificacion
    ? String(predio.codClasificacion)
    : form.codClasificacionNuevo,
  estPredioNuevo: predio.estPredio || form.estPredioNuevo,
  codTipoPredioNuevo: predio.codTipoPredio
    ? String(predio.codTipoPredio)
    : form.codTipoPredioNuevo,
  codCondicionPropiedadNuevo: predio.codCondicionPropiedad
    ? String(predio.codCondicionPropiedad)
    : form.codCondicionPropiedadNuevo,
  codUsoNuevo:
    String(predio.codClasificacion || "").trim() === "0501"
      ? ""
      : predio.codUso
        ? String(predio.codUso)
        : form.codUsoNuevo,
  codListaConductorNuevo: predio.codListaConductor
    ? String(predio.codListaConductor)
    : form.codListaConductorNuevo,
});

const required = (value: string, label: string) => {
  if (!value.trim()) throw new Error(`${label} es requerido.`);
};

const positive = (value: string, label: string) => {
  required(value, label);
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0)
    throw new Error(`${label} debe ser mayor que cero.`);
  return number;
};

const nullableNumber = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

const nullablePositiveNumber = (value: string, label: string): number | null => {
  if (value.trim() === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0)
    throw new Error(`${label} debe ser mayor que cero.`);
  return number;
};

export const buildSubdivicionPayload = (
  form: SubdivicionFormData,
): CreateSubdivicionDTO => {
  required(form.codPredioMatriz, "El predio matriz");
  required(form.codClasificacionNuevo, "La clasificación del nuevo predio");
  required(form.estPredioNuevo, "El estado del nuevo predio");
  required(form.codTipoPredioNuevo, "El tipo del nuevo predio");
  required(form.codCondicionPropiedadNuevo, "La condición de propiedad");
  required(form.codListaConductorNuevo, "El conductor del nuevo predio");
  required(form.fechaAdquisicionNuevo, "La fecha de adquisición");
  required(form.fechaSubdivision, "La fecha de subdivisión");

  const periodo = positive(
    form.periodoEfectivoArbitrios,
    "El periodo efectivo de arbitrios",
  );
  if (periodo > 12) throw new Error("El periodo efectivo debe estar entre 1 y 12.");

  return {
    anio: form.anio,
    codPredioMatriz: form.codPredioMatriz,
    areaTerrenoNuevaMatriz: positive(
      form.areaTerrenoNuevaMatriz,
      "El área terreno nueva matriz",
    ),
    valorTerrenoNuevoMatriz: nullableNumber(form.valorTerrenoNuevoMatriz),
    codDireccionNuevo: positive(form.codDireccionNuevo, "La dirección nueva"),
    numeroFincaNuevo: positive(form.numeroFincaNuevo, "El número de finca"),
    otroNumeroNuevo: form.otroNumeroNuevo.trim() || null,
    codClasificacionNuevo: form.codClasificacionNuevo.trim(),
    estPredioNuevo: form.estPredioNuevo.trim(),
    codTipoPredioNuevo: form.codTipoPredioNuevo.trim(),
    codCondicionPropiedadNuevo: form.codCondicionPropiedadNuevo.trim(),
    codUsoNuevo:
      form.codClasificacionNuevo.trim() === "0501"
        ? null
        : positive(form.codUsoNuevo, "El código de uso"),
    fechaAdquisicionNuevo: form.fechaAdquisicionNuevo,
    codListaConductorNuevo: form.codListaConductorNuevo.trim(),
    areaTerrenoNuevo: positive(form.areaTerrenoNuevo, "El área del nuevo predio"),
    valorOtrasInstalacionesNuevo: nullablePositiveNumber(
      form.valorOtrasInstalacionesNuevo,
      "El valor de otras instalaciones",
    ),
    fechaSubdivision: form.fechaSubdivision,
    periodoEfectivoArbitrios: periodo,
  };
};
