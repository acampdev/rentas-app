import { buildApiUrl, getEndpoint } from "../../config/api.unified.config";
import apiClient from "../apiClient";
import type { PersonaApiPayload } from "./persona.types";

export const listarPersonaRequest = async (
  codTipoDocumento: string,
  numeroDocumento: string,
): Promise<unknown> => {
  const query = new URLSearchParams({ codTipoDocumento, numeroDocumento });
  const url = buildApiUrl(getEndpoint("persona", "listarPersona"));
  return apiClient.request<unknown>(`${url}?${query.toString()}`, {
    method: "GET",
  });
};

export const guardarPersonaRequest = (
  method: "POST" | "PUT",
  payload: PersonaApiPayload,
): Promise<unknown> =>
  apiClient.request<unknown>(buildApiUrl("/api/persona"), {
    method,
    body: JSON.stringify(payload),
  });
