import { describe, expect, it } from "vitest";
import { validarFiltrosCuenta } from "./cuentaList.validators";

describe("validarFiltrosCuenta", () => {
  it("exige un contribuyente", () => {
    expect(validarFiltrosCuenta({ codigoContribuyente: "", anio: "", codigoPredio: "" })).toEqual({
      ok: false,
      message: "Seleccione un contribuyente.",
    });
  });

  it("normaliza los filtros antes de consultar", () => {
    expect(validarFiltrosCuenta({ codigoContribuyente: "8", anio: "2026", codigoPredio: "30" })).toEqual({
      ok: true,
      filtros: { codContribuyente: 8, anio: 2026, codPredio: 30 },
    });
  });

  it("rechaza años y códigos inválidos", () => {
    expect(validarFiltrosCuenta({ codigoContribuyente: "8", anio: "26", codigoPredio: "" })).toMatchObject({ ok: false });
    expect(validarFiltrosCuenta({ codigoContribuyente: "8", anio: "2026", codigoPredio: "-1" })).toMatchObject({ ok: false });
  });
});

