import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subdivicionService, type CreateSubdivicionDTO } from "./subdivicionService";

const payload: CreateSubdivicionDTO = {
  anio: 2026,
  codPredioMatriz: "202635",
  areaTerrenoNuevaMatriz: 500,
  valorTerrenoNuevoMatriz: null,
  codDireccionNuevo: 1024,
  numeroFincaNuevo: 5,
  otroNumeroNuevo: null,
  codClasificacionNuevo: "0001",
  estPredioNuevo: "0001",
  codTipoPredioNuevo: "0001",
  codCondicionPropiedadNuevo: "0001",
  codUsoNuevo: 1,
  fechaAdquisicionNuevo: "2026-08-28",
  codListaConductorNuevo: "0001",
  areaTerrenoNuevo: 300,
  valorOtrasInstalacionesNuevo: null,
  fechaSubdivision: "2026-08-28",
  periodoEfectivoArbitrios: 9,
};

describe("SubdivicionService", () => {
  beforeEach(() => {
    sessionStorage.setItem("auth_token", "token-subdivicion");
    sessionStorage.setItem("auth_user", JSON.stringify({ codUsuario: 17 }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it("envía el contrato al endpoint con Bearer y usuario autenticado", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      success: true,
      message: "Subdivisión registrada por el API",
      data: null,
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await subdivicionService.crear(payload);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(options.headers);
    const body = JSON.parse(String(options.body));

    expect(url).toBe("/api/subDivisionPrevio");
    expect(options.method).toBe("POST");
    expect(headers.get("Authorization")).toBe("Bearer token-subdivicion");
    expect(body).toMatchObject({ ...payload, usuario: 17 });
    expect(result.message).toBe("Subdivisión registrada por el API");
  });

  it("prioriza el detalle textual de data como mensaje informativo", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
      success: true,
      message: "Operation Success!",
      data: "El predio fue subdividido correctamente.",
    })));

    const result = await subdivicionService.crear(payload);

    expect(result.message).toBe("El predio fue subdividido correctamente.");
  });
});
