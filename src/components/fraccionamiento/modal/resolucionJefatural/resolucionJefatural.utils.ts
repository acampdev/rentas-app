const parseDate = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatMoney = (value: number | null | undefined, decimals = 2) =>
  Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
export const formatDate = (value: Date | string | null | undefined) =>
  parseDate(value)?.toLocaleDateString("es-PE") || "-";
export const formatLongDate = (value: Date | string | null | undefined) => {
  const date = parseDate(value) || new Date();
  return `${date.getDate()} de ${date.toLocaleDateString("es-PE", { month: "long" }).toUpperCase()} del ${date.getFullYear()}`;
};
export function storedUsername() {
  try {
    const user = JSON.parse(sessionStorage.getItem("auth_user") || "{}") as {
      username?: string;
      nombreCompleto?: string;
    };
    return user.nombreCompleto || user.username || "-";
  } catch {
    return "-";
  }
}
export const RESOLUCION_PRINT_CSS = `@media print {
 body * { visibility: hidden !important; } #resolucion-jefatural-print, #resolucion-jefatural-print * { visibility: visible !important; }
 #resolucion-jefatural-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; }
 #resolucion-jefatural-print .cronograma-row { break-inside: avoid; page-break-inside: avoid; } .no-print { display: none !important; }
 @page { size: A4 portrait; margin: 15mm; }
}`;
