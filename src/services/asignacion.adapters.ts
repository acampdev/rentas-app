import type {
  AsignacionPredio,
  CreateAsignacionAPIDTO,
} from "./asignacionService";

export const toAsignacionRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

export const getAsignacionErrorMessage = (
  payload: unknown,
  fallback: string,
): string => {
  const response = toAsignacionRecord(payload);
  if (typeof response.data === "string" && response.data.trim()) return response.data.trim();
  if (typeof response.message === "string" && response.message.trim()) return response.message.trim();
  return fallback;
};

export const toAsignacionWritePayload = (
  datos: CreateAsignacionAPIDTO,
): CreateAsignacionAPIDTO => ({
  codPredio: String(datos.codPredio).trim(),
  codContribuyente: Number(datos.codContribuyente),
  codAsignacion: datos.codAsignacion ?? null,
  porcentajeCondomino: datos.porcentajeCondomino ?? null,
  fechaDeclaracion: datos.fechaDeclaracion,
  fechaVenta: datos.fechaVenta,
  codModoDeclaracion: String(datos.codModoDeclaracion).trim(),
});

const formatPercentage = (value: number): string =>
  value.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const normalizarAsignacion = (item: unknown, index = 0): AsignacionPredio => {
  const raw = toAsignacionRecord(item);
  const porcentaje = raw.porcentajeCondomino == null ? null : Number(raw.porcentajeCondomino);
  const pensionista = raw.pensionista == null ? null : Number(raw.pensionista);
  const codEstado = String(raw.codEstado || "0201").trim();
  const codPredio = String(raw.codPredio || "").trim();
  const codPredioContribuyente = raw.codPredioContribuyente == null ? null : Number(raw.codPredioContribuyente);
  const codAsignacion = raw.codAsignacion == null ? null : (raw.codAsignacion as number | string);

  return {
    id: codAsignacion ?? codPredioContribuyente ?? `${codPredio}-${index}`,
    anio: Number(raw.anio) || new Date().getFullYear(),
    codPredio,
    codPredioBase: raw.codPredioBase == null ? null : Number(raw.codPredioBase),
    codContribuyente: String(raw.codContribuyente || "").trim(),
    codAsignacion,
    porcentajeCondomino: porcentaje,
    porcentajeCondominoDesc: String(raw.porcentajeCondominoDesc || "").trim() || `${formatPercentage(porcentaje ?? 100)} %`,
    fechaDeclaracion: String(raw.fechaDeclaracion || "").trim(),
    fechaVenta: String(raw.fechaVenta || "").trim(),
    fechaDeclaracionStr: String(raw.fechaDeclaracionStr || raw.fechaDeclaracion || "").trim(),
    fechaVentaStr: String(raw.fechaVentaStr || raw.fechaVenta || "").trim(),
    codModoDeclaracion: String(raw.codModoDeclaracion || "").trim(),
    modoDeclaracion: String(raw.modoDeclaracion || "").trim(),
    pensionista,
    pensionistaDesc: raw.pensionistaDesc == null
      ? pensionista == null ? null : pensionista === 1 ? "Sí" : "No"
      : String(raw.pensionistaDesc).trim(),
    codEstado,
    estado: String(raw.estado || "").trim() || (codEstado === "0201" ? "ACTIVO" : "INACTIVO"),
    codUsuario: raw.codUsuario == null ? null : Number(raw.codUsuario),
    nombreContribuyente: String(raw.nombreContribuyente || raw.contribuyente || "").trim(),
    codPredioContribuyente,
    direccionCompleta: String(raw.direccionCompleta || "").trim(),
    autoavaluo: Number(raw.autoavaluo) || 0,
    baseImponible: Number(raw.baseImponible) || 0,
    impuestoAnual: Number(raw.impuestoAnual) || 0,
    porcentajeCondominio: porcentaje ?? 100,
    esPensionista: pensionista === 1,
    porcentajeLibre: 100 - (porcentaje ?? 100),
  };
};

export const extraerAsignaciones = (payload: unknown): AsignacionPredio[] => {
  const response = toAsignacionRecord(payload);
  const rawData = "data" in response ? response.data : payload;
  const items = Array.isArray(rawData) ? rawData : rawData && typeof rawData === "object" ? [rawData] : [];
  const seen = new Set<string>();
  return items
    .filter((item) => {
      const raw = toAsignacionRecord(item);
      const key = `${raw.anio || ""}-${String(raw.codPredio || "").trim()}-${String(raw.codContribuyente || "").trim()}`;
      if (!String(raw.codPredio || "").trim() || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(normalizarAsignacion);
};

