import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pisoService } from "./pisoService";
import type { CreatePisoApiDTO } from "./pisoService";

describe("PisoService editing API contract", () => {
  beforeEach(() => {
    window.sessionStorage.setItem(
      "auth_user",
      JSON.stringify({ codUsuario: 17 }),
    );
    window.sessionStorage.setItem("auth_token", "test-token");
  });

  afterEach(() => {
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("loads the complete floor from /api/piso/all before editing", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json([
        {
          anio: 2025,
          codPredio: "20255       ",
          codPredioBase: "5",
          codPiso: 1,
          numeroPiso: 1,
          fechaConstruccion: "2020-01-16",
          codLetraMurosColumnas: "1101",
          codEstadoConservacion: "9401",
          codMaterialEstructural: "0701",
          areaConstruida: null,
          valorAreasComunes: 200,
          areaTotalConstruccion: 160,
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const piso = await pisoService.consultarPisoParaEdicion({
      anio: 2025,
      codPredioBase: "5",
      numeroPiso: 1,
    });

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      "/api/piso/all?anio=2025&codPredioBase=5&numeroPiso=1",
    );
    expect(piso).toMatchObject({
      anio: 2025,
      codPredio: "20255",
      codPredioBase: "5",
      codPiso: 1,
      numeroPiso: 1,
      fechaConstruccion: "2020-01-16",
      areaConstruida: null,
      valorAreasComunes: 200,
      areaTotalConstruccion: 160,
    });
  });

  it("acepta una actualización exitosa aunque el API devuelva solo un mensaje", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        message: "Operation Success!",
        data: "Piso actualizado correctamente.",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const payload: CreatePisoApiDTO = {
      anio: 2026,
      codPredio: "202628",
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
      codUsuario: 17,
    };

    await expect(pisoService.actualizarPiso(payload)).resolves.toMatchObject({
      operationMessage: "Piso actualizado correctamente.",
      codPredio: "202628",
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "PUT" });
  });
});
