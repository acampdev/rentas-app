import { API_CONFIG, buildApiUrl, getApiHeaders } from '../config/api.unified.config';

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | Record<string, unknown> | unknown[] | null;
  auth?: boolean;
  timeoutMs?: number;
}

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly data: unknown;
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.data = data;
    this.errors = isRecord(data)
      ? normalizeValidationErrors(data.errors)
      : undefined;
  }
}

export const isApiNotFoundError = (error: unknown): error is ApiClientError =>
  error instanceof ApiClientError && error.statusCode === 404;

export const unwrapApiData = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

export const unwrapApiList = <T>(payload: unknown): T[] => {
  const data = unwrapApiData<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  return data === null || data === undefined ? [] : [data as T];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const collectErrorMessages = (value: unknown, depth = 0): string[] => {
  if (depth > 5 || value === null || value === undefined) return [];

  if (typeof value === 'string') {
    const message = value.trim();
    return message ? [message] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(item => collectErrorMessages(item, depth + 1));
  }

  if (!isRecord(value)) return [];

  return Object.values(value).flatMap(item => collectErrorMessages(item, depth + 1));
};

const normalizeValidationErrors = (value: unknown): Record<string, string[]> | undefined => {
  if (value === null || value === undefined) return undefined;

  if (!isRecord(value)) {
    const messages = collectErrorMessages(value);
    return messages.length ? { general: messages } : undefined;
  }

  const normalized = Object.entries(value).reduce<Record<string, string[]>>((result, [field, detail]) => {
    const messages = collectErrorMessages(detail);
    if (messages.length) result[field] = messages;
    return result;
  }, {});

  return Object.keys(normalized).length ? normalized : undefined;
};

export const extractApiMessage = (
  payload: unknown,
  fallback = 'Ocurrió un error al comunicarse con el servidor.'
): string => {
  if (typeof payload === 'string' && payload.trim()) return payload.trim();
  if (!isRecord(payload)) return fallback;

  const dataMessage = typeof payload.data === 'string' ? payload.data.trim() : '';
  for (const key of ['message', 'mensaje', 'detail', 'error'] as const) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) {
      const message = value.trim();
      if (dataMessage && /^operation failed[.!]?$/i.test(message)) return dataMessage;
      return message;
    }
  }

  if (dataMessage) return dataMessage;

  return collectErrorMessages(payload.errors)[0] ?? fallback;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Ocurrió un error al comunicarse con el servidor.'
): string => {
  if (error instanceof Error && error.message.trim()) return error.message.trim();
  return extractApiMessage(error, fallback);
};

const isFormData = (body: unknown): body is FormData =>
  typeof FormData !== 'undefined' && body instanceof FormData;

const isBodyInit = (body: unknown): body is BodyInit =>
  typeof body === 'string' ||
  isFormData(body) ||
  (typeof Blob !== 'undefined' && body instanceof Blob) ||
  (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) ||
  (typeof ArrayBuffer !== 'undefined' && (
    body instanceof ArrayBuffer || ArrayBuffer.isView(body)
  ));

const serializeBody = (body: ApiRequestOptions['body']): BodyInit | null | undefined => {
  if (body === null || body === undefined || isBodyInit(body)) return body;
  return JSON.stringify(body);
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204 || response.status === 205) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

class ApiClient {
  async fetch(input: string, options: ApiRequestOptions = {}): Promise<Response> {
    const {
      auth = true,
      timeoutMs = API_CONFIG.timeout,
      headers: customHeaders,
      body,
      signal: externalSignal,
      ...requestOptions
    } = options;

    const serializedBody = serializeBody(body);
    const headers = new Headers(getApiHeaders(auth));

    if (customHeaders) {
      new Headers(customHeaders).forEach((value, key) => headers.set(key, value));
    }

    if (isFormData(body)) {
      headers.delete('Content-Type');
    }

    const controller = new AbortController();
    const abortFromExternalSignal = () => controller.abort(externalSignal?.reason);

    if (externalSignal?.aborted) abortFromExternalSignal();
    else externalSignal?.addEventListener('abort', abortFromExternalSignal, { once: true });

    const timeoutId = globalThis.setTimeout(
      () => controller.abort(new DOMException('La petición excedió el tiempo máximo.', 'TimeoutError')),
      timeoutMs
    );

    try {
      const response = await fetch(buildApiUrl(input), {
        ...requestOptions,
        body: serializedBody,
        headers,
        credentials: options.credentials ?? 'include',
        signal: controller.signal
      });

      if (!response.ok) {
        const payload = await parseResponseBody(response.clone());
        throw new ApiClientError(
          extractApiMessage(payload, `Error ${response.status}: ${response.statusText}`),
          response.status,
          payload
        );
      }

      return response;
    } finally {
      globalThis.clearTimeout(timeoutId);
      externalSignal?.removeEventListener('abort', abortFromExternalSignal);
    }
  }

  async request<T>(input: string, options: ApiRequestOptions = {}): Promise<T> {
    const response = await this.fetch(input, options);
    const payload = await parseResponseBody(response);

    if (isRecord(payload) && payload.success === false) {
      throw new ApiClientError(
        extractApiMessage(payload, 'El servidor no pudo completar la operación.'),
        response.status,
        payload
      );
    }

    return payload as T;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
