import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const CHUNK_ERROR_PATTERN = /dynamically imported module|failed to fetch|loading chunk|importing a module script/i;

export const isRecoverableChunkError = (error: unknown): boolean =>
  error instanceof Error && CHUNK_ERROR_PATTERN.test(error.message);

/**
 * Recupera una sola vez una ruta diferida cuando el navegador conserva hashes
 * antiguos después de que Vite vuelve a optimizar sus dependencias.
 */
export const lazyWithRetry = <TProps extends object>(
  key: string,
  importer: () => Promise<{ default: ComponentType<TProps> }>,
): LazyExoticComponent<ComponentType<TProps>> => lazy(async () => {
  const storageKey = `lazy-reload:${key}`;
  try {
    const module = await importer();
    sessionStorage.removeItem(storageKey);
    return module;
  } catch (error) {
    if (isRecoverableChunkError(error) && !sessionStorage.getItem(storageKey)) {
      sessionStorage.setItem(storageKey, "1");
      window.location.reload();
      return new Promise<{ default: ComponentType<TProps> }>(() => undefined);
    }
    sessionStorage.removeItem(storageKey);
    throw error;
  }
});
