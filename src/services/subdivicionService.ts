import { getAuthenticatedUserCode } from "../config/api.unified.config";
import apiClient, { extractApiMessage } from "./apiClient";

export interface SubdivicionPayload {
  anio: number;
  codPredioMatriz: string;
  areaTerrenoNuevaMatriz: number;
  valorTerrenoNuevoMatriz: number | null;
  codDireccionNuevo: number;
  numeroFincaNuevo: number;
  otroNumeroNuevo: string | null;
  codClasificacionNuevo: string;
  estPredioNuevo: string;
  codTipoPredioNuevo: string;
  codCondicionPropiedadNuevo: string;
  codUsoNuevo: number | null;
  fechaAdquisicionNuevo: string;
  codListaConductorNuevo: string;
  areaTerrenoNuevo: number;
  valorOtrasInstalacionesNuevo: number | null;
  fechaSubdivision: string;
  periodoEfectivoArbitrios: number;
  usuario: number;
}

export type CreateSubdivicionDTO = Omit<SubdivicionPayload, "usuario">;

export interface SubdivicionResult {
  message: string;
  data: unknown;
}

interface SubdivicionApiResponse {
  success?: boolean;
  message?: string;
  mensaje?: string;
  data?: unknown;
}

class SubdivicionService {
  async crear(datos: CreateSubdivicionDTO): Promise<SubdivicionResult> {
    const response = await apiClient.request<SubdivicionApiResponse>(
      "/api/subDivisionPrevio",
      {
        method: "POST",
        body: {
          ...datos,
          codPredioMatriz: datos.codPredioMatriz.trim(),
          otroNumeroNuevo: datos.otroNumeroNuevo?.trim() || null,
          usuario: getAuthenticatedUserCode(),
        },
      },
    );

    const dataMessage =
      typeof response.data === "string" && response.data.trim()
        ? response.data.trim()
        : "";

    return {
      message:
        dataMessage ||
        extractApiMessage(response, "Subdivisión registrada correctamente."),
      data: response.data,
    };
  }
}

export const subdivicionService = new SubdivicionService();
export default subdivicionService;
