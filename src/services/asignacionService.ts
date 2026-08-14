// src/services/asignacionService.ts
import { buildApiUrl } from '../config/api.unified.config';

export interface AsignacionPredio {
  id: number;
  anio: number;
  codPredio: string;
  codPredioBase: number | null;
  codContribuyente: string;
  codAsignacion: string | null;
  porcentajeCondomino: number | null;
  porcentajeCondominoDesc: string;
  fechaDeclaracion: string;
  fechaVenta: string;
  fechaDeclaracionStr: string;
  fechaVentaStr: string;
  codModoDeclaracion: string;
  modoDeclaracion: string;
  pensionista: number;
  pensionistaDesc: string;
  codEstado: string;
  estado: string;
  codUsuario: number | null;
  nombreContribuyente: string;
  codPredioContribuyente: number | null;
  // Campos de predio
  direccionCompleta: string;
  autoavaluo: number;
  baseImponible: number;
  impuestoAnual: number;
  // Campos de compatibilidad (legacy)
  porcentajeCondominio?: number;
  esPensionista?: boolean;
  porcentajeLibre?: number;
}

export interface AsignacionQueryParams {
  codPredio?: string;
  codContribuyente?: string;
  anio?: number;
}

export interface CreateAsignacionAPIDTO {
  anio: number;
  codPredio: string;
  codContribuyente: number;
  codAsignacion: null;
  porcentajeCondomino?: number | null;
  fechaDeclaracion: string; // formato: "YYYY-MM-DD"
  fechaVenta: string; // formato: "YYYY-MM-DD"
  codModoDeclaracion: string;
  pensionista: number; // 1 = sí, 0 = no
  codEstado: string;
}

class AsignacionService {
  private baseURL: string;

  constructor() {
    this.baseURL = buildApiUrl('/api/asignacionpredio');
  }

  /**
   * Helper para normalizar un item de asignación
   */
  private normalizeItem(item: any, index: number = 0): AsignacionPredio {
    return {
      id: item.codAsignacion || item.codPredioContribuyente || index + 1,
      anio: item.anio || new Date().getFullYear(),
      codPredio: (item.codPredio || '').trim(),
      codPredioBase: item.codPredioBase || null,
      codContribuyente: item.codContribuyente?.toString() || '',
      codAsignacion: item.codAsignacion || null,
      porcentajeCondomino: item.porcentajeCondomino || null,
      porcentajeCondominoDesc: item.porcentajeCondominoDesc || `${item.porcentajeCondomino || 100}%`,
      fechaDeclaracion: item.fechaDeclaracion || '',
      fechaVenta: item.fechaVenta || '',
      fechaDeclaracionStr: item.fechaDeclaracionStr || '',
      fechaVentaStr: item.fechaVentaStr || '',
      codModoDeclaracion: item.codModoDeclaracion || '',
      modoDeclaracion: item.modoDeclaracion || '',
      pensionista: item.pensionista || 0,
      pensionistaDesc: item.pensionistaDesc || (item.pensionista === 1 ? 'Sí' : 'No'),
      codEstado: item.codEstado || '0201',
      estado: item.estado || (item.codEstado === "0201" ? "ACTIVO" : "INACTIVO"),
      codUsuario: item.codUsuario || null,
      nombreContribuyente: item.nombreContribuyente || item.contribuyente || '',
      codPredioContribuyente: item.codPredioContribuyente || null,
      // Campos de predio
      direccionCompleta: item.direccionCompleta || '',
      autoavaluo: item.autoavaluo || 0,
      baseImponible: item.baseImponible || 0,
      impuestoAnual: item.impuestoAnual || 0,
      // Campos de compatibilidad (legacy)
      porcentajeCondominio: item.porcentajeCondomino || 100,
      esPensionista: item.pensionista === 1,
      porcentajeLibre: 100 - (item.porcentajeCondomino || 100)
    };
  }

  /**
   * Buscar asignaciones de predio por parámetros
   */
  async buscarAsignaciones(params: AsignacionQueryParams): Promise<AsignacionPredio[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.codPredio) queryParams.append('codPredio', params.codPredio);
      if (params.codContribuyente) queryParams.append('codContribuyente', params.codContribuyente);
      if (params.anio) queryParams.append('anio', params.anio.toString());

      const url = `${this.baseURL}?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const responseData = await response.json();
      let items = responseData.success && responseData.data ? responseData.data : responseData;
      items = Array.isArray(items) ? items : (items.anio || items.codPredio ? [items] : []);
      
      // Filtrar duplicados por combinación de anio, codPredio y codContribuyente
      const seen = new Set<string>();
      const uniqueItems = items.filter((item: any) => {
        if (!item) return false;
        const anioVal = item.anio || '';
        const predioVal = (item.codPredio || '').toString().trim();
        const contribVal = (item.codContribuyente || '').toString().trim();
        const key = `${anioVal}-${predioVal}-${contribVal}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
      
      return uniqueItems.map((item: any, idx: number) => this.normalizeItem(item, idx));
    } catch (error) {
      console.error('❌ [AsignacionService] Error al buscar asignaciones:', error);
      return [];
    }
  }

  async crearAsignacionAPI(datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const responseJson = await response.json();
      const responseData = responseJson.data || responseJson;
      return this.normalizeItem(responseData);
    } catch (error) {
      console.error('❌ [AsignacionService] Error al crear asignación:', error);
      throw error;
    }
  }

  /**
   * Actualizar una asignación de predio existente
   */
  async actualizarAsignacionAPI(datos: CreateAsignacionAPIDTO): Promise<AsignacionPredio> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const responseJson = await response.json();
      const responseData = responseJson.data || responseJson;
      return this.normalizeItem(responseData);
    } catch (error) {
      console.error('❌ [AsignacionService] Error al actualizar asignación:', error);
      throw error;
    }
  }

  /**
   * Obtener asignación por ID específico
   */
  async obtenerAsignacionPorId(id: number): Promise<AsignacionPredio | null> {
    try {
      const url = `${this.baseURL}/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const responseData = await response.json();
      return this.normalizeItem(responseData.data || responseData);
    } catch (error) {
      console.error('❌ [AsignacionService] Error al obtener asignación por ID:', error);
      return null;
    }
  }

  /**
   * Desasignar un predio llamando a /desasignar
   */
  async desasignarAPI(datos: CreateAsignacionAPIDTO): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/desasignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('❌ [AsignacionService] Error al desasignar predio:', error);
      throw error;
    }
  }
}

export const asignacionService = new AsignacionService();
export default asignacionService;
