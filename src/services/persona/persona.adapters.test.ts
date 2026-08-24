import { describe, expect, it } from "vitest";
import type { PersonaRaw } from "./persona.types";
import {
  normalizePersona,
  unwrapPersonaList,
  validatePersonaDocument,
} from "./persona.adapters";

describe("persona adapters", () => {
  it("normaliza aliases del identificador y construye el nombre completo", () => {
    const persona = normalizePersona({
      codigoPersona: "25",
      numerodocumento: "12345678",
      nombres: "Ana",
      apellidopaterno: "Pérez",
      apellidomaterno: "Ríos",
    } as unknown as PersonaRaw);

    expect(persona).toMatchObject({
      codPersona: 25,
      nombrePersona: "Pérez Ríos Ana",
      estado: "ACTIVO",
    });
  });

  it("extrae listas, respuestas envueltas y elementos individuales", () => {
    const raw = { codPersona: 2, numerodocumento: "12345678" };
    expect(unwrapPersonaList([raw])).toEqual([raw]);
    expect(unwrapPersonaList({ data: raw })).toEqual([raw]);
    expect(unwrapPersonaList(raw)).toEqual([raw]);
  });

  it("aplica las reglas de documento y sus códigos equivalentes", () => {
    expect(validatePersonaDocument("4101", "12345678")).toEqual({
      valido: true,
    });
    expect(validatePersonaDocument("DNI", "123")).toMatchObject({
      valido: false,
    });
    expect(validatePersonaDocument("4104", "1234567890123456")).toMatchObject({
      valido: false,
    });
  });
});
