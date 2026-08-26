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

  it("construye el JSON usando el año real del predio y conserva fechaVenta nula", () => {
    const payload = buildAssignmentPayload({
      contribuyente: { codigo: 35, nombreCompleto: "Contribuyente" },
      predio: { codigoPredio: "202435", anio: 2024 } as Predio,
      modoDeclaracion: "7701",
      fechaDeclaracion: new Date(2002, 11, 4),
      fechaVenta: null,
      porcentajeCondomino: "100",
    });
    expect(payload).toMatchObject({
      anio: 2024,
      codPredio: "202435",
      codContribuyente: 35,
      porcentajeCondomino: 100,
      fechaDeclaracion: "2002-12-04",
      fechaVenta: null,
      codModoDeclaracion: "7701",
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
    expect(payload.anio).toBe(2026);
  });

  it("obtiene el año del código completo cuando el predio no expone anio", () => {
    const payload = buildAssignmentPayload({
      contribuyente: { codigo: 20, nombreCompleto: "Contribuyente" },
      predio: { codigoPredio: "202528" } as Predio,
      modoDeclaracion: "0402",
      fechaDeclaracion: new Date(2025, 1, 26),
      fechaVenta: null,
      porcentajeCondomino: "50",
    });

    expect(payload.anio).toBe(2025);
    expect(payload.codPredio).toBe("202528");
    expect(payload.fechaVenta).toBeNull();
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
