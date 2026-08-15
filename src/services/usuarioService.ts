// services/usuarioService.ts
import BaseApiService from './BaseApiService';

/**
 * Interfaces para Usuario
 */
export interface UsuarioData {
  codUsuario: number;
  nombrePersona: string;
  documento: string;
  username: string;
  password: string | null;
  codRol: number | null;
  parametroBusqueda: string | null;
  rol: string;
  estado: string;
  usuario: string | null;
}

export interface CreateUsuarioDTO {
  username: string;
  nombrePersona: string;
  documento: string;
  codEstado: string;
  password: string;
  codRol: number;
}

export interface UpdateUsuarioDTO {
  codUsuario: number;
  username: string;
  nombrePersona: string;
  documento: string;
  codEstado: string;
  codRol: number;
}

export interface CambiarClaveDTO {
  codUsuario: number;
  password: string;
}

export interface DarBajaDTO {
  codUsuario: number;
}

export interface ActivarDTO {
  codUsuario: number;
}

export interface ListarUsuariosParams {
  parametroBusqueda?: string;
}

/**
 * Interfaz para los datos crudos que vienen del API de Usuario
 */
export interface UsuarioRaw {
  codUsuario?: number;
  nombrePersona?: string;
  documento?: string;
  username?: string;
  password?: string | null;
  codRol?: number | null;
  parametroBusqueda?: string | null;
  rol?: string;
  estado?: string;
  usuario?: string | null;
}

interface UsuarioApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
}

const extraerUsuario = (response: UsuarioRaw | UsuarioApiResponse<UsuarioRaw>): UsuarioRaw | undefined => {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return response.data;
  }
  return response as UsuarioRaw;
};

/**
 * Servicio para gestion de usuarios
 *
 * Todas las operaciones requieren autenticación Bearer.
 */
class UsuarioService extends BaseApiService<UsuarioData, CreateUsuarioDTO, UpdateUsuarioDTO, UsuarioRaw> {
  private static instance: UsuarioService;

  public static getInstance(): UsuarioService {
    if (!UsuarioService.instance) {
      UsuarioService.instance = new UsuarioService();
    }
    return UsuarioService.instance;
  }

  private constructor() {
    super(
      '/api/usuario',
      {
        normalizeItem: (item: UsuarioRaw) => ({
          codUsuario: item.codUsuario || 0,
          nombrePersona: item.nombrePersona || '',
          documento: item.documento || '',
          username: item.username || '',
          password: item.password || null,
          codRol: item.codRol || null,
          parametroBusqueda: item.parametroBusqueda || null,
          rol: item.rol || '',
          estado: item.estado || '',
          usuario: item.usuario || null
        }),
        validateItem: (item: UsuarioData) => !!(item.username && item.codUsuario >= 0)
      },
      'usuarios'
    );
  }

  /**
   * Lista usuarios con filtro opcional
   * GET /api/usuario/listar?parametroBusqueda=
   */
  async listar(params?: ListarUsuariosParams): Promise<UsuarioData[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('parametroBusqueda', params?.parametroBusqueda || '');

      const response = await this.makeRequest<UsuarioRaw[] | UsuarioApiResponse<UsuarioRaw[] | UsuarioRaw>>(
        `/listar?${queryParams.toString()}`,
        { method: 'GET' }
      );

      let items: UsuarioRaw[];
      if (Array.isArray(response)) {
        items = response;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else {
        items = response.data ? [response.data] : [];
      }

      return this.normalizeData(items);
    } catch (error) {
      console.error('[UsuarioService] Error listando usuarios:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   * POST /api/usuario/insertar
   */
  async insertar(datos: CreateUsuarioDTO): Promise<UsuarioData> {
    try {
      const response = await this.makeRequest<UsuarioRaw | UsuarioApiResponse<UsuarioRaw>>('/insertar', {
        method: 'POST',
        body: JSON.stringify(datos)
      });

      const created = extraerUsuario(response) ?? {
        ...datos,
        estado: datos.codEstado
      };
      return this.normalizeOptions.normalizeItem(created, 0);
    } catch (error) {
      console.error('[UsuarioService] Error al insertar usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   * PUT /api/usuario/actualizar
   */
  async actualizar(datos: UpdateUsuarioDTO): Promise<UsuarioData> {
    try {
      const response = await this.makeRequest<UsuarioRaw | UsuarioApiResponse<UsuarioRaw>>('/actualizar', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });

      const updated = extraerUsuario(response) ?? {
        ...datos,
        estado: datos.codEstado
      };
      return this.normalizeOptions.normalizeItem(updated, 0);
    } catch (error) {
      console.error('[UsuarioService] Error al actualizar usuario:', error);
      throw error;
    }
  }

  /**
   * Cambia la contrasena de un usuario
   * PUT /api/usuario/cambiarClave
   */
  async cambiarClave(datos: CambiarClaveDTO): Promise<void> {
    try {
      await this.makeRequest('/cambiarClave', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });
    } catch (error) {
      console.error('[UsuarioService] Error al cambiar clave:', error);
      throw error;
    }
  }

  /**
   * Da de baja un usuario
   * PUT /api/usuario/darBaja
   */
  async darBaja(datos: DarBajaDTO): Promise<void> {
    try {
      await this.makeRequest('/darBaja', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });
    } catch (error) {
      console.error('[UsuarioService] Error al dar de baja usuario:', error);
      throw error;
    }
  }

  /**
   * Activa un usuario
   * PUT /api/usuario/activar
   */
  async activar(datos: ActivarDTO): Promise<void> {
    try {
      await this.makeRequest('/activar', {
        method: 'PUT',
        body: JSON.stringify(datos)
      });
    } catch (error) {
      console.error('[UsuarioService] Error al activar usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los usuarios (alias para listar sin parametros)
   */
  async obtenerTodos(): Promise<UsuarioData[]> {
    return this.listar({ parametroBusqueda: '' });
  }

  /**
   * Busca usuarios por parametro
   */
  async buscar(parametroBusqueda: string): Promise<UsuarioData[]> {
    return this.listar({ parametroBusqueda });
  }

  /**
   * Verifica credenciales de supervisor/cajero
   * GET /api/usuario/verificarSupervisorCajero?username=davila&password=123456
   */
  async verificarSupervisorCajero(username: string, password: string): Promise<boolean> {
    try {
      const queryParams = new URLSearchParams({ username, password });

      const response = await this.makeRequest<string | UsuarioApiResponse<unknown>>(
        `/verificarSupervisorCajero?${queryParams.toString()}`,
        { method: 'GET' }
      );

      // El backend retorna "data": "Usuario correcto."
      const rawData =
        typeof response === 'object' && response !== null && 'data' in response ? response.data : response;
      return String(rawData).toLowerCase().includes('usuario correcto');
    } catch (error) {
      console.error('[UsuarioService] Error al verificar supervisor:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const usuarioService = UsuarioService.getInstance();
