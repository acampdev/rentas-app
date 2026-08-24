import { beforeEach, describe, expect, it } from "vitest";
import type { CreatePisoApiDTO } from "./piso.types";
import {
  buildFloorPayload,
  normalizeFloor,
  unwrapFloors,
} from "./piso.adapters";

const dto: CreatePisoApiDTO = {
  anio: 2026,
  codPredio: "202628 ",
  codPiso: 1,
  numeroPiso: 1,
  fechaConstruccion: "2020-01-16",
  murosColumnas: "100101",
  techos: "100102",
  pisos: "100201",
  puertasVentanas: "100202",
  revestimiento: "100203",
  banios: "100204",
  instalacionesElectricas: "100301",
  codLetraMurosColumnas: "1101",
  codLetraTechos: "1102",
  codLetraPisos: "1103",
  codLetraPuertasVentanas: "1104",
  codLetraRevestimiento: "1105",
  codLetraBanios: "1102",
  codLetraInstalacionesElectricas: "1101",
  codEstadoConservacion: "9401",
  codMaterialEstructural: "0701",
  areaConstruida: "160",
  valorAreasComunes: "200",
  codUsuario: 1,
};

describe("piso adapters", () => {
  beforeEach(() => {
    window.sessionStorage.setItem(
      "auth_user",
      JSON.stringify({ codUsuario: 17 }),
    );
  });

  it("mantiene el valor de áreas comunes en el payload", () => {
    expect(buildFloorPayload(dto, true)).toMatchObject({
      codPredio: "202628",
      areaConstruida: "160",
      valorAreasComunes: "200",
    });
  });

  it("no inventa el área construida cuando el API devuelve null", () => {
    expect(
      normalizeFloor({ codPiso: 1, areaConstruida: null }, 0).areaConstruida,
    ).toBeNull();
  });

  it("extrae pisos desde respuestas envueltas en data", () => {
    expect(unwrapFloors({ success: true, data: [{ codPiso: 1 }] })).toEqual([
      { codPiso: 1 },
    ]);
  });
});
