import { describe, expect, it } from "vitest";
import type { ArancelData } from "../../../services/arancelService";
import {
  filterAranceles,
  isSameArancel,
  parseOptionalPositiveInteger,
} from "./selectorDireccionArancel.adapters";

const values = [
  {
    codArancel: 1,
    anio: 2026,
    direccionCompleta: "Calle Lima",
    costoArancel: 25,
  },
  {
    codArancel: 2,
    anio: 2025,
    direccionCompleta: "Avenida Perú",
    costoArancel: 30,
  },
] as ArancelData[];

describe("selectorDireccionArancel adapters", () => {
  it("filtra simultáneamente por texto y año", () => {
    expect(filterAranceles(values, "lima", 2026)).toEqual([values[0]]);
    expect(filterAranceles(values, "", 2025)).toEqual([values[1]]);
  });

  it("identifica registros por código y usa campos compuestos cuando no existe", () => {
    expect(isSameArancel(values[0], { ...values[0] })).toBe(true);
    const withoutId = {
      anio: 2026,
      codDireccion: 8,
      costoArancel: 12,
    } as ArancelData;
    expect(isSameArancel(withoutId, { ...withoutId })).toBe(true);
  });

  it("solo acepta enteros positivos en los filtros numéricos", () => {
    expect(parseOptionalPositiveInteger("2026")).toBe(2026);
    expect(parseOptionalPositiveInteger("0")).toBeNull();
    expect(parseOptionalPositiveInteger("abc")).toBeNull();
  });
});
