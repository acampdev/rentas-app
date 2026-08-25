import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  asignacionService,
  type CreateAsignacionAPIDTO,
} from "./asignacionService";

const payload: CreateAsignacionAPIDTO = {
  anio: new Date().getFullYear(),
  codPredio: "202628",
  codContribuyente: 20,
  codAsignacion: null,
  porcentajeCondomino: null,
  fechaDeclaracion: "2026-02-26",
  fechaVenta: "2026-02-26",
  codModoDeclaracion: "0402",
};

const legacyPayload = {
  ...payload,
  anio: 2026,
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
    "includes current year and omits status and pensioner fields when %s",
    async (_name, execute) => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(Response.json({ success: true, data: payload }));
      vi.stubGlobal("fetch", fetchMock);

      await execute();

      const options = fetchMock.mock.calls[0][1] as RequestInit;
      const body = JSON.parse(String(options.body)) as Record<string, unknown>;
      expect(body).toEqual(payload);
      expect(body.anio).toBe(new Date().getFullYear());
      expect(body).not.toHaveProperty("codEstado");
      expect(body).not.toHaveProperty("estado");
      expect(body).not.toHaveProperty("pensionista");
      expect(body).not.toHaveProperty("esPensionista");
    },
  );
});
