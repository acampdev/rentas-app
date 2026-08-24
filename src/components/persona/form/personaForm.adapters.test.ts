import { describe, expect, it } from "vitest";
import {
  buildFullAddress,
  getDocumentoConfig,
  mapPersonaToForm,
  normalizeDocumentNumber,
  sortDocumentOptions,
} from "./personaForm.adapters";

describe("persona maintenance form adapters", () => {
  it("ordena los documentos en el orden de uso del formulario", () => {
    const values = sortDocumentOptions([
      { value: "4102", label: "RUC" },
      { value: "4101", label: "DNI" },
      { value: "4104", label: "Partida de nacimiento" },
    ]);
    expect(values.map((value) => value.label)).toEqual([
      "DNI",
      "Partida de nacimiento",
      "RUC",
    ]);
  });

  it("limita el documento según el tipo seleccionado", () => {
    const options = [{ value: "4101", label: "DNI" }];
    expect(getDocumentoConfig(options, "4101").maxLength).toBe(8);
    expect(normalizeDocumentNumber("12A3456789", 8)).toBe("12345678");
  });

  it("adapta una persona del API sin perder la razón social", () => {
    expect(
      mapPersonaToForm({
        codPersona: 2,
        numerodocumento: "123",
        razonSocial: "Empresa SAC",
      }).nombres,
    ).toBe("Empresa SAC");
  });

  it("concatena la dirección y los números adicionales", () => {
    expect(
      buildFullAddress({ id: 1, descripcion: "Calle Lima" }, "4", "A"),
    ).toBe("Calle Lima - N.º Finca 4 - Otro N.º A");
  });
});
