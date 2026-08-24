import { describe, expect, it } from "vitest";
import {
  buildContributorSearchParams,
  normalizeContributor,
  unwrapContributorList,
} from "./contribuyente.adapters";

describe("contribuyente adapters", () => {
  it("normaliza nombres y códigos alternativos del API", () => {
    const result = normalizeContributor({
      codContribuyente: 8,
      codPersona: 20,
      codTipopersona: "0301",
      numerodocumento: "12345678",
      nombres: "Ana",
      apellidopaterno: "Torres",
    });
    expect(result).toMatchObject({
      codigo: 8,
      codigoPersona: 20,
      numeroDocumento: "12345678",
      nombreCompleto: "Torres Ana",
    });
  });

  it("convierte una búsqueda numérica corta en código de contribuyente", () => {
    const params = buildContributorSearchParams({
      parametroBusqueda: "21",
      esExonerado: true,
    });
    expect(params.get("parametroBusqueda")).toBe("");
    expect(params.get("codigoContribuyente")).toBe("21");
    expect(params.get("esExonerado")).toBe("1");
  });

  it("extrae listas desde el sobre data", () => {
    expect(unwrapContributorList({ data: [{ codContribuyente: 1 }] })).toEqual([
      { codContribuyente: 1 },
    ]);
  });
});
