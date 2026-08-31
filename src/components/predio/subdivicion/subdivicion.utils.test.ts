import { describe, expect, it } from "vitest";
import type { Predio } from "../../../models/Predio";
import {
  applySelectedPredio,
  buildSubdivicionPayload,
  createInitialSubdivicionForm,
  getFullPredioCode,
  getMatrixAddress,
  normalizePositiveDecimalInput,
} from "./subdivicion.utils";

const predio = {
  codigoPredio: "35",
  codPredio: "35",
  codPredioBase: "35",
  anio: 2026,
  condicionPropiedad: "Propietario",
  conductor: "Privado",
  areaTerreno: 800,
  codDireccion: 1024,
  codClasificacion: 1,
  estPredio: "0001",
  codTipoPredio: 1,
  codCondicionPropiedad: 1,
  codUso: 1,
  codListaConductor: 1,
} satisfies Predio;

describe("subdivicion.utils", () => {
  it("acepta solo enteros y decimales no negativos en el área nueva", () => {
    expect(normalizePositiveDecimalInput("300")).toBe("300");
    expect(normalizePositiveDecimalInput("300.50")).toBe("300.50");
    expect(normalizePositiveDecimalInput("300,50")).toBe("300.50");
    expect(normalizePositiveDecimalInput("-20")).toBeNull();
    expect(normalizePositiveDecimalInput("20abc")).toBeNull();
    expect(normalizePositiveDecimalInput("20.1.2")).toBeNull();
  });

  it("acepta valor positivo o null para otras instalaciones", () => {
    const selected = applySelectedPredio(createInitialSubdivicionForm(), predio);
    const baseForm = {
      ...selected,
      areaTerrenoNuevaMatriz: "500",
      numeroFincaNuevo: "5",
      areaTerrenoNuevo: "300",
    };

    expect(buildSubdivicionPayload(baseForm).valorOtrasInstalacionesNuevo)
      .toBeNull();
    expect(buildSubdivicionPayload({
      ...baseForm,
      valorOtrasInstalacionesNuevo: "125.50",
    }).valorOtrasInstalacionesNuevo).toBe(125.5);
    expect(() => buildSubdivicionPayload({
      ...baseForm,
      valorOtrasInstalacionesNuevo: "-1",
    })).toThrow("El valor de otras instalaciones debe ser mayor que cero.");
  });

  it("reconstruye el código completo del predio matriz", () => {
    expect(getFullPredioCode(predio)).toBe("202635");
  });

  it("muestra la dirección sin mezclar el lote", () => {
    expect(getMatrixAddress({ ...predio, direccion: "Av. Central Mz. A, LT 9" }))
      .toBe("Av. Central Mz. A");
  });

  it("carga número de finca y otro número desde los campos del API", () => {
    const selected = applySelectedPredio(createInitialSubdivicionForm(), {
      ...predio,
      numeroFinca: "49",
      otroNumero: "12",
      valorTerreno: 54400,
      direccion: "AA.HH. Indoamerica Mz. 11, LT 49",
    });

    expect(selected.numeroFincaNuevo).toBe("49");
    expect(selected.otroNumeroNuevo).toBe("12");
    expect(selected.areaTerrenoNuevaMatriz).toBe("800");
    expect(selected.valorTerrenoNuevoMatriz).toBe("54400");
  });

  it("extrae el lote de la dirección cuando el API no lo separa", () => {
    const selected = applySelectedPredio(createInitialSubdivicionForm(), {
      ...predio,
      direccion: "AA.HH. Indoamerica Mz. 11, LT 49",
    });

    expect(selected.numeroFincaNuevo).toBe("49");
  });

  it("envía uso nulo para Casa Habitación", () => {
    const selected = applySelectedPredio(createInitialSubdivicionForm(), {
      ...predio,
      codClasificacion: 501,
    });
    const payload = buildSubdivicionPayload({
      ...selected,
      codClasificacionNuevo: "0501",
      areaTerrenoNuevaMatriz: "500",
      numeroFincaNuevo: "5",
      areaTerrenoNuevo: "300",
    });

    expect(payload.codUsoNuevo).toBeNull();
  });

  it("adapta y valida los datos del formulario", () => {
    const selected = applySelectedPredio(createInitialSubdivicionForm(), predio);
    const payload = buildSubdivicionPayload({
      ...selected,
      areaTerrenoNuevaMatriz: "500",
      numeroFincaNuevo: "5",
      areaTerrenoNuevo: "300",
    });

    expect(payload).toMatchObject({
      anio: 2026,
      codPredioMatriz: "202635",
      areaTerrenoNuevaMatriz: 500,
      codDireccionNuevo: 1024,
      numeroFincaNuevo: 5,
      areaTerrenoNuevo: 300,
    });
  });
});
