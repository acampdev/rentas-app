import { describe, expect, it } from "vitest";
import {
  extraerAsignaciones,
  getAsignacionErrorMessage,
  normalizarAsignacion,
  toAsignacionWritePayload,
} from "./asignacion.adapters";

describe("adaptadores de asignación", () => {
  it("normaliza el API, recorta códigos y mantiene valores cero", () => {
    const item = normalizarAsignacion({
      anio: 2026,
      codPredio: "202628   ",
      codContribuyente: 20,
      porcentajeCondomino: 0,
      autoavaluo: 0,
      pensionista: 0,
    });
    expect(item).toMatchObject({
      codPredio: "202628",
      codContribuyente: "20",
      porcentajeCondomino: 0,
      autoavaluo: 0,
      pensionista: 0,
      esPensionista: false,
    });
  });

  it("extrae respuestas envueltas y elimina duplicados", () => {
    const raw = { anio: 2026, codPredio: "202628", codContribuyente: 20 };
    expect(
      extraerAsignaciones({ success: true, data: [raw, raw] }),
    ).toHaveLength(1);
  });

  it("construye el contrato de escritura y prioriza el detalle del error", () => {
    expect(
      toAsignacionWritePayload({
        anio: 2026,
        codPredio: " 202628 ",
        codContribuyente: 20,
        codAsignacion: null,
        porcentajeCondomino: null,
        fechaDeclaracion: "2026-02-26",
        fechaVenta: "2026-02-26",
        codModoDeclaracion: " 0402 ",
      }),
    ).toMatchObject({
      anio: 2026,
      codPredio: "202628",
      codModoDeclaracion: "0402",
    });
    expect(
      getAsignacionErrorMessage(
        { message: "Falló", data: "Detalle real" },
        "Otro",
      ),
    ).toBe("Detalle real");
  });
});
