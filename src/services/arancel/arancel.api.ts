import { buildApiUrl } from "../../config/api.unified.config";
import apiClient from "../apiClient";

const endpoint = "/api/arancel";

export const requestArancel = <T>(
  suffix: string,
  init: RequestInit,
): Promise<T> =>
  apiClient.request<T>(buildApiUrl(`${endpoint}${suffix}`), init);
