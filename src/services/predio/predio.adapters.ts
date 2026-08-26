import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import type {
  CreatePredioDTO,
  PredioData,
  PredioEstadisticas,
  PredioListResponse,
  PredioRaw,
  UsoPredio,
  UsoPredioRaw,
} from "./predio.types";

const numberOrValue = (value: string | number | null | undefined) =>
  typeof value === "string" ? parseFloat(value) : value;

export const normalizePredio = (item: PredioRaw): PredioData => {
  const totalArea = item.totalAreaConstruccion ?? item.areaTotalConstruida;
  return {
    anio: item.anio,
    codPredio: item.codPredio || undefined,
    codPredioBase: item.codPredioBase?.toString() || undefined,
    numeroFinca: item.numeroFinca?.toString() || null,
    otroNumero: item.otroNumero,
    codClasificacion: item.codClasificacion?.toString() || null,
    estPredio: item.estPredio,
    codTipoPredio: item.codTipoPredio?.toString() || null,
    codCondicionPropiedad: item.codCondicionPropiedad?.toString() || null,
    codDireccion: item.codDireccion?.toString() || null,
    codUsoPredio: (item.codUsoPredio ?? item.codUso)?.toString() || null,
    fechaAdquisicion: item.fechaAdquisicion || item.fechaAdquisicionStr,
    numeroCondominos: item.numeroCondominos?.toString(),
    codListaConductor: item.codListaConductor?.toString(),
    codUbicacionAreaVerde: item.codUbicacionAreaVerde?.toString() || null,
    areaTerreno: parseFloat(item.areaTerreno?.toString() || "0"),
    numeroPisos:
      typeof item.numeroPisos === "string"
        ? parseInt(item.numeroPisos)
        : item.numeroPisos,
    totalAreaConstruccion: totalArea == null ? totalArea : Number(totalArea),
    valorTotalConstruccion: numberOrValue(item.valorTotalConstruccion),
    valorTerreno: numberOrValue(item.valorTerreno),
    valorOtrasInstalaciones: numberOrValue(item.valorOtrasInstalaciones),
    autoavaluo:
      typeof item.autoavaluo === "string"
        ? parseFloat(item.autoavaluo)
        : item.autoavaluo || undefined,
    codEstado: item.codEstado || item.codEstadoPredio,
    rutaImagenPlano: item.rutaImagenPlano,
    codUsuario: item.codUsuario || null,
    direccion: item.direccion,
    conductor: item.conductor,
    estadoPredio: item.estadoPredio,
    condicionPropiedad: item.condicionPropiedad,
    codGrupoUso: item.codGrupoUso,
    descripcionUso: item.descripcionUso,
    parametroBusqueda: item.parametroBusqueda,
    nombreSectorCompleto: item.nombreSectorCompleto,
    costoArancel: numberOrValue(item.costoArancel),
  };
};

export const unwrapPredios = (
  response: PredioListResponse,
  includeObject = false,
): PredioRaw[] => {
  if (Array.isArray(response)) return response;
  if (response?.data)
    return Array.isArray(response.data) ? response.data : [response.data];
  return includeObject && response && typeof response === "object"
    ? [response as PredioRaw]
    : [];
};

export const validateCreatePredio = (data: CreatePredioDTO) => {
  if (!data.numeroFinca || data.numeroFinca <= 0)
    throw new Error("numeroFinca es requerido y debe ser mayor a 0");
  if (!data.areaTerreno || data.areaTerreno <= 0)
    throw new Error("areaTerreno es requerido y debe ser mayor a 0");
  if (!data.codDireccion || data.codDireccion <= 0)
    throw new Error("codDireccion es requerido y debe ser mayor a 0");
};

export const buildCreatePredio = (data: CreatePredioDTO) => ({
  anio: data.anio,
  codPredio: data.codPredio ? String(data.codPredio).trim() : null,
  numeroFinca: Number(data.numeroFinca),
  otroNumero: String(data.otroNumero || ""),
  codClasificacion: String(data.codClasificacion || "0502").trim(),
  estPredio: String(data.estPredio || "2503").trim(),
  codTipoPredio: String(data.codTipoPredio || "2601").trim(),
  codCondicionPropiedad: String(data.codCondicionPropiedad || "2701").trim(),
  codDireccion: Number(data.codDireccion),
  codUsoPredio:
    data.codUsoPredio === null ? null : Number(data.codUsoPredio || 1),
  fechaAdquisicion: String(
    data.fechaAdquisicion || new Date().toISOString().split("T")[0],
  ),
  numeroCondominos: Number(data.numeroCondominos || 2),
  codListaConductor: String(data.codListaConductor || "1401").trim(),
  codUbicacionAreaVerde: Number(data.codUbicacionAreaVerde || 1),
  areaTerreno: Number(data.areaTerreno),
  totalAreaConstruccion: data.totalAreaConstruccion
    ? Number(data.totalAreaConstruccion)
    : null,
  valorTotalConstruccion: data.valorTotalConstruccion
    ? Number(data.valorTotalConstruccion)
    : null,
  valorTerreno: data.valorTerreno ? Number(data.valorTerreno) : null,
  autoavaluo: data.autoavaluo ? Number(data.autoavaluo) : null,
  codEstado: String(data.codEstado || "0201"),
  codUsuario: getAuthenticatedUserCode(),
});

export const calcularEstadisticasPredio = (
  predios: PredioData[],
): PredioEstadisticas =>
  predios.reduce<PredioEstadisticas>(
    (result, predio) => {
      const estado = predio.estadoPredio || "SIN_ESTADO";
      const condicion = predio.condicionPropiedad || "SIN_CONDICION";
      result.porEstado[estado] = (result.porEstado[estado] || 0) + 1;
      result.porCondicion[condicion] =
        (result.porCondicion[condicion] || 0) + 1;
      result.areaTerrenoTotal += predio.areaTerreno || 0;
      result.areaConstruidaTotal += predio.totalAreaConstruccion || 0;
      return result;
    },
    {
      total: predios.length,
      porEstado: {},
      porCondicion: {},
      areaTerrenoTotal: 0,
      areaConstruidaTotal: 0,
    },
  );

export const normalizeUsosPredio = (items: UsoPredioRaw[]): UsoPredio[] => {
  const unique = new Map<number, UsoPredio>();
  items.forEach((item) => {
    const codigo = Number(item.codUsoPredio ?? item.codUso ?? item.codigo);
    const descripcion = String(
      item.descripcionUso ?? item.descripcion ?? item.nombreUso ?? "",
    ).trim();
    const grupo = Number(item.codGrupoUso ?? 0);
    if (
      Number.isFinite(codigo) &&
      codigo > 0 &&
      descripcion &&
      !unique.has(codigo)
    )
      unique.set(codigo, {
        codUsoPredio: codigo,
        codGrupoUso: Number.isFinite(grupo) ? grupo : 0,
        descripcionUso: descripcion,
      });
  });
  return [...unique.values()];
};
