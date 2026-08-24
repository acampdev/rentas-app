import { describe, expect, it } from "vitest";
import type { CronogramaContribuyente } from "../../../../types/fraccionamiento.types";
import { groupSchedule, installmentTotal } from "./deudaFraccionada.utils";

const scheduleRow = (
  values: Partial<CronogramaContribuyente>,
): CronogramaContribuyente => ({
  anio: 2026,
  codResolucion: 2,
  numeroCuota: 1,
  saldoInicio: 100,
  interes: 5,
  amortizacion: 10,
  montoCuota: 15,
  fechaVencimiento: "2026-09-01",
  pagado: false,
  fechaPago: null,
  montoPagado: null,
  numeroPago: null,
  codContribuyente: 6,
  ...values,
});

describe("deudaFraccionada utils", () => {
  it("agrupa, ordena y selecciona la primera cuota pendiente", () => {
    const groups = groupSchedule([
      scheduleRow({ numeroCuota: 2 }),
      scheduleRow({ numeroCuota: 1, pagado: true }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].cuotas.map((item) => item.nCuota)).toEqual([1, 2]);
    expect(groups[0].cuotas.map((item) => item.checked)).toEqual([false, true]);
  });

  it("suma únicamente las cuotas seleccionadas", () => {
    const installments = groupSchedule([
      scheduleRow({ numeroCuota: 1, montoCuota: 20 }),
      scheduleRow({ numeroCuota: 2, montoCuota: 30 }),
    ])[0].cuotas;
    installments[1].checked = true;
    expect(installmentTotal(installments)).toBe(50);
  });
});
