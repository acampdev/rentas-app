import type { EstadoCuentaFiltros } from "../../services/cuentaCorrienteService";

interface CuentaFiltroInput {
  codigoContribuyente: string;
  anio: string;
  codigoPredio: string;
}

type CuentaFiltroResult =
  | { ok: true; filtros: EstadoCuentaFiltros }
  | { ok: false; message: string };

const parseOptionalPositiveInteger = (
  value: string,
  label: string,
): number | null | string => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return `${label} debe ser un número entero mayor que cero.`;
  }
  return parsed;
};

export const validarFiltrosCuenta = ({
  codigoContribuyente,
  anio,
  codigoPredio,
}: CuentaFiltroInput): CuentaFiltroResult => {
  const contribuyente = parseOptionalPositiveInteger(
    codigoContribuyente,
    "El código del contribuyente",
  );
  if (contribuyente === null) {
    return { ok: false, message: "Seleccione un contribuyente." };
  }
  if (typeof contribuyente === "string") {
    return { ok: false, message: contribuyente };
  }

  const anioNormalizado = parseOptionalPositiveInteger(anio, "El año");
  if (typeof anioNormalizado === "string") {
    return { ok: false, message: anioNormalizado };
  }
  if (anioNormalizado !== null && (anioNormalizado < 1900 || anioNormalizado > 9999)) {
    return { ok: false, message: "El año debe tener cuatro dígitos." };
  }

  const predio = parseOptionalPositiveInteger(codigoPredio, "El código de predio");
  if (typeof predio === "string") {
    return { ok: false, message: predio };
  }

  return {
    ok: true,
    filtros: {
      codContribuyente: contribuyente,
      anio: anioNormalizado,
      codPredio: predio,
    },
  };
};

