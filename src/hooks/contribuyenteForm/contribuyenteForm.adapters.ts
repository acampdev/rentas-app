import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import { BUSINESS_CODES } from "../../config/constants";
import type { ContribuyenteFormValues } from "./contribuyenteForm.types";

const documentCode = (value: string) => {
  const parsed = Number.parseInt(value);
  if (parsed > 10) return parsed;
  if ([BUSINESS_CODES.TIPO_DOCUMENTO.RUC, "2"].includes(value)) return 4102;
  if (value === BUSINESS_CODES.TIPO_DOCUMENTO.CE) return 4103;
  if (value === BUSINESS_CODES.TIPO_DOCUMENTO.PASAPORTE) return 4104;
  return 4101;
};

const sexCode = (value: string) => {
  const parsed = Number.parseInt(value);
  if (parsed > 10) return parsed;
  return [BUSINESS_CODES.SEXO.FEMENINO, "2"].includes(value) ? 2002 : 2001;
};

const civilStatusCode = (value: string) => {
  const parsed = Number.parseInt(value);
  if (parsed > 10) return parsed;
  if ([BUSINESS_CODES.ESTADO_CIVIL.CASADO, "2", "CASADO"].includes(value))
    return 1802;
  if ([BUSINESS_CODES.ESTADO_CIVIL.VIUDO, "3", "VIUDO"].includes(value))
    return 1803;
  if (
    [BUSINESS_CODES.ESTADO_CIVIL.DIVORCIADO, "4", "DIVORCIADO"].includes(value)
  )
    return 1804;
  return 1801;
};

export function toPersonaPayload(
  data: ContribuyenteFormValues,
  juridica: boolean,
) {
  const birthDate =
    data.fechaNacimiento instanceof Date
      ? data.fechaNacimiento.toISOString()
      : data.fechaNacimiento;
  return {
    codPersona: data.codPersona,
    codTipopersona: juridica
      ? BUSINESS_CODES.TIPO_PERSONA.JURIDICA
      : BUSINESS_CODES.TIPO_PERSONA.NATURAL,
    codTipoDocumento: documentCode(data.tipoDocumento),
    numerodocumento: String(data.numeroDocumento || ""),
    nombres: juridica ? data.razonSocial : data.nombres,
    apellidomaterno: data.apellidoMaterno || "",
    apellidopaterno: data.apellidoPaterno || "",
    fechanacimiento: birthDate ? birthDate.split("T")[0] : "1980-01-01",
    codestadocivil: civilStatusCode(data.estadoCivil),
    codsexo: sexCode(data.sexo),
    telefono: String(data.telefono || ""),
    codDireccion: data.direccion?.id || 1,
    lote: data.nFinca ? String(data.nFinca) : null,
    otros: data.otroNumero ? String(data.otroNumero) : null,
    parametroBusqueda: null,
    codUsuario: getAuthenticatedUserCode(),
  };
}

export function fullAddressText(
  address: ContribuyenteFormValues["direccion"],
  farm?: string,
  other?: string,
) {
  if (!address) return "";
  let text = (address.descripcion || "")
    .replace(/,?\s*Lotes?:\s*\d+\s*-?\s*\d*/gi, "")
    .replace(/,\s*$/, "")
    .trim();
  if (farm) text += ` - N° Finca: ${farm}`;
  if (other) text += ` - Otro: ${other}`;
  return text;
}
