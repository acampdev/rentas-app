import type { CSSProperties } from "react";
import type { ConvenioDeudaProps, ConvenioTotals } from "./convenioDeuda.types";

export const convenioCellStyle: CSSProperties = {
  border: "1px solid #222",
  padding: "5px 6px",
  fontSize: 10,
};
export const formatConvenioMoney = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
export const formatConvenioDate = (value: string | Date | null | undefined) => {
  if (!value) return "-";
  const raw = String(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString("es-PE");
};
export const calculateConvenioTotals = (
  cuotaInicial: number,
  cuotas: { amortizacion: number; interes: number; montoCuota: number }[],
): ConvenioTotals =>
  cuotas.reduce(
    (total, cuota) => ({
      amortizacion: total.amortizacion + cuota.amortizacion,
      interes: total.interes + cuota.interes,
      montoCuota: total.montoCuota + cuota.montoCuota,
    }),
    { amortizacion: cuotaInicial, interes: 0, montoCuota: cuotaInicial },
  );
export const getConvenioIdentity = ({
  fraccionamiento,
  contribuyente,
}: Pick<ConvenioDeudaProps, "fraccionamiento" | "contribuyente">) => {
  let stored: { username?: string; nombreCompleto?: string } = {};
  try {
    stored = JSON.parse(sessionStorage.getItem("auth_user") || "{}");
  } catch {
    /* Sesión sin datos de usuario. */
  }
  return {
    nombreContribuyente:
      contribuyente?.contribuyente ||
      fraccionamiento?.nombreContribuyente ||
      fraccionamiento?.solicitante ||
      "-",
    documento: contribuyente?.documento || fraccionamiento?.numDocumento || "-",
    direccion: contribuyente?.direccion || "-",
    telefono: contribuyente?.telefono || "-",
    usuario: stored.nombreCompleto || stored.username || "-",
    fechaEmision: new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
};
