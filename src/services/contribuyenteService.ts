import { buildApiUrl } from "../config/api.unified.config";
import BaseApiService from "./BaseApiService";
import apiClient, { extractApiMessage, isApiNotFoundError } from "./apiClient";
import {
  buildContributorSearchParams,
  contributorFromDetail,
  createdContributor,
  hasContributorFilters,
  normalizeContributor,
  unwrapContributorDetail,
  unwrapContributorList,
} from "./contribuyente/contribuyente.adapters";
import type {
  BusquedaContribuyenteParams,
  ContribuyenteData,
  ContribuyenteDetalle,
  ContribuyenteRaw,
  CreateContribuyenteAPIDTO,
  CreateContribuyenteDTO,
  UpdateContribuyenteDTO,
} from "./contribuyente/contribuyente.types";

export type {
  BusquedaContribuyenteParams,
  ContribuyenteData,
  ContribuyenteDetalle,
  ContribuyenteRaw,
  CreateContribuyenteAPIDTO,
  CreateContribuyenteDTO,
  UpdateContribuyenteDTO,
} from "./contribuyente/contribuyente.types";

class ContribuyenteService extends BaseApiService<
  ContribuyenteData,
  CreateContribuyenteDTO,
  UpdateContribuyenteDTO,
  ContribuyenteRaw
> {
  private static instance: ContribuyenteService;

  private constructor() {
    super(
      "/api/contribuyente",
      {
        normalizeItem: normalizeContributor,
        validateItem: (item) =>
          Boolean(item.codigo || item.codigoPersona || item.numeroDocumento),
      },
      "contribuyente",
    );
  }

  static getInstance(): ContribuyenteService {
    if (!ContribuyenteService.instance)
      ContribuyenteService.instance = new ContribuyenteService();
    return ContribuyenteService.instance;
  }

  async buscarContribuyentes(
    criterios: BusquedaContribuyenteParams = {},
  ): Promise<ContribuyenteData[]> {
    if (!hasContributorFilters(criterios)) {
      return this.getAll({ codigoContribuyente: "", codigoPersona: "" });
    }
    const url = buildApiUrl("/api/contribuyente/general");
    const payload = await apiClient.request<unknown>(
      `${url}?${buildContributorSearchParams(criterios).toString()}`,
    );
    return this.normalizeData(unwrapContributorList(payload));
  }

  obtenerTodosContribuyentes(): Promise<ContribuyenteData[]> {
    return this.buscarContribuyentes({});
  }

  async obtenerContribuyenteDetalle(
    codigoContribuyente: number | string,
    codigoPersona: number | string = "",
  ): Promise<ContribuyenteDetalle | null> {
    const contributor = ["", 0, "0"].includes(codigoContribuyente)
      ? ""
      : String(codigoContribuyente);
    const person = ["", 0, "0"].includes(codigoPersona)
      ? ""
      : String(codigoPersona);
    const url = buildApiUrl(this.endpoint, {
      codigoContribuyente: contributor,
      codigoPersona: person,
    });
    try {
      return unwrapContributorDetail(await apiClient.request<unknown>(url));
    } catch (error) {
      if (isApiNotFoundError(error)) return null;
      throw error;
    }
  }

  async crearContribuyenteAPI(
    datos: CreateContribuyenteAPIDTO,
  ): Promise<ContribuyenteData> {
    if (!datos.codPersona || !datos.codestado) {
      throw new Error("Código de persona y estado son requeridos");
    }
    const { codContribuyente: _omitted, ...body } = datos;
    const payload = await apiClient.request<unknown>(
      buildApiUrl(this.endpoint),
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    const payloadRecord =
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>)
        : null;
    const responseData = payloadRecord?.data;
    const operationMessage =
      typeof responseData === "string" &&
      responseData.trim() &&
      !/^\d+$/.test(responseData.trim())
        ? responseData.trim()
        : extractApiMessage(payload, "Contribuyente guardado correctamente");
    const result = createdContributor(payload, datos);
    if (!result) {
      // Algunos despliegues confirman la inserción devolviendo solamente un
      // mensaje. Recuperar el registro real evita inventar un identificador y
      // permite completar correctamente el flujo del formulario.
      const createdDetail = await this.obtenerContribuyenteDetalle(
        "",
        datos.codPersona,
      );
      if (createdDetail?.codContribuyente) {
        return {
          ...contributorFromDetail(createdDetail),
          operationMessage,
        };
      }
      throw new Error(
        "El contribuyente fue procesado, pero el servidor no devolvió ni permitió recuperar su código.",
      );
    }
    const isNormalized =
      "codigo" in result &&
      "codigoPersona" in result &&
      "nombreCompleto" in result &&
      "numeroDocumento" in result;
    const contributor = isNormalized
      ? (result as ContribuyenteData)
      : normalizeContributor(result);
    return { ...contributor, operationMessage };
  }
}

export const contribuyenteService = ContribuyenteService.getInstance();
export default ContribuyenteService;
