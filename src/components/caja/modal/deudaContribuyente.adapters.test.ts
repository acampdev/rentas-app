import { describe, expect, it } from "vitest";
import type { ContribuyenteOption } from "../../../models/Caja";
import type { DeudaGlobalItem } from "./deuda/DeudaGlobal";
import { calcularDistribucionOrdinaria, crearPagoFraccionado, crearPagoOrdinario, montoExcedeSeleccion } from "./deudaContribuyente.adapters";

const contributor: ContribuyenteOption = { id: 8, label: "Contribuyente", documento: "12345678", direccion: "Dirección", codigo: 8 };
const debt = (id: string, title: string, month1: number, month2: number): DeudaGlobalItem => ({ id, año: 2026, titulo: title, mes1: month1, mes2: month2, mes3: 0, mes4: 0, mes5: 0, mes6: 0, mes7: 0, mes8: 0, mes9: 0, mes10: 0, mes11: 0, mes12: 0, deuda: month1 + month2 });

describe("adaptadores de deuda del contribuyente", () => {
  it("reparte el monto verticalmente por mes y tributo", () => {
    const items = [debt("a", "Limpieza", 5, 5), debt("b", "Serenazgo", 4, 4)];
    const distribution = calcularDistribucionOrdinaria(items, 7, "repartir", 2026, []);
    expect(distribution.a.mes1).toBe(5);
    expect(distribution.b.mes1).toBe(2);
    expect(distribution.a.mes2).toBe(0);
  });

  it("crea conceptos ordinarios únicamente con los importes distribuidos", () => {
    const items = [debt("a", "Limpieza Pública", 5, 5)];
    const distribution = calcularDistribucionOrdinaria(items, 7, "repartir", 2026, []);
    const payment = crearPagoOrdinario(7, items, distribution, contributor);
    expect(payment.conceptos[0]).toMatchObject({ total: 7, mesesAfectados: [1, 2], tipoPago: "ordinario" });
    expect(montoExcedeSeleccion(11, items, "repartir", 2026, [])).toBe(true);
  });

  it("adapta un pago fraccionado con resolución y cuota reales", () => {
    const payment = crearPagoFraccionado(
      6,
      2026,
      "R002",
      2,
      [{ nCuota: 1, deuda: 10, im: 1, cuota: 11, fVenc: "2026-01-31", checked: true }],
      [{ tributo: "Limpieza Pública", valores: [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, { tributo: "Serenazgo", valores: [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
      contributor,
    );
    expect(payment?.conceptos.map((item) => item.total)).toEqual([4, 2]);
    expect(payment?.conceptos[0].saldosDeuda?.[0]).toMatchObject({ anioResolucion: 2026, codResolucion: 2, numeroCuota: 1 });
  });
});
