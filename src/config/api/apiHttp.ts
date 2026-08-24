export const ERROR_MESSAGES = {
  NETWORK: "Error de conexión. Verifique su internet.",
  UNAUTHORIZED: "No autorizado.",
  FORBIDDEN: "No tiene permisos para realizar esta acción.",
  NOT_FOUND: "Recurso no encontrado.",
  SERVER_ERROR: "Error del servidor. Intente más tarde.",
  TIMEOUT: "La petición excedió el tiempo límite.",
  UNKNOWN: "Error desconocido.",
  CORS: "Error de CORS. Verifique la configuración del servidor.",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export function getErrorMessage(statusCode: number) {
  if (statusCode === 400)
    return "Solicitud incorrecta. Verifique los datos enviados.";
  if (statusCode === 401) return ERROR_MESSAGES.UNAUTHORIZED;
  if (statusCode === 403) return ERROR_MESSAGES.FORBIDDEN;
  if (statusCode === 404) return ERROR_MESSAGES.NOT_FOUND;
  if (statusCode === 408) return ERROR_MESSAGES.TIMEOUT;
  if ([500, 502, 503].includes(statusCode)) return ERROR_MESSAGES.SERVER_ERROR;
  return ERROR_MESSAGES.UNKNOWN;
}
