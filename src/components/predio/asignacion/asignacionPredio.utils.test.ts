import { describe, expect, it } from "vitest";
import type { Predio } from "../../../models/Predio";
import {
  buildAssignmentPayload,
  formatAssignmentDate,
  formatAssignmentModeOption,
  parseAssignmentDate,
} from "./asignacionPredio.utils";

describe("asignacionPredio utils", () => {
  it("muestra código y nombre en el modo de declaración", () => {
    expect(formatAssignmentModeOption({ value: "0402", label: "COMPRA" })).toBe("0402 - COMPRA");
    expect(formatAssignmentModeOption({ value: "0402", label: "0402 - COMPRA" })).toBe("0402 - COMPRA");
  });

  it("convierte fechas del API sin desplazamiento de zona horaria", () => {
    const date = parseAssignmentDate("2026-02-26T00:00:00");
    expect(date && formatAssignmentDate(date)).toBe("2026-02-26");
  });

  it("construye el JSON de asignación conservando el porcentaje ingresado", () => {
    const payload = buildAssignmentPayload({
      contribuyente: { codigo: 20, nombreCompleto: "Contribuyente" },
      predio: { codigoPredio: "28", anio: 2026 } as Predio,
      modoDeclaracion: "0402",
      fechaDeclaracion: new Date(2026, 1, 26),
      fechaVenta: null,
      porcentajeCondomino: "100",
    });
    expect(payload).toMatchObject({
      anio: new Date().getFullYear(),
      codPredio: "202628",
      codContribuyente: 20,
      porcentajeCondomino: 100,
      fechaDeclaracion: "2026-02-26",
      fechaVenta: "2026-02-26",
      codModoDeclaracion: "0402",
    });
  });

  it("conserva un porcentaje condómino parcial", () => {
    const payload = buildAssignmentPayload({
      contribuyente: { codigo: 20, nombreCompleto: "Contribuyente" },
      predio: { codigoPredio: "202628", anio: 2026 } as Predio,
      modoDeclaracion: "0402",
      fechaDeclaracion: new Date(2026, 1, 26),
      fechaVenta: null,
      porcentajeCondomino: "37.5",
    });

    expect(payload.porcentajeCondomino).toBe(37.5);
    expect(payload.anio).toBe(new Date().getFullYear());
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
