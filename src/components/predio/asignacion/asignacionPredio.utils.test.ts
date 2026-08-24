import { describe, expect, it } from "vitest";
import type { Predio } from "../../../models/Predio";
import {
  buildAssignmentPayload,
  formatAssignmentDate,
  parseAssignmentDate,
} from "./asignacionPredio.utils";

describe("asignacionPredio utils", () => {
  it("convierte fechas del API sin desplazamiento de zona horaria", () => {
    const date = parseAssignmentDate("2026-02-26T00:00:00");
    expect(date && formatAssignmentDate(date)).toBe("2026-02-26");
  });

  it("construye el JSON de asignación y convierte 100% en null", () => {
    const payload = buildAssignmentPayload({
      contribuyente: { codigo: 20, nombreCompleto: "Contribuyente" },
      predio: { codigoPredio: "28", anio: 2026 } as Predio,
      modoDeclaracion: "0402",
      fechaDeclaracion: new Date(2026, 1, 26),
      fechaVenta: null,
      porcentajeCondomino: "100",
    });
    expect(payload).toMatchObject({
      codPredio: "202628",
      codContribuyente: 20,
      porcentajeCondomino: null,
      fechaDeclaracion: "2026-02-26",
      fechaVenta: "2026-02-26",
      codModoDeclaracion: "0402",
    });
  });

  it("rechaza porcentajes fuera del rango permitido", () => {
    expect(() =>
      buildAssignmentPayload({
        contribuyente: { codigo: 1, nombreCompleto: "" },
        predio: { codigoPredio: "20261" } as Predio,
        modoDeclaracion: "0402",
        fechaDeclaracion: new Date(),
        fechaVenta: null,
        porcentajeCondomino: "101",
      }),
    ).toThrow("entre 0 y 100");
  });
});
