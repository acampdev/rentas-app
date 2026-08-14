import BaseApiService from './BaseApiService';
import { buildApiUrl } from '../config/api.unified.config';
import { Role, AuditoriaOperacion, ConfiguracionSistema } from '../models/Sistema';

/**
 * Servicio para gestión administrativa del sistema (Roles, Auditoría, Configuración)
 */
class SistemaService extends BaseApiService<any, any, any> {
  private static instance: SistemaService;

  private constructor() {
    super('/api/sistema', {
      normalizeItem: (item: any) => item,
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
    try {
      const url = buildApiUrl(`${this.endpoint}/roles`);
      const response = await fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return [];
    }
  }

  // Auditoría
  async listarAuditoria(params?: any): Promise<AuditoriaOperacion[]> {
    try {
      const url = buildApiUrl(`${this.endpoint}/auditoria`);
      const response = await fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return [];
    }
  }

  // Configuración
  async obtenerConfiguracion(): Promise<ConfiguracionSistema | null> {
    try {
      const url = buildApiUrl(`${this.endpoint}/configuracion`);
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return null;
    }
  }

  async actualizarConfiguracion(datos: Partial<ConfiguracionSistema>): Promise<boolean> {
    try {
      const url = buildApiUrl(`${this.endpoint}/configuracion`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const sistemaService = SistemaService.getInstance();
export default sistemaService;
