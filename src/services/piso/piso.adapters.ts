import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import type {
  CreatePisoApiDTO,
  PisoData,
  PisoMutationResponse,
  PisoQuery,
  PisoRaw,
} from "./piso.types";

const numberOr = (value: unknown, fallback = 0): number =>
  Number(value) || fallback;
const nullableNumber = (value: unknown): number | null =>
  value == null || value === "" ? null : Number(value);

export const normalizeFloor = (item: PisoRaw, index: number): PisoData => {
  const constructionDate =
    item.fechaConstruccionStr ||
    (typeof item.fechaConstruccion === "number"
      ? new Date(item.fechaConstruccion).toISOString().split("T")[0]
      : item.fechaConstruccion
        ? String(item.fechaConstruccion)
        : undefined);
  const describedFloor = Number(
    String(item.numeroPisoDesc || "").match(/^(\d+)/)?.[1],
  );
  const floorNumber =
    item.numeroPiso ?? (describedFloor || item.codPiso || index + 1);
  const totalArea = numberOr(
    item.areaTotalConstruccion || item.totalAreaConstruccion,
  );
  return {
    id: item.codPiso ?? index + 1,
    codPiso: item.codPiso,
    anio: item.anio,
    codigoPredio: String(item.codPredio || "").trim(),
    codPredio: String(item.codPredio || "").trim(),
    codPredioBase: item.codPredioBase
      ? String(item.codPredioBase).trim()
      : null,
    numeroPiso: floorNumber,
    numeroPisoDesc: item.numeroPisoDesc ?? undefined,
    numeroCondominos: nullableNumber(item.numeroCondominos),
    fechaConstruccion: constructionDate,
    fechaConstruccionStr: constructionDate,
    codLetraMurosColumnas: item.codLetraMurosColumnas,
    murosColumnas: item.murosColumnas,
    codLetraTechos: item.codLetraTechos,
    techos: item.techos,
    codLetraPisos: item.codLetraPisos,
    pisos: item.pisos,
    codLetraPuertasVentanas: item.codLetraPuertasVentanas,
    puertasVentanas: item.puertasVentanas,
    codLetraRevestimiento: item.codLetraRevestimiento,
    revestimiento: item.revestimiento,
    codLetraBanios: item.codLetraBanios,
    banios: item.banios,
    codLetraInstalacionesElectricas: item.codLetraInstalacionesElectricas,
    instalacionesElectricas: item.instalacionesElectricas,
    codEstadoConservacion: item.codEstadoConservacion,
    codMaterialEstructural: item.codMaterialEstructural,
    codEstado: item.codEstado,
    codGrupoUso: item.codGrupoUso,
    codUbicacionAreaVerde: item.codUbicacionAreaVerde,
    codUsuario: item.codUsuario,
    descripcionUso: item.descripcionUso,
    valorUnitario: numberOr(item.valorUnitario),
    areaConstruida: nullableNumber(item.areaConstruida),
    areaTotalConstruccion: totalArea,
    totalAreaConstruccion: totalArea,
    incremento: numberOr(item.incremento),
    depreciacion: numberOr(item.depreciacion),
    montoDepreciacion: nullableNumber(item.montoDepreciacion),
    valorUnitarioDepreciado: numberOr(item.valorUnitarioDepreciado),
    valorAreaConstruida: numberOr(item.valorAreaConstruida),
    valorAreasComunes: nullableNumber(item.valorAreasComunes),
    valorConstruccion: numberOr(item.valorConstruccion),
    valorOtrasInstalaciones: nullableNumber(item.valorOtrasInstalaciones),
    valorTerreno: nullableNumber(item.valorTerreno),
    valorTotalConstruccion: nullableNumber(item.valorTotalConstruccion),
    autoavaluo: nullableNumber(item.autoavaluo),
    nombreSectorCompleto: item.nombreSectorCompleto,
    direccion: item.direccion,
    rutaImagenPlano: item.rutaImagenPlano,
    parametroBusqueda: item.parametroBusqueda,
    estado: item.estado || item.estPredio || "ACTIVO",
    fechaRegistro: item.fechaRegistro,
    fechaModificacion: item.fechaModificacion,
  };
};

export const unwrapFloors = (payload: unknown): PisoRaw[] => {
  const data =
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload
      ? (payload as { data?: unknown }).data
      : payload;
  return Array.isArray(data)
    ? (data as PisoRaw[])
    : data && typeof data === "object"
      ? [data as PisoRaw]
      : [];
};

const clean = (value: string | number | undefined): string =>
  value == null ? "" : String(value).trim().replace(/\s+/g, "");
export const buildFloorQuery = (query: PisoQuery): string =>
  new URLSearchParams({
    anio: clean(query.anio ?? new Date().getFullYear()),
    codPiso: clean(query.codPiso),
    codPredioBase: clean(query.codPredioBase || query.codPredio),
    numeroPiso: clean(query.numeroPiso),
  }).toString();

export const buildFloorPayload = (
  data: CreatePisoApiDTO,
  includeFloorCode: boolean,
): CreatePisoApiDTO => ({
  anio: Number(data.anio),
  codPredio: data.codPredio.trim(),
  codPiso: includeFloorCode ? Number(data.codPiso) : Number(data.codPiso || 1),
  numeroPiso: Number(data.numeroPiso),
  fechaConstruccion: String(data.fechaConstruccion || "1990-01-01"),
  murosColumnas: String(data.murosColumnas || "100101"),
  techos: String(data.techos || "100102"),
  pisos: String(data.pisos || "100201"),
  puertasVentanas: String(data.puertasVentanas || "100202"),
  revestimiento: String(data.revestimiento || "100203"),
  banios: String(data.banios || "100204"),
  instalacionesElectricas: String(data.instalacionesElectricas || "100301"),
  codLetraMurosColumnas: String(data.codLetraMurosColumnas || "1101"),
  codLetraTechos: String(data.codLetraTechos || "1101"),
  codLetraPisos: String(data.codLetraPisos || "1101"),
  codLetraPuertasVentanas: String(data.codLetraPuertasVentanas || "1101"),
  codLetraRevestimiento: String(data.codLetraRevestimiento || "1101"),
  codLetraBanios: String(data.codLetraBanios || "1101"),
  codLetraInstalacionesElectricas: String(
    data.codLetraInstalacionesElectricas || "1101",
  ),
  codEstadoConservacion: String(data.codEstadoConservacion || "9402"),
  codMaterialEstructural: String(data.codMaterialEstructural || "0703"),
  areaConstruida: String(data.areaConstruida),
  valorAreasComunes: String(data.valorAreasComunes ?? "0"),
  codUsuario: getAuthenticatedUserCode(),
});

export const floorMutationError = (
  response: PisoMutationResponse,
): string | null => {
  if (
    response.success === false ||
    response.error === true ||
    response.error === "true"
  )
    return String(
      response.message ||
        response.mensaje ||
        response.descripcion ||
        response.error ||
        "Error al procesar piso",
    );
  if (response.codigo && !["OK", "200", "SUCCESS"].includes(response.codigo))
    return String(
      response.mensaje ||
        response.message ||
        response.descripcion ||
        "Error al procesar piso",
    );
  return null;
};
