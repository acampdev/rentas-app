import type {
  AsignacionPredio,
  AsignacionQueryParams,
} from "../../../services/asignacionService";
import type { ConsultaAsignacionFiltros } from "./consultaAsignacion.types";

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

export const validarFiltrosAsignacion = (
  filtros: ConsultaAsignacionFiltros,
): ValidationResult<AsignacionQueryParams> => {
  const anioText = filtros.anio.trim();
  const contribuyenteText = filtros.codigoContribuyente.trim();
  if (!anioText && !contribuyenteText) {
    return { ok: false, message: "Debe ingresar al menos un año o contribuyente." };
  }

  const params: AsignacionQueryParams = {};
  if (anioText) {
    const anio = Number(anioText);
    const maxAnio = new Date().getFullYear() + 10;
    if (!Number.isInteger(anio) || anio < 1900 || anio > maxAnio) {
      return { ok: false, message: `El año debe estar entre 1900 y ${maxAnio}.` };
    }
    params.anio = anio;
  }

  if (contribuyenteText) {
    const codigo = Number(contribuyenteText);
    if (!Number.isInteger(codigo) || codigo <= 0) {
      return { ok: false, message: "El código del contribuyente no es válido." };
    }
    params.codContribuyente = codigo;
  }
  return { ok: true, value: params };
};

export const prepararAsignacionParaFormulario = (
  asignacion: AsignacionPredio,
): ValidationResult<Record<string, unknown>> => {
  if (!asignacion.codPredio?.trim() || !asignacion.codContribuyente) {
    return {
      ok: false,
      message: "Datos de asignación incompletos para realizar la operación.",
    };
  }

  return {
    ok: true,
    value: {
      anio: asignacion.anio,
      codPredio: asignacion.codPredio.trim(),
      codPredioBase: asignacion.codPredioBase,
      codContribuyente: asignacion.codContribuyente,
      codAsignacion: asignacion.codAsignacion,
      nombreContribuyente: asignacion.nombreContribuyente,
      codPredioContribuyente: asignacion.codPredioContribuyente,
      direccionCompleta: asignacion.direccionCompleta,
      autoavaluo: asignacion.autoavaluo,
      baseImponible: asignacion.baseImponible,
      impuestoAnual: asignacion.impuestoAnual,
      porcentajeCondomino: asignacion.porcentajeCondomino,
      porcentajeCondominoDesc: asignacion.porcentajeCondominoDesc,
      fechaDeclaracion: asignacion.fechaDeclaracion,
      fechaVenta: asignacion.fechaVenta,
      fechaDeclaracionStr: asignacion.fechaDeclaracionStr,
      fechaVentaStr: asignacion.fechaVentaStr,
      codModoDeclaracion: asignacion.codModoDeclaracion,
      modoDeclaracion: asignacion.modoDeclaracion,
      pensionista: asignacion.pensionista,
      pensionistaDesc: asignacion.pensionistaDesc,
      codEstado: asignacion.codEstado,
      estado: asignacion.estado,
      codUsuario: asignacion.codUsuario,
    },
  };
};

