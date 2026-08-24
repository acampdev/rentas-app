import { describe, expect, it } from 'vitest';
import { validateProductionBrowserApiUrl } from './viteApiEnvironment';

describe('configuración segura de la API para producción', () => {
  it('rechaza una API HTTP visible para el navegador', () => {
    expect(() => validateProductionBrowserApiUrl(
      'production',
      'http://api.ejemplo.gob.pe'
    )).toThrow(/no puede usar HTTP en producción/i);
  });

  it('permite una API HTTPS', () => {
    expect(() => validateProductionBrowserApiUrl(
      'production',
      'https://api.ejemplo.gob.pe'
    )).not.toThrow();
  });

  it('permite rutas del mismo origen mediante proxy inverso', () => {
    expect(() => validateProductionBrowserApiUrl('production', '')).not.toThrow();
  });

  it('permite un destino HTTP solamente durante desarrollo', () => {
    expect(() => validateProductionBrowserApiUrl(
      'development',
      'http://localhost:8085'
    )).not.toThrow();
  });
});
