import { beforeEach, describe, expect, it } from "vitest";
import {
  buildArancelQuery,
  buildCreateArancelPayload,
  normalizeArancel,
  normalizeArancelMutation,
  unwrapArancelList,
} from "./arancel.adapters";
import type { ArancelRaw } from "./arancel.types";

const raw: ArancelRaw = {
  codArancel: 4,
  anio: 2026,
  codDireccion: 8,
  costo: null,
  codUsuario: 17,
  costoArancel: "125.50",
  direccionCompleta: "Calle Central",
  sector: null,
  barrio: null,
  calle: "Central",
};

describe("arancel adapters", () => {
  beforeEach(() => {
    sessionStorage.setItem("auth_user", JSON.stringify({ codUsuario: 17 }));
  });

  it("normaliza costos, textos nulos y aliases del identificador", () => {
    expect(normalizeArancel(raw)).toMatchObject({
      codArancel: 4,
      costoArancel: 125.5,
      sector: "",
    });
    expect(
      normalizeArancel({
        ...raw,
        codArancel: null,
        idArancel: 9,
      } as unknown as ArancelRaw),
    ).toMatchObject({ codArancel: 9 });
  });

  it("extrae listas y no inventa un registro ante una confirmación vacía", () => {
    expect(unwrapArancelList({ success: true, data: [raw] })).toEqual([raw]);
    expect(normalizeArancelMutation({ success: true, data: null })).toBeNull();
    expect(
      normalizeArancelMutation({ success: true, data: raw }),
    ).toMatchObject({
      codArancel: 4,
    });
  });

  it("construye consultas con el usuario autenticado", () => {
    const query = buildArancelQuery({ anio: 2026, codDireccion: 8 }, "a");
    expect(query).toContain("anio=2026");
    expect(query).toContain("codDireccion=8");
    expect(query).toContain("codUsuario=17");
  });

  it("rechaza creaciones incompletas y fuerza el identificador nulo", () => {
    expect(() =>
      buildCreateArancelPayload({
        anio: 0,
        codDireccion: 8,
        costo: 10,
        codUsuario: 17,
      }),
    ).toThrow("Faltan datos");
    expect(
      buildCreateArancelPayload({
        codArancel: null,
        anio: 2026,
        codDireccion: 8,
        costo: 10,
        codUsuario: 17,
      }),
    ).toMatchObject({ codArancel: null, costo: 10 });
  });
});
