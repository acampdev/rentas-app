import { BUSINESS_CODES } from "../../config/constants";
import type { ContribuyenteFormValues } from "./contribuyenteForm.types";

export const toBooleanFlag = (value: unknown) => {
  if (value === true || value === 1) return true;
  return ["1", "true", "si", "sí"].includes(
    String(value ?? "")
      .trim()
      .toLowerCase(),
  );
};

export function createFormValues(
  initial?: Partial<ContribuyenteFormValues> & Record<string, unknown>,
): ContribuyenteFormValues {
  return {
    codPersona: initial?.codPersona || null,
    esPersonaJuridica: initial?.esPersonaJuridica || false,
    tipoDocumento: initial?.tipoDocumento || BUSINESS_CODES.TIPO_DOCUMENTO.DNI,
    numeroDocumento: initial?.numeroDocumento || "",
    nombres: initial?.nombres || "",
    razonSocial: initial?.razonSocial || "",
    apellidoPaterno: initial?.apellidoPaterno || "",
    apellidoMaterno: initial?.apellidoMaterno || "",
    direccion: initial?.direccion || null,
    nFinca: initial?.nFinca || "",
    otroNumero: initial?.otroNumero || "",
    telefono: initial?.telefono || "",
    sexo: initial?.sexo || BUSINESS_CODES.SEXO.MASCULINO,
    estadoCivil: initial?.estadoCivil || "",
    fechaNacimiento: initial?.fechaNacimiento || null,
    esExonerado: toBooleanFlag(initial?.esExonerado),
    esPensionista: toBooleanFlag(initial?.esPensionista),
  };
}
