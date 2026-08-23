import type {
  EstadoCuentaAnual,
  EstadoCuentaDetalle,
  EstadoCuentaRaw,
} from "./cuentaCorrienteService";

export const extraerItemsEstadoCuenta = (payload: unknown): EstadoCuentaRaw[] => {
  if (Array.isArray(payload)) return payload as EstadoCuentaRaw[];
  if (!payload || typeof payload !== "object") return [];

  const response = payload as Record<string, unknown>;
  const data = response.data;
  if (Array.isArray(data)) return data as EstadoCuentaRaw[];
  if (data && typeof data === "object") return [data as EstadoCuentaRaw];
  if ("anio" in response) return [response as unknown as EstadoCuentaRaw];
  return [];
};

export const adaptarEstadoCuentaAnual = (
  item: EstadoCuentaRaw,
): EstadoCuentaAnual => ({
  codContribuyente: item.codContribuyente,
  codPredio: item.codPredio ?? null,
  anio: item.anio ?? 0,
  totalPredial: item.totalPredial ?? 0,
  totalArbitrial: item.totalArbitrial ?? 0,
  tributo: item.tributo ?? null,
  grupoTributo: item.grupoTributo ?? null,
  totalCargos: item.totalCargos ?? 0,
  totalPagado: item.totalPagado ?? 0,
  saldoNeto: item.saldoNeto ?? 0,
  cargo1: item.cargo1 ?? null, abono1: item.abono1 ?? null,
  cargo2: item.cargo2 ?? null, abono2: item.abono2 ?? null,
  cargo3: item.cargo3 ?? null, abono3: item.abono3 ?? null,
  cargo4: item.cargo4 ?? null, abono4: item.abono4 ?? null,
  cargo5: item.cargo5 ?? null, abono5: item.abono5 ?? null,
  cargo6: item.cargo6 ?? null, abono6: item.abono6 ?? null,
  cargo7: item.cargo7 ?? null, abono7: item.abono7 ?? null,
  cargo8: item.cargo8 ?? null, abono8: item.abono8 ?? null,
  cargo9: item.cargo9 ?? null, abono9: item.abono9 ?? null,
  cargo10: item.cargo10 ?? null, abono10: item.abono10 ?? null,
  cargo11: item.cargo11 ?? null, abono11: item.abono11 ?? null,
  cargo12: item.cargo12 ?? null, abono12: item.abono12 ?? null,
  venc_ene: item.venc_ene ?? null, venc_feb: item.venc_feb ?? null,
  venc_mar: item.venc_mar ?? null, venc_abr: item.venc_abr ?? null,
  venc_may: item.venc_may ?? null, venc_jun: item.venc_jun ?? null,
  venc_jul: item.venc_jul ?? null, venc_ago: item.venc_ago ?? null,
  venc_sep: item.venc_sep ?? null, venc_oct: item.venc_oct ?? null,
  venc_nov: item.venc_nov ?? null, venc_dic: item.venc_dic ?? null,
});

export const adaptarDetalleEstadoCuenta = (
  item: EstadoCuentaRaw,
): EstadoCuentaDetalle => ({
  ...adaptarEstadoCuentaAnual(item),
  tributo: item.tributo ?? "",
  grupoTributo: item.grupoTributo ?? "",
  cargo1: item.cargo1 ?? 0, abono1: item.abono1 ?? 0,
  cargo2: item.cargo2 ?? 0, abono2: item.abono2 ?? 0,
  cargo3: item.cargo3 ?? 0, abono3: item.abono3 ?? 0,
  cargo4: item.cargo4 ?? 0, abono4: item.abono4 ?? 0,
  cargo5: item.cargo5 ?? 0, abono5: item.abono5 ?? 0,
  cargo6: item.cargo6 ?? 0, abono6: item.abono6 ?? 0,
  cargo7: item.cargo7 ?? 0, abono7: item.abono7 ?? 0,
  cargo8: item.cargo8 ?? 0, abono8: item.abono8 ?? 0,
  cargo9: item.cargo9 ?? 0, abono9: item.abono9 ?? 0,
  cargo10: item.cargo10 ?? 0, abono10: item.abono10 ?? 0,
  cargo11: item.cargo11 ?? 0, abono11: item.abono11 ?? 0,
  cargo12: item.cargo12 ?? 0, abono12: item.abono12 ?? 0,
});

export const esEstadoCuentaAnualValido = (item: EstadoCuentaAnual) =>
  Number.isInteger(item.anio) && item.anio > 0;

