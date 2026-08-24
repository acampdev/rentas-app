import { logger } from "../../utils/logger";

const configuredApiUrl = String(import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/$/, "");
const mixedContent =
  typeof window !== "undefined" &&
  window.location.protocol === "https:" &&
  configuredApiUrl.startsWith("http:");

if (mixedContent) {
  logger.error(
    "[API] VITE_API_URL no puede usar HTTP desde una página HTTPS. Configure HTTPS o use el mismo origen.",
  );
}

export const API_BASE_URL = configuredApiUrl;

export type ApiQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export function buildApiUrl(endpoint: string, params?: ApiQueryParams) {
  if (/^https?:\/\//.test(endpoint)) return endpoint;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL.replace(/\/$/, "")}${cleanEndpoint}`;
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) query.set(key, String(value));
    });
    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;
  }
  return url;
}
