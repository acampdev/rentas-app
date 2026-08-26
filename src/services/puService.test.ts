import { afterEach, describe, expect, it, vi } from "vitest";
import { puService } from "./puService";

describe("PUService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("conserva las filas del API cuando codPredio es null", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        data: [
          {
            codPredio: null,
            codContribuyente: "27",
            nivelPiso: "1",
            direccion: "Manuel Arevalo II",
            areaConstruida: "19.80",
          },
          {
            codPredio: null,
            codContribuyente: "27",
            nivelPiso: "2",
            direccion: "Manuel Arevalo II",
            areaConstruida: "18.00",
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await puService.buscarPU({ codContribuyente: "27" });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      codPredio: "",
      codContribuyente: "27",
      nivelPiso: "1",
    });
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/api/pu?codContribuyente=27",
    );
  });
});
