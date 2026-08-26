import { describe, expect, it, vi } from "vitest";
import type { PersonaRaw } from "./persona.types";
import {
  buildPersonaName,
  buildPersonaPayload,
  mapPersonaFormToApi,
  mapPersonaToContribuyente,
  normalizePersona,
  resolveCreatedPersona,
  resolveUpdatedPersona,
  unwrapPersonaList,
  validatePersonaDocument,
} from "./persona.adapters";

vi.mock("../../config/api.unified.config", () => ({
  getAuthenticatedUserCode: () => 17,
}));

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
    expect(validatePersonaDocument("4102", "1234567890")).toEqual({ valido: true });
    expect(validatePersonaDocument("4103", "123456789")).toEqual({ valido: true });
    expect(validatePersonaDocument("DESCONOCIDO", "123")).toEqual({ valido: true });
    expect(validatePersonaDocument("4101", "")).toMatchObject({ valido: false });
  });

  it("cubre nombres jurídicos, valores vacíos y respuestas sin lista", () => {
    expect(buildPersonaName({ codTipopersona: "0302", razonSocial: "Empresa SAC" })).toBe("Empresa SAC");
    expect(buildPersonaName({})).toBe("Sin nombre");
    expect(unwrapPersonaList(null)).toEqual([]);
    expect(unwrapPersonaList({ data: [] })).toEqual([]);
    expect(unwrapPersonaList({ message: "sin datos" })).toEqual([]);
  });

  it("construye payloads usando valores explícitos y predeterminados", () => {
    const payload = buildPersonaPayload({
      codTipopersona: "",
      codTipoDocumento: "",
      numerodocumento: "12345678",
      nombres: "Ana",
      apellidomaterno: "",
      apellidopaterno: "",
      fechanacimiento: "2020-01-01",
      codestadocivil: "",
      codsexo: "",
      telefono: "",
      codDireccion: null,
      lote: null,
      otros: null,
      parametroBusqueda: null,
    });
    expect(payload).toMatchObject({
      codTipopersona: "0301",
      codTipoDocumento: "4101",
      codestadocivil: "1801",
      codsexo: "2001",
      codDireccion: 2,
    });
  });

  it("resuelve respuestas de creación y actualización en sus formatos admitidos", () => {
    const input = {
      codTipopersona: "0301",
      codTipoDocumento: "4101",
      numerodocumento: "12345678",
      nombres: "Ana",
      apellidomaterno: "Ríos",
      apellidopaterno: "Pérez",
      fechanacimiento: "2020-01-01",
      codestadocivil: "1801",
      codsexo: "2001",
      telefono: "",
      codDireccion: 2,
      lote: null,
      otros: null,
      parametroBusqueda: null,
    };
    expect(resolveCreatedPersona({ data: "31" }, input).codPersona).toBe(31);
    expect(resolveCreatedPersona([{ codPersona: 32, nombres: "Luis" }], input).codPersona).toBe(32);
    expect(() => resolveCreatedPersona(null, input)).toThrow(/ID de persona válido/);

    const updated = resolveUpdatedPersona([], buildPersonaPayload(input));
    expect(updated.numerodocumento).toBe("12345678");
  });

  it("adapta formularios y contribuyentes con fechas y direcciones alternativas", () => {
    const api = mapPersonaFormToApi({
      isJuridica: true,
      numeroDocumento: "2012345678",
      razonSocial: "Empresa SAC",
      fechaNacimiento: new Date("2020-02-03T00:00:00.000Z"),
      direccion: { codigo: "9" },
      nFinca: "15",
      otroNumero: "A",
    });
    expect(api).toMatchObject({ codTipopersona: "0302", codDireccion: 9, lote: 15, otros: "A" });

    expect(mapPersonaToContribuyente(normalizePersona({
      codPersona: 9,
      numerodocumento: "12345678",
      fechanacimiento: "2020-02-03",
      lote: 15,
    }))).toMatchObject({ fechaNacimiento: expect.any(Number), lote: "15" });
  });
});
