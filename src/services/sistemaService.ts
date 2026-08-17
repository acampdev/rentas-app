import BaseApiService from './BaseApiService';
import { Role, AuditoriaOperacion, ConfiguracionSistema } from '../models/Sistema';

/**
 * Servicio para gestión administrativa del sistema (Roles, Auditoría, Configuración)
 */
type AuditoriaParams = Record<string, string | number | boolean | undefined>;

const buildQuery = (params?: AuditoriaParams): string => {
  if (!params) return '';

  const entries = Object.entries(params)
    .filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
    .map(([key, value]) => [key, String(value)] as [string, string]);

  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : '';
};

class SistemaService extends BaseApiService<unknown> {
  private static instance: SistemaService;

  private constructor() {
    super('/api/sistema', {
      normalizeItem: item => item,
      validateItem: () => true
    }, 'sistema');
  }

  static getInstance(): SistemaService {
    if (!SistemaService.instance) {
      SistemaService.instance = new SistemaService();
    }
    return SistemaService.instance;
  }

  // Roles
  async listarRoles(): Promise<Role[]> {
    const data = await this.makeRequest<{ data?: Role[] } | Role[]>('/roles', { method: 'GET' });
    return Array.isArray(data) ? data : data.data ?? [];
  }

  // Auditoría
  async listarAuditoria(params?: AuditoriaParams): Promise<AuditoriaOperacion[]> {
    const query = buildQuery(params);
    const data = await this.makeRequest<{ data?: AuditoriaOperacion[] } | AuditoriaOperacion[]>(
      `/auditoria${query}`,
      { method: 'GET' }
    );
    return Array.isArray(data) ? data : data.data ?? [];
  }

  // Configuración
  async obtenerConfiguracion(): Promise<ConfiguracionSistema | null> {
    const data = await this.makeRequest<{ data?: ConfiguracionSistema } | ConfiguracionSistema>(
      '/configuracion',
      { method: 'GET' }
    );
    if ('data' in data) {
      return data.data ?? null;
    }
    return data as ConfiguracionSistema;
  }

  async actualizarConfiguracion(datos: Partial<ConfiguracionSistema>): Promise<boolean> {
    await this.makeRequest('/configuracion', {
      method: 'PUT',
      body: JSON.stringify(datos)
    });
    return true;
  }
}

export const sistemaService = SistemaService.getInstance();
export default sistemaService;
