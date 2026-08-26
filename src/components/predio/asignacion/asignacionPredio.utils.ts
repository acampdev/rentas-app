import type { Predio } from "../../../models/Predio";
import type { CreateAsignacionAPIDTO } from "../../../services/asignacionService";
import type {
  AsignacionFormData,
  DatosEdicionAsignacion,
} from "./asignacionPredio.types";

export const formatAssignmentModeOption = (option: {
  value: unknown;
  label?: string;
}): string => {
  const code = String(option.value ?? "").trim();
  const label = String(option.label ?? "").trim();
  if (!code) return label;
  if (!label) return code;
  return label.startsWith(`${code} -`) ? label : `${code} - ${label}`;
};

export const parseAssignmentDate = (value?: string | null): Date | null => {
  const [year, month, day] = String(value || "")
    .trim()
    .split("T")[0]
    .split("-")
    .map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
};
export const formatAssignmentDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const assignmentFromEdit = (
  data: DatosEdicionAsignacion,
  modes: { value: unknown; label?: string }[],
): AsignacionFormData => {
  const matchingMode = modes.find(
    (option) =>
      option.label?.toUpperCase() === data.modoDeclaracion?.toUpperCase(),
  );
  const percentText =
    data.porcentajeCondomino != null
      ? String(data.porcentajeCondomino)
      : String(data.porcentajeCondominoDesc || "")
          .replace("%", "")
          .replace(",", ".")
          .trim();
  return {
    contribuyente: {
      codigo: Number(data.codContribuyente),
      nombreCompleto: data.nombreContribuyente || "",
    },
    predio: {
      codPredio: data.codPredio,
      codigoPredio: data.codPredio || "",
      codPredioBase: String(data.codPredioBase || ""),
      direccion: data.direccionCompleta,
      autoavaluo: data.autoavaluo,
    } as Predio,
    modoDeclaracion: String(
      matchingMode?.value ?? data.codModoDeclaracion ?? "",
    ),
    fechaDeclaracion: parseAssignmentDate(
      data.fechaDeclaracionStr || data.fechaDeclaracion,
    ),
    fechaVenta: parseAssignmentDate(data.fechaVentaStr || data.fechaVenta),
    porcentajeCondomino: Number.isFinite(Number(percentText))
      ? percentText
      : "",
  };
};
export const buildAssignmentPayload = (
  form: AsignacionFormData,
  edit?: DatosEdicionAsignacion | null,
): CreateAsignacionAPIDTO => {
  if (!form.contribuyente || !form.predio)
    throw new Error("Debe seleccionar un contribuyente y un predio");
  if (!form.fechaDeclaracion)
    throw new Error("Debe seleccionar la fecha de declaración");
  if (!form.modoDeclaracion)
    throw new Error("Debe seleccionar un modo de declaración");
  if (!form.porcentajeCondomino.trim())
    throw new Error("Debe ingresar el porcentaje condómino");
  const percentage = Number(form.porcentajeCondomino);
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100)
    throw new Error("El porcentaje condómino debe estar entre 0 y 100");
  const baseCode = String(
    form.predio.codigoPredio ||
      form.predio.codPredio ||
      form.predio.codPredioBase ||
      "",
  ).trim();
  const year = Number(form.predio.anio || edit?.anio);
  const contributorCode = Number(form.contribuyente.codigo);
  if (!baseCode || !Number.isFinite(contributorCode))
    throw new Error("Los códigos de predio o contribuyente no son válidos");
  return {
    anio: new Date().getFullYear(),
    codPredio: (/^\d{4}/.test(baseCode) || !Number.isFinite(year)
      ? baseCode
      : `${year}${baseCode}`
    ).trim(),
    codContribuyente: contributorCode,
    codAsignacion: edit?.codAsignacion ?? null,
    porcentajeCondomino: percentage,
    fechaDeclaracion: formatAssignmentDate(form.fechaDeclaracion),
    fechaVenta: formatAssignmentDate(form.fechaVenta || form.fechaDeclaracion),
    codModoDeclaracion: form.modoDeclaracion.trim(),
  };
};
