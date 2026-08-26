import type { ContribuyenteOption } from "../../../models/Caja";
import type { DeudaGlobalItem } from "./deuda/DeudaGlobal";
import type { CuotaFraccionamiento, TributoFraccionado } from "./deuda/DeudaFraccionada";
import { mapTributoNameToCode } from "./deuda/deuda.validation";
import type { ConceptoPago, DatosPagoDeudaOrdinaria, SelectedDebtCells, TipoSeleccionMonto } from "./deudaContribuyente.types";

export type DistribucionPago = Record<string, Record<string, number>>;

export const calcularDistribucionOrdinaria = (
  items: DeudaGlobalItem[],
  amount: number,
  selectionType: TipoSeleccionMonto,
  activeYear: number | null,
  selectedRows: string[],
): DistribucionPago => {
  const distribution: DistribucionPago = Object.fromEntries(items.map((item) => [item.id, Object.fromEntries(Array.from({ length: 12 }, (_, index) => [`mes${index + 1}`, 0]))]));
  let remaining = Math.max(0, amount);
  const rows = items.filter((item) => item.año === activeYear && (selectionType === "repartir" || selectedRows.includes(item.id)));
  for (let month = 1; month <= 12 && remaining > 0; month += 1) {
    const key = `mes${month}` as keyof DeudaGlobalItem;
    for (const item of rows) {
      const debt = Number(item[key] || 0);
      if (debt <= 0 || remaining <= 0) continue;
      const payment = Math.min(remaining, debt);
      distribution[item.id][String(key)] = payment;
      remaining -= payment;
    }
  }
  return distribution;
};

export const calcularMontoCeldas = (items: DeudaGlobalItem[], cells: SelectedDebtCells): number =>
  Object.entries(cells).reduce((total, [id, keys]) => {
    const row = items.find((item) => item.id === id);
    if (!row) return total;
    return total + keys.filter((key) => key !== "deuda").reduce((subtotal, key) => subtotal + Number(row[key as keyof DeudaGlobalItem] || 0), 0);
  }, 0);

export const crearPagoOrdinario = (
  amount: number,
  items: DeudaGlobalItem[],
  distribution: DistribucionPago,
  contributor: ContribuyenteOption,
): DatosPagoDeudaOrdinaria => {
  const grouped = new Map<string, { years: Set<number>; months: Set<number>; total: number; detail: Record<number, number> }>();
  items.forEach((item) => {
    const current = grouped.get(item.titulo) || { years: new Set<number>(), months: new Set<number>(), total: 0, detail: {} };
    for (let month = 1; month <= 12; month += 1) {
      const payment = distribution[item.id]?.[`mes${month}`] || 0;
      if (payment <= 0) continue;
      current.years.add(item.año);
      current.months.add(month);
      current.total += payment;
      current.detail[month] = (current.detail[month] || 0) + payment;
    }
    grouped.set(item.titulo, current);
  });
  const concepts: ConceptoPago[] = [];
  grouped.forEach((value, tribute) => {
    if (value.total <= 0) return;
    const years = [...value.years].sort();
    const months = [...value.months].sort();
    concepts.push({ id: `ordinario-${tribute}-${years.join("-")}`, descripcion: `${tribute} - Años: ${years.join(", ")} - Meses: ${months.join(", ")}`, añosAfectados: years, mesesAfectados: months, total: value.total, detalleMeses: value.detail, tributoNombre: tribute, tipoPago: "ordinario" });
  });
  return { montoTotal: amount, conceptos: concepts, contribuyente: contributor };
};

export const crearPagoFraccionado = (
  amount: number,
  year: number,
  resolution: string,
  resolutionCode: number | null,
  installments: CuotaFraccionamiento[],
  tributes: TributoFraccionado[],
  contributor: ContribuyenteOption,
): DatosPagoDeudaOrdinaria | null => {
  const selectedInstallments = installments.filter((item) => item.checked);
  if (!selectedInstallments.length || !resolution || !tributes.length) return null;
  let remaining = amount;
  const grouped = new Map<
    string,
    { anio: number; tributo: string; detail: Record<number, number> }
  >();
  for (let month = 1; month <= 12 && remaining > 0; month += 1) {
    for (const tribute of tributes) {
      if (remaining <= 0) break;
      const debt = Number(tribute.valores[month - 1] || 0);
      if (debt <= 0) continue;
      const payment = Math.min(remaining, debt);
      const key = `${tribute.anio}-${tribute.tributo}`;
      const current = grouped.get(key) || {
        anio: tribute.anio,
        tributo: tribute.tributo,
        detail: {},
      };
      const detail = current.detail;
      detail[month] = payment;
      grouped.set(key, current);
      remaining -= payment;
    }
  }
  const concepts: ConceptoPago[] = [];
  grouped.forEach(({ anio, tributo: tributeName, detail }) => {
    const total = Object.values(detail).reduce((sum, value) => sum + value, 0);
    if (total <= 0) return;
    const months = Object.keys(detail).map(Number);
    concepts.push({
      id: `fraccionamiento-${resolution}-${anio}-${tributeName}`,
      descripcion: `${tributeName} - Año deuda: ${anio} - ${resolution} - Cuotas: ${selectedInstallments.map((item) => item.nCuota).join(", ")}`,
      añosAfectados: [anio], mesesAfectados: months, total, detalleMeses: detail,
      tributoNombre: tributeName, tipoPago: "fraccionamiento",
      saldosDeuda: months.map((month) => {
        const matchingInstallment = selectedInstallments.find((item) => {
          const parts = item.fVenc?.includes("-") ? item.fVenc.split("-") : item.fVenc?.split("/") || [];
          return Number(parts[0]?.length === 4 ? parts[1] : parts[1]) === month;
        }) || selectedInstallments[0];
        return { codTributo: mapTributoNameToCode(tributeName), anio, periodo: month, abono: Number(detail[month].toFixed(4)), anioResolucion: year, codResolucion: resolutionCode || Number(resolution.replace(/\D/g, "")) || 1, numeroCuota: matchingInstallment.nCuota };
      }),
    });
  });
  return { montoTotal: amount, conceptos: concepts, contribuyente: contributor };
};

export const montoExcedeSeleccion = (amount: number, items: DeudaGlobalItem[], selectionType: TipoSeleccionMonto, activeYear: number | null, selectedRows: string[]): boolean => {
  const available = items.filter((item) => item.año === activeYear && (selectionType === "repartir" || selectedRows.includes(item.id))).reduce((sum, item) => sum + item.deuda, 0);
  return amount > available;
};
