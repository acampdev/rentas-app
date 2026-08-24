import { describe, expect, it } from "vitest";
import type { Sector } from "../../../models/Sector";
import { filterAndSortSectors, paginateSectors } from "./sectorList.adapters";

const createSector = (id: number, nombre: string): Sector => ({
  id,
  nombre,
  cuadrante: id,
  nombreCuadrante: `C${id}`,
  codUnidadUrbana: id,
  unidadUrbana: `U${id}`,
  estado: "ACTIVO",
});

describe("sector list adapters", () => {
  const sectors = [createSector(2, "Sur"), createSector(1, "Centro")];

  it("filtra por nombre sin diferenciar mayúsculas", () => {
    expect(
      filterAndSortSectors(sectors, "CENT", "nombre", "asc", true),
    ).toEqual([sectors[1]]);
  });

  it("ordena por la columna y dirección solicitadas", () => {
    expect(filterAndSortSectors(sectors, "", "id", "desc", true)).toEqual([
      sectors[0],
      sectors[1],
    ]);
  });

  it("pagina sin alterar los registros originales", () => {
    expect(paginateSectors(sectors, 1, 1)).toEqual([sectors[1]]);
    expect(sectors).toHaveLength(2);
  });
});
