import BaseApiService from './BaseApiService';
import { Role, AuditoriaOperacion } from '../models/Sistema';

/**
 * Servicio para gestión administrativa del sistema (Roles y Auditoría)
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
}

export const sistemaService = SistemaService.getInstance();
export default sistemaService;
