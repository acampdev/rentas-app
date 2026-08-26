import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestQueryWrapper } from "../test/queryClient";
import { useHR } from "./useHR";

const serviceMock = vi.hoisted(() => ({
  buscarHR: vi.fn(),
}));

vi.mock("../services/hrService", () => ({
  hrService: serviceMock,
}));

describe("useHR", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("carga los resultados con una sola ejecución de Buscar", async () => {
    serviceMock.buscarHR.mockResolvedValue([
      { codPredio: "20261", codContribuyente: "27" },
    ]);
    const { wrapper } = createTestQueryWrapper();
    const { result } = renderHook(() => useHR(), { wrapper });

    await act(async () => {
      await result.current.buscarHR({ codContribuyente: " 27 " });
    });

    expect(result.current.hrData).toHaveLength(1);
    expect(serviceMock.buscarHR).toHaveBeenCalledTimes(1);
    expect(serviceMock.buscarHR).toHaveBeenCalledWith({
      codContribuyente: "27",
    });
  });
});
