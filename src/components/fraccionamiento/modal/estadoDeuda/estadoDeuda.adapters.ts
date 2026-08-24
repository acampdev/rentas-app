import type { EstadoCuentaAnual } from "../../../../services/cuentaCorrienteService";
import type {
  DeudaAnualReporte,
  EstadoDeudaIdentity,
  EstadoDeudaProps,
  EstadoDeudaTotals,
} from "./estadoDeuda.types";

interface StoredUser {
  username?: string;
  nombreCompleto?: string;
}

export const formatMoney = (value: number): string =>
  Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getStoredUser = (): StoredUser => {
  try {
    return JSON.parse(
      sessionStorage.getItem("auth_user") || "{}",
    ) as StoredUser;
  } catch {
    return {};
  }
};

const getPeriods = (item: EstadoCuentaAnual): number[] => {
  const balances: number[] = [];
  const charges: number[] = [];
  const record = item as unknown as Record<string, unknown>;
  for (let month = 1; month <= 12; month += 1) {
    const charge = Number(record[`cargo${month}`]) || 0;
    const payment = Number(record[`abono${month}`]) || 0;
    if (charge > 0) charges.push(month);
    if (charge > payment) balances.push(month);
  }
  return balances.length
    ? balances
    : charges.length
      ? charges
      : Array.from({ length: 12 }, (_, index) => index + 1);
};

export function groupAnnualDebts(
  items: EstadoCuentaAnual[],
): DeudaAnualReporte[] {
  const currentYear = new Date().getFullYear();
  const grouped = new Map<number, DeudaAnualReporte>();
  items
    .filter(({ anio }) => anio > 0 && anio < currentYear)
    .forEach((item) => {
      const reported =
        Number(item.totalPredial || 0) + Number(item.totalArbitrial || 0);
      const charges = Number(item.totalCargos || 0);
      const paid = Number(item.totalPagado || 0);
      const balance = Number(item.saldoNeto || 0);
      const pending = reported > 0 ? reported : Math.max(charges - paid, 0);
      const amount = Math.min(pending, Math.max(balance, 0));
      const row = grouped.get(item.anio) ?? {
        anio: item.anio,
        periodos: new Set<number>(),
        monto: 0,
        interes: 0,
        fraccion: 0,
        pagoTotal: 0,
      };
      getPeriods(item).forEach((period) => row.periodos.add(period));
      row.monto += amount;
      row.interes += Math.max(balance - amount, 0);
      row.pagoTotal += balance;
      grouped.set(item.anio, row);
    });
  return Array.from(grouped.values()).sort((a, b) => a.anio - b.anio);
}

export const calculateTotals = (rows: DeudaAnualReporte[]): EstadoDeudaTotals =>
  rows.reduce(
    (total, row) => ({
      monto: total.monto + row.monto,
      interes: total.interes + row.interes,
      fraccion: total.fraccion + row.fraccion,
      pagoTotal: total.pagoTotal + row.pagoTotal,
    }),
    { monto: 0, interes: 0, fraccion: 0, pagoTotal: 0 },
  );

export function buildIdentity(
  fraccionamiento: EstadoDeudaProps["fraccionamiento"],
  contribuyente: EstadoDeudaProps["contribuyente"],
): EstadoDeudaIdentity {
  const storedUser = getStoredUser();
  return {
    codigo:
      fraccionamiento?.codContribuyente ??
      contribuyente?.codigo ??
      fraccionamiento?.codigoContribuyente ??
      "-",
    nombre:
      contribuyente?.contribuyente ??
      fraccionamiento?.nombreContribuyente ??
      fraccionamiento?.solicitante ??
      "-",
    direccion: contribuyente?.direccion ?? "-",
    usuario: storedUser.nombreCompleto ?? storedUser.username ?? "-",
    fechaHora: new Date().toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}
