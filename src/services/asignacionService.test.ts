import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  asignacionService,
  type CreateAsignacionAPIDTO,
} from "./asignacionService";

const payload: CreateAsignacionAPIDTO = {
  anio: 2024,
  codPredio: "202435",
  codContribuyente: 35,
  codAsignacion: null,
  porcentajeCondomino: null,
  fechaDeclaracion: "2002-12-04",
  fechaVenta: null,
  codModoDeclaracion: "7701",
};

const legacyPayload = {
  ...payload,
  codEstado: "0201",
  estado: "ACTIVO",
  pensionista: 1,
  esPensionista: true,
} as CreateAsignacionAPIDTO;

describe("AsignacionService write contract", () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("auth_token", "token-asignacion");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it.each([
    ["crear", () => asignacionService.crearAsignacionAPI(legacyPayload)],
    [
      "actualizar",
      () => asignacionService.actualizarAsignacionAPI(legacyPayload),
    ],
    ["desasignar", () => asignacionService.desasignarAPI(legacyPayload)],
  ])(
    "preserva el año y fechaVenta y omite campos ajenos al contrato al %s",
    async (_name, execute) => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(Response.json({ success: true, data: payload }));
      vi.stubGlobal("fetch", fetchMock);

      await execute();

      const options = fetchMock.mock.calls[0][1] as RequestInit;
      const body = JSON.parse(String(options.body)) as Record<string, unknown>;
      expect(body).toEqual(payload);
      expect(body.anio).toBe(2024);
      expect(body.fechaVenta).toBeNull();
      expect(body).not.toHaveProperty("codEstado");
      expect(body).not.toHaveProperty("estado");
      expect(body).not.toHaveProperty("pensionista");
      expect(body).not.toHaveProperty("esPensionista");
    },
  );

  it("conserva el mensaje real del API al registrar", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({
        success: true,
        message: "Asignación registrada por el servidor",
        data: payload,
      })),
    );

    const result = await asignacionService.crearAsignacionAPI(payload);
    expect(result.operationMessage).toBe("Asignación registrada por el servidor");
  });
});
