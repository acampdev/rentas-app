import type { HRData } from "../../../../services/hrService";
import type { HRTotals, PrintPageSize } from "./printHR.types";

export const formatHRNumber = (value: unknown, decimals = 2): string => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0.00";
  return number.toLocaleString("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const calculateHRTotals = (rows: HRData[]): HRTotals =>
  rows.reduce(
    (totals, row) => ({
      autoavaluo: totals.autoavaluo + (Number(row.autoavaluo) || 0),
      impuestoAnual: totals.impuestoAnual + (Number(row.impuestoPredial) || 0),
      impuestoTrimestral:
        totals.impuestoTrimestral + (Number(row.impuestoTrimestral) || 0),
    }),
    { autoavaluo: 0, impuestoAnual: 0, impuestoTrimestral: 0 },
  );

export const getHRPrintStyles = (pageSize: PrintPageSize): string => `
  @media print {
    body * { visibility: hidden !important; }
    #printable-hr-document, #printable-hr-document * { visibility: visible !important; }
    #printable-hr-document {
      position: absolute !important; left: 0 !important; top: 0 !important;
      width: 100% !important; margin: 0 !important; padding: 0 !important;
      background: white !important;
    }
    .no-print { display: none !important; }
    @page { size: ${pageSize === "A4" ? "A4 portrait" : "legal portrait"}; margin: 8mm; }
  }
`;
