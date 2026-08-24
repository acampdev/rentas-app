import { afterEach, describe, expect, it, vi } from "vitest";
import { contribuyenteService } from "./contribuyenteService";

const apiItem = {
  codPersona: 1,
  codContribuyente: 1,
  codTipopersona: "0301",
  codTipoDocumento: "1",
  numerodocumento: "40953876",
  nombres: "Aydee Zenobia",
  apellidopaterno: "Castro",
  apellidomaterno: "Ramirez",
  direccion: "AA.HH. Nuevo Jerusalen",
  tipoContribuyente: "Natural",
};

describe("ContribuyenteService selector contract", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads the full register from the base endpoint when there are no filters", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        data: [apiItem],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await contribuyenteService.buscarContribuyentes({});

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/api/contribuyente?codigoContribuyente=&codigoPersona=",
    );
    expect(String(fetchMock.mock.calls[0][0])).not.toContain("/general");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      codigo: 1,
      codigoPersona: 1,
      numeroDocumento: "40953876",
      nombreCompleto: "Castro Ramirez Aydee Zenobia",
    });
  });

  it("sends exemption and pensioner flags as contributor data", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        data: 55,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await contribuyenteService.crearContribuyenteAPI({
      codPersona: 10,
      codConyuge: null,
      codRepresentanteLegal: null,
      codestado: "0201",
      codUsuario: 17,
      esExonerado: true,
      esPensionista: false,
    });

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(options.body))).toMatchObject({
      codPersona: 10,
      esExonerado: true,
      esPensionista: false,
    });
  });

  it("recovers the created contributor when POST returns only a success message", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          data: "Contribuyente registrado correctamente.",
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          data: [{ ...apiItem, codPersona: 25, codContribuyente: 73 }],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await contribuyenteService.crearContribuyenteAPI({
      codPersona: 25,
      codConyuge: null,
      codRepresentanteLegal: null,
      codestado: "0201",
      codUsuario: 17,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain(
      "codigoContribuyente=&codigoPersona=25",
    );
    expect(result.codigo).toBe(73);
  });

  it("sends the stored Bearer token in direct API operations", async () => {
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: vi.fn((key: string) =>
          key === "auth_token" ? "token-prueba" : null,
        ),
      },
    });
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        data: [apiItem],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await contribuyenteService.buscarContribuyentes({
      numeroDocumento: "40953876",
    });

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(new Headers(options.headers).get("Authorization")).toBe(
      "Bearer token-prueba",
    );
    expect(options.credentials).toBe("include");
  });
});
