import type { PredioFormData } from "../../../hooks/usePredioForm";
import type { PredioData } from "../../../services/predioService";
import type { DireccionData as ApiDireccion } from "../../../services/direccionService";
import { getAuthenticatedUserCode } from "../../../config/api.unified.config";
import { logger } from "../../../utils/logger";

const PROPERTY_CODES: Record<string, string> = {
  "PROPIETARIO UNICO": "2701",
  PROPIETARIO: "2702",
  POSEEDOR: "2703",
  ARRENDATARIO: "2704",
  USUFRUCTUARIO: "2705",
  OTRO: "2706",
};
const DRIVER_CODES: Record<string, string> = {
  PRIVADO: "1401",
  ESTATAL: "1402",
};
const STATUS_CODES: Record<string, string> = {
  TERMINADO: "2501",
  "EN CONSTRUCCION": "2502",
  "EN RUINAS": "2503",
  PARALIZADO: "2504",
};

export interface PredioFormExtended extends PredioFormData {
  totalAreaConstruccion?: number | null;
  valorTerreno?: number | null;
  valorTotalConstruccion?: number | null;
  autoavaluo?: number | null;
}

export const parseAddress = (fullAddress?: string | null) => {
  if (!fullAddress) return { baseAddress: "", numeroFinca: "", otroNumero: "" };
  let baseAddress = fullAddress;
  const lotMatch = fullAddress.match(/,?\s*(?:LT|Lote)\s*(\d+)/i);
  const otherMatch = fullAddress.match(/[-,]?\s*OTRO\s*(?:Nº|N°|N)?\s*(\d+)/i);
  if (lotMatch) baseAddress = baseAddress.replace(lotMatch[0], "");
  if (otherMatch) baseAddress = baseAddress.replace(otherMatch[0], "");
  return {
    baseAddress: baseAddress.replace(/[,\-\s]+$/, "").trim(),
    numeroFinca: lotMatch?.[1] ?? "",
    otroNumero: otherMatch?.[1] ?? "",
  };
};

export const extractAddressTerms = (address: string): string[] =>
  [
    address.match(/(?:Jr\.|Av\.|Calle|Psje\.?|Pasaje)\s+([^,]+)/i)?.[1],
    address.match(/B\.º\s+([^,]+)/i)?.[1],
    address.match(/SECT\.\s+([^,]+)/i)?.[1],
  ]
    .filter((term): term is string => Boolean(term))
    .map((term) => term.trim());

export const toFormAddress = (
  address: ApiDireccion | undefined,
  fallback: string,
) => ({
  id: address?.id ?? null,
  codigo: address?.codigo ?? address?.id ?? null,
  descripcion: address?.descripcion ?? fallback,
  direccionCompleta: address?.descripcion ?? fallback,
});

const mappedCode = (
  direct: string | number | null | undefined,
  description: string | undefined,
  map: Record<string, string>,
) => String(direct ?? map[description?.toUpperCase() ?? ""] ?? "");

export function mapPredioToForm(
  predio: PredioData,
  address: ReturnType<typeof toFormAddress>,
): Partial<PredioFormExtended> {
  const parsed = parseAddress(predio.direccion);
  return {
    anio: predio.anio,
    numeroFinca: predio.numeroFinca ?? parsed.numeroFinca,
    otroNumero: predio.otroNumero ?? parsed.otroNumero,
    areaTerreno: predio.areaTerreno,
    numeroPisos: predio.numeroPisos,
    numeroCondominos: predio.numeroCondominos
      ? Number(predio.numeroCondominos)
      : undefined,
    fechaAdquisicion: predio.fechaAdquisicion
      ? new Date(predio.fechaAdquisicion)
      : null,
    direccionId:
      address.id ??
      (predio.codDireccion ? Number(predio.codDireccion) : undefined),
    condicionPropiedad: mappedCode(
      predio.codCondicionPropiedad,
      predio.condicionPropiedad,
      PROPERTY_CODES,
    ),
    tipoPredio: String(predio.codTipoPredio ?? ""),
    estadoPredio: mappedCode(
      predio.estPredio,
      predio.estadoPredio,
      STATUS_CODES,
    ),
    clasificacionPredio: String(predio.codClasificacion ?? ""),
    conductor: mappedCode(
      predio.codListaConductor,
      predio.conductor,
      DRIVER_CODES,
    ),
    usoPredio: String(predio.codUsoPredio ?? ""),
    totalAreaConstruccion: predio.totalAreaConstruccion,
    valorTerreno: predio.valorTerreno,
    valorTotalConstruccion: predio.valorTotalConstruccion,
    autoavaluo: predio.autoavaluo,
    direccion: address,
  };
}

export const buildCreateInput = (data: PredioFormExtended) => {
  const payload = {
    ...data,
    numeroFinca: data.numeroFinca ?? "",
    areaTerreno: Number(data.areaTerreno) || 0,
    direccionId: data.direccion?.id ?? data.direccionId,
    anio: data.anio ?? new Date().getFullYear(),
    otroNumero: data.otroNumero ?? "",
    codClasificacion: data.clasificacionPredio,
    estPredio: data.estadoPredio,
    codTipoPredio: data.tipoPredio,
    codCondicionPropiedad: data.condicionPropiedad,
    codUsoPredio: data.usoPredio ? Number(data.usoPredio) : undefined,
    codListaConductor: data.conductor,
    numeroPisos: Number(data.numeroPisos) || 1,
    numeroCondominos: Number(data.numeroCondominos) || 2,
    codUbicacionAreaVerde: 1,
    codEstado: "0201",
    codUsuario: getAuthenticatedUserCode(),
  };
  logger.log("📤 [NuevoPredio] Enviando datos al hook:", payload);
  return payload;
};
