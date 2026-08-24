export const currentYear = () => new Date().getFullYear();

export function extractBaseCode(code: string, year?: number) {
  const cleanCode = code.trim();
  if (cleanCode.length <= 4 || !/^\d{4}/.test(cleanCode)) return cleanCode;
  const yearText = year ? String(year) : cleanCode.substring(0, 4);
  return cleanCode.startsWith(yearText)
    ? cleanCode.substring(yearText.length)
    : cleanCode.substring(4);
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2 }).format(value);
