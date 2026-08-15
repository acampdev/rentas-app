import { afterEach, describe, expect, it, vi } from "vitest";
import { cuentaCorrienteService } from "./cuentaCorrienteService";

describe("CuentaCorrienteService API contract", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends contribuyente, anio and predio to the annual endpoint", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: true, data: [] }));
    vi.stubGlobal("fetch", fetchMock);

    await cuentaCorrienteService.listarEstadoCuenta({
      codContribuyente: 8,
      anio: null,
      codPredio: null,
    });

    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.pathname).toBe("/api/estadoCuenta/listar");
    expect(url.searchParams.get("codContribuyente")).toBe("8");
    expect(url.searchParams.get("anio")).toBe("");
    expect(url.searchParams.get("codPredio")).toBe("");
  });

  it("sends contribuyente, anio and predio to the detail endpoint", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: true, data: [] }));
    vi.stubGlobal("fetch", fetchMock);

    await cuentaCorrienteService.listarDetalleEstadoCuenta(2, 2026, 15);

    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.pathname).toBe("/api/estadoCuenta/listarDetalle");
    expect(url.searchParams.get("codContribuyente")).toBe("2");
    expect(url.searchParams.get("anio")).toBe("2026");
    expect(url.searchParams.get("codPredio")).toBe("15");
  });
});
