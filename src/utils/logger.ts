type LoggerMethod = 'log' | 'debug' | 'info' | 'warn' | 'error' | 'table';

const isDebugLoggingEnabled = (): boolean =>
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true';

const write = (method: LoggerMethod, args: unknown[]): void => {
  if (!isDebugLoggingEnabled() || typeof console === 'undefined') return;

  const consoleMethod = console[method] as (...data: unknown[]) => void;
  consoleMethod(...args);
};

/**
 * Punto único para diagnósticos de desarrollo.
 *
 * Permanece silencioso salvo que VITE_ENABLE_DEBUG_LOGS=true y Vite ejecuta
 * en modo desarrollo. Los mensajes nunca deben sustituir las notificaciones
 * visibles ni el manejo normal de errores de la aplicación.
 */
export const logger = {
  log: (...args: unknown[]) => write('log', args),
  debug: (...args: unknown[]) => write('debug', args),
  info: (...args: unknown[]) => write('info', args),
  warn: (...args: unknown[]) => write('warn', args),
  error: (...args: unknown[]) => write('error', args),
  table: (...args: unknown[]) => write('table', args)
};
