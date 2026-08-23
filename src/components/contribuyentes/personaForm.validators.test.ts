import { describe, expect, it } from "vitest";
import { filtrarTiposDocumento, obtenerConfiguracionDocumento, soloNumeros } from "./personaForm.validators";

const options = [
  { value: "4101", label: "DNI" },
  { value: "4102", label: "RUC" },
  { value: "4103", label: "Carnet de Extranjería" },
  { value: "4105", label: "Partida de Nacimiento" },
  { value: "4106", label: "Sin DNI" },
];

describe("reglas del formulario de persona", () => {
  it("permite únicamente RUC para persona jurídica", () => {
    expect(filtrarTiposDocumento(options, true).map((option) => option.label)).toEqual(["RUC"]);
  });

  it("permite los documentos definidos para persona natural", () => {
    expect(filtrarTiposDocumento(options, false).map((option) => option.label)).toEqual([
      "DNI", "Carnet de Extranjería", "Partida de Nacimiento", "Sin DNI",
    ]);
  });

  it("aplica longitud numérica según el documento", () => {
    const dni = obtenerConfiguracionDocumento("4101", options);
    const ruc = obtenerConfiguracionDocumento("4102", options);
    expect(dni.pattern.test("12345678")).toBe(true);
    expect(ruc.pattern.test("20123456789")).toBe(true);
    expect(soloNumeros("20A1234567899", ruc.maxLength)).toBe("20123456789");
  });
});
