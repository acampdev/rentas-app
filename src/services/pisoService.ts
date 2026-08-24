import BaseApiService from "./BaseApiService";
import { isApiNotFoundError } from "./apiClient";
import {
  buildFloorPayload,
  buildFloorQuery,
  floorMutationError,
  normalizeFloor,
  unwrapFloors,
} from "./piso/piso.adapters";
import type {
  CreatePisoApiDTO,
  PisoData,
  PisoDeleteQuery,
  PisoEditQuery,
  PisoMutationResponse,
  PisoQuery,
  PisoRaw,
} from "./piso/piso.types";

export type {
  CreatePisoApiDTO,
  PisoData,
  PisoDeleteQuery,
  PisoEditQuery,
  PisoQuery,
  PisoRaw,
} from "./piso/piso.types";

class PisoService extends BaseApiService<
  PisoData,
  CreatePisoApiDTO,
  Partial<CreatePisoApiDTO>,
  PisoRaw
> {
  private static instance: PisoService;

  private constructor() {
    super("/api/piso", { normalizeItem: normalizeFloor }, "piso");
  }

  static getInstance(): PisoService {
    if (!PisoService.instance) PisoService.instance = new PisoService();
    return PisoService.instance;
  }

  async consultarPisos(params: PisoQuery): Promise<PisoData[]> {
    try {
      const response = await this.makeRequest<unknown>(
        `?${buildFloorQuery(params)}`,
        {
          method: "GET",
        },
      );
      return this.normalizeData(unwrapFloors(response));
    } catch (error) {
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async consultarPisoParaEdicion(
    params: PisoEditQuery,
  ): Promise<PisoData | null> {
    const query = new URLSearchParams({
      anio: String(params.anio),
      codPredioBase: params.codPredioBase.trim(),
      numeroPiso: String(params.numeroPiso),
    });
    const response = await this.makeRequest<unknown>(
      `/all?${query.toString()}`,
      {
        method: "GET",
      },
    );
    const floors = this.normalizeData(unwrapFloors(response));
    return (
      floors.find((floor) => Number(floor.numeroPiso) === params.numeroPiso) ??
      floors[0] ??
      null
    );
  }

  async actualizarPiso(data: CreatePisoApiDTO): Promise<PisoData> {
    this.validateFloor(data, true);
    return this.mutateFloor("PUT", buildFloorPayload(data, true), "actualizar");
  }

  async crearPisoSinAuth(data: CreatePisoApiDTO): Promise<PisoData> {
    this.validateFloor(data, false);
    return this.mutateFloor("POST", buildFloorPayload(data, false), "crear");
  }

  async eliminarPiso(params: PisoDeleteQuery): Promise<boolean> {
    if (!params.codPredio.trim()) throw new Error("codPredio es requerido");
    if (!params.numeroPiso || params.numeroPiso <= 0)
      throw new Error("numeroPiso es requerido");
    const body: Record<string, string | number> = {
      anio: Number(params.anio || new Date().getFullYear()),
      codPredio: params.codPredio.trim(),
      numeroPiso: Number(params.numeroPiso),
    };
    if (params.codPiso && params.codPiso > 0)
      body.codPiso = Number(params.codPiso);
    try {
      const response = await this.makeRequest<PisoMutationResponse>(
        "/eliminar",
        {
          method: "PUT",
          body: JSON.stringify(body),
        },
      );
      const error = floorMutationError(response);
      if (error) throw new Error(error);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo eliminar el piso";
      if (["Operation Failed!", "Error al eliminar piso"].includes(message)) {
        throw new Error(
          "No se pudo eliminar el piso. Verifique que el piso exista y no tenga dependencias.",
        );
      }
      throw error;
    }
  }

  private async mutateFloor(
    method: "POST" | "PUT",
    body: CreatePisoApiDTO,
    action: string,
  ): Promise<PisoData> {
    const response = await this.makeRequest<PisoMutationResponse | PisoRaw>(
      "",
      {
        method,
        body: JSON.stringify(body),
      },
    );
    const error = floorMutationError(response as PisoMutationResponse);
    if (error) throw new Error(error);
    const raw = unwrapFloors(response)[0];
    if (!raw)
      throw new Error(`El servidor no devolvió datos del piso al ${action}`);
    return normalizeFloor(raw, 0);
  }

  private validateFloor(data: CreatePisoApiDTO, editing: boolean): void {
    if (!data.codPredio?.trim()) throw new Error("codPredio es requerido");
    if (editing && (!data.codPiso || data.codPiso <= 0))
      throw new Error("codPiso es requerido para actualizar");
    if (!editing && (!data.numeroPiso || data.numeroPiso <= 0))
      throw new Error("numeroPiso es requerido y debe ser mayor a 0");
    if (!editing && (!data.areaConstruida || Number(data.areaConstruida) <= 0))
      throw new Error("areaConstruida es requerido y debe ser mayor a 0");
  }
}

export const pisoService = PisoService.getInstance();
export default PisoService;
