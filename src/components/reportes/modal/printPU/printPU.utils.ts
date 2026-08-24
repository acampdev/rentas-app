import type { PrintPageSize } from "./printPU.types";

export const formatPUNumber = (value: unknown, decimals = 2): string => {
  const number = Number.parseFloat(String(value ?? ""));
  if (!Number.isFinite(number)) return "0.00";
  return number.toLocaleString("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const numberOr = (value: unknown, fallback: number): number => {
  const number = Number(value);
  return Number.isFinite(number) && number !== 0 ? number : fallback;
};

export const currentPUDate = (): string =>
  new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const createPrintPUStyles = (pageSize: PrintPageSize): string => `
  @media print {
    body * { visibility: hidden !important; }
    #printable-pu-document, #printable-pu-document * {
      visibility: visible !important;
    }
    #printable-pu-document {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    .no-print { display: none !important; }
    @page {
      size: ${pageSize === "A4" ? "A4 portrait" : "legal portrait"};
      margin: 8mm;
    }
  }
`;
