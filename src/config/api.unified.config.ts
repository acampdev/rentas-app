import { API_ENDPOINTS, resolveEndpoint } from "./api/apiEndpoints";
import { ERROR_MESSAGES, HTTP_STATUS } from "./api/apiHttp";
import { API_BASE_URL } from "./api/apiUrl";

export {
  getApiHeaders,
  getAuthenticatedUserCode,
  getAuthToken,
  getStoredAuthUser,
  requiresAuth,
} from "./api/apiAuth";
export { getErrorMessage } from "./api/apiHttp";
export { API_BASE_URL, buildApiUrl } from "./api/apiUrl";
export type { ApiQueryParams } from "./api/apiUrl";
export type { ComplexEndpoint, EndpointsConfig } from "./api/apiEndpoints";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  retries: 3,
  defaultHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  requiresAuth: true,
  endpoints: API_ENDPOINTS,
  defaultParams: { parametrosBusqueda: "a" },
  cache: { enabled: true, duration: 5 * 60 * 1000, maxSize: 100 },
};

export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: API_CONFIG.timeout,
  DEFAULT_SEARCH_PARAM: API_CONFIG.defaultParams.parametrosBusqueda,
  ERROR_MESSAGES,
  HTTP_STATUS,
};

export const getEndpoint = resolveEndpoint;

export const getHealthCheckEndpoints = (): string[] => [
  resolveEndpoint("sector"),
  resolveEndpoint("barrio"),
  resolveEndpoint("contribuyente"),
  resolveEndpoint("predio"),
];
