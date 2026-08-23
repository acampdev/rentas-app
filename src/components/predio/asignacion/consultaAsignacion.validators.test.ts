import { describe, expect, it } from "vitest";
import { normalizarAsignacion } from "../../../services/asignacion.adapters";
import {
  prepararAsignacionParaFormulario,
  validarFiltrosAsignacion,
} from "./consultaAsignacion.validators";

describe("validadores de ConsultaAsignacion", () => {
  it("requiere al menos un criterio y valida el rango del año", () => {
    expect(validarFiltrosAsignacion({ anio: "", codigoContribuyente: "", nombreContribuyente: "" })).toMatchObject({ ok: false });
    expect(validarFiltrosAsignacion({ anio: "1800", codigoContribuyente: "", nombreContribuyente: "" })).toMatchObject({ ok: false });
  });

  it("normaliza los filtros válidos", () => {
    expect(validarFiltrosAsignacion({ anio: "2026", codigoContribuyente: "20", nombreContribuyente: "Persona" })).toEqual({
      ok: true,
      value: { anio: 2026, codContribuyente: 20 },
    });
  });

  it("prepara una asignación completa y rechaza datos sin predio", () => {
    const valid = normalizarAsignacion({ anio: 2026, codPredio: "202628   ", codContribuyente: 20 });
    expect(prepararAsignacionParaFormulario(valid)).toMatchObject({ ok: true, value: { codPredio: "202628", codContribuyente: "20" } });
    expect(prepararAsignacionParaFormulario({ ...valid, codPredio: "" })).toMatchObject({ ok: false });
  });
});

