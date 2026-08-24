import { describe, expect, it } from "vitest";
import {
  buildCreateDireccionPayload,
  buildUpdateDireccionPayload,
  normalizeDireccion,
  resolveCreatedDireccion,
  validateDireccionLots,
} from "./direccion.adapters";

describe("direccion adapters", () => {
  it("normaliza los códigos y datos descriptivos del API", () => {
    expect(
      normalizeDireccion({ codDireccion: 8, codVia: 3, codLado: 8101 }),
    ).toMatchObject({ id: 8, codigoCalle: 3, lado: "PAR" });
  });

  it("construye el POST con enteros y el usuario autenticado", () => {
    expect(
      buildCreateDireccionPayload({ codigoSector: 2.9, lado: "IMPAR" }, 17),
    ).toMatchObject({ codSector: 2, codLado: 8102, codUsuario: 17 });
  });

  it("prioriza barrio sobre sector al construir el PUT", () => {
    expect(
      buildUpdateDireccionPayload(5, { codigoSector: 2, codigoBarrio: 4 }, 17),
    ).toMatchObject({ codDireccion: 5, codSector: null, codBarrio: 4 });
  });

  it("rechaza rangos de lotes invertidos", () => {
    expect(() =>
      validateDireccionLots({ loteInicial: 10, loteFinal: 2 }),
    ).toThrow("lote inicial");
  });

  it("no inventa identificadores cuando el POST devuelve una respuesta incompleta", () => {
    expect(() =>
      resolveCreatedDireccion({ success: true, data: null }),
    ).toThrow("no devolvió");
    expect(resolveCreatedDireccion("25").id).toBe(25);
  });
});
