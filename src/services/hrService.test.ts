import { afterEach, describe, expect, it, vi } from "vitest";
import { hrService } from "./hrService";

describe("HRService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("conserva una fila válida aunque codPredio venga null", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        data: [
          {
            codPredio: null,
            codContribuyente: 27,
            direccionFiscal: "Manuel Arevalo II",
            autoavaluo: 15000,
            impuestoPredial: 120,
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await hrService.buscarHR({ codContribuyente: "27" });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      codPredio: "",
      codContribuyente: "27",
      direccionFiscal: "Manuel Arevalo II",
      autoavaluo: "15000",
    });
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/api/hr?codContribuyente=27",
    );
  });
});
