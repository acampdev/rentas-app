export const formatMoney = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const raw = String(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString("es-PE");
}

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

export const ESTADO_CUENTA_PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #estado-cuenta-print, #estado-cuenta-print * { visibility: visible !important; }
  #estado-cuenta-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; }
  #estado-cuenta-print thead { display: table-header-group; }
  #estado-cuenta-print tr { break-inside: avoid; page-break-inside: avoid; }
  .no-print { display: none !important; }
  @page { size: A4 portrait; margin: 12mm; }
}`;
