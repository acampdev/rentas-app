import { buildApiUrl, getApiHeaders } from "../../config/api.unified.config";
import { logger } from "../../utils/logger";
import type { ApiStatus } from "./connectivity.types";

export const getApiName = (endpoint: string): string => {
  const parts = endpoint.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? endpoint;
};

export async function checkConnectivityEndpoint(
  endpoint: string,
  timeout: number,
): Promise<ApiStatus> {
  const apiName = getApiName(endpoint);
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${buildApiUrl(endpoint)}?limite=1`, {
      method: "GET",
      headers: { ...getApiHeaders(false), Accept: "application/json" },
      signal: controller.signal,
    });
    const responseTime = Date.now() - startTime;
    const contentType = response.headers.get("content-type");
    let available = false;

    if (response.ok && contentType?.includes("application/json")) {
      try {
        await response.json();
        available = true;
      } catch {
        available = false;
      }
    } else if (response.status === 401 || response.status === 403) {
      available = true;
    } else if (contentType?.includes("text/html")) {
      logger.warn(
        `⚠️ [ConnectivityService] ${apiName} devolvió HTML en lugar de JSON`,
      );
    }

    logger.log(
      `${available ? "✅" : "❌"} [ConnectivityService] ${apiName}: ${available ? "Disponible" : "No disponible"} (${responseTime}ms)`,
    );
    return {
      available,
      lastCheck: new Date(),
      responseTime,
      error: available
        ? undefined
        : `HTTP ${response.status} - ${response.statusText}`,
    };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    const message = aborted
      ? "Timeout"
      : error instanceof Error
        ? error.message
        : String(error);
    if (!aborted) {
      logger.error(
        `❌ [ConnectivityService] Error verificando ${apiName}:`,
        message,
      );
    }
    return { available: false, lastCheck: new Date(), error: message };
  } finally {
    clearTimeout(timeoutId);
  }
}
