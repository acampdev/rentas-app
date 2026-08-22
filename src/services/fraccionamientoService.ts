// src/services/fraccionamientoService.ts
import { buildApiUrl } from '../config/api.unified.config';
import apiClient from './apiClient';
import type {
  Fraccionamiento,
  DeudaFraccionamiento,
  CuotaFraccionamiento,
  AprobacionFraccionamientoForm,
  FraccionamientoFiltros,
  EstadisticasFraccionamiento,
  CronogramaContribuyente
} from '../types/fraccionamiento.types';

const unwrapData = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

const unwrapList = <T>(payload: unknown): T[] => {
  const data = unwrapData<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  return data === null || data === undefined ? [] : [data as T];
};

/**
 * Servicio para gestión de Fraccionamientos
 * Todas las operaciones se ejecutan mediante el cliente HTTP autenticado.
 */
class FraccionamientoService {
  private static instance: FraccionamientoService;
  private readonly endpoint = '/api/fraccionamiento';

  private constructor() {}

  static getInstance(): FraccionamientoService {
    if (!FraccionamientoService.instance) {
      FraccionamientoService.instance = new FraccionamientoService();
    }
    return FraccionamientoService.instance;
  }

  // Solicitudes
  async crearSolicitud(data: any): Promise<Fraccionamiento> {
    const url = buildApiUrl(this.endpoint);
    console.log('🌐 [FraccionamientoService] POST Request to:', url);
    console.log('📦 [FraccionamientoService] Request Payload:', JSON.stringify(data, null, 2));

    try {
      const result = await apiClient.request<unknown>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      console.log('✅ [FraccionamientoService] Response Success Data:', result);
      return unwrapData<Fraccionamiento>(result);
    } catch (err) {
      console.error('💥 [FraccionamientoService] Fetch exception:', err);
      throw err;
    }
  }

  async obtenerSolicitudes(filtros?: FraccionamientoFiltros): Promise<Fraccionamiento[]> {
    const params: Record<string, string> = {};
    if (filtros?.codContribuyente) params.codContribuyente = String(filtros.codContribuyente);
    if (filtros?.codigoFraccionamiento) params.codigo = String(filtros.codigoFraccionamiento);
    if (filtros?.estado) params.estado = String(filtros.estado);

    const url = buildApiUrl(this.endpoint, params);
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapList<Fraccionamiento>(result);
  }

  async obtenerSolicitudPorId(id: number): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}`);
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapData<Fraccionamiento>(result);
  }

  async obtenerSolicitudPorCodigo(codigo: string): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/codigo/${codigo}`);
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapData<Fraccionamiento>(result);
  }

  // Aprobación
  async aprobarSolicitud(id: number, data: AprobacionFraccionamientoForm): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}/aprobar`);
    const result = await apiClient.request<unknown>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    return unwrapData<Fraccionamiento>(result);
  }

  async rechazarSolicitud(id: number, motivo: string): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}/rechazar`);
    const result = await apiClient.request<unknown>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ motivoRechazo: motivo })
    });

    return unwrapData<Fraccionamiento>(result);
  }

  async obtenerDeudasContribuyente(codigoContribuyente: string): Promise<DeudaFraccionamiento[]> {
    void codigoContribuyente;
    throw new Error(
      'Módulo no disponible: la consulta de deudas de fraccionamiento aún no está conectada al API.'
    );
  }

  async agregarDeuda(idFraccionamiento: number, deuda: DeudaFraccionamiento): Promise<DeudaFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/deudas`);
    const result = await apiClient.request<unknown>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(deuda)
    });

    return unwrapData<DeudaFraccionamiento>(result);
  }

  async eliminarDeuda(idFraccionamiento: number, idDeuda: number): Promise<void> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/deudas/${idDeuda}`);
    await apiClient.request<unknown>(url, { method: 'PUT' });
  }

  // Cronograma
  async generarCronograma(idFraccionamiento: number): Promise<CuotaFraccionamiento[]> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/cronograma/generar`);
    const result = await apiClient.request<unknown>(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapList<CuotaFraccionamiento>(result);
  }

  async obtenerCronograma(anio: number, codResolucion: number): Promise<CuotaFraccionamiento[]> {
    const url = buildApiUrl(`${this.endpoint}/listarCronograma`, {
      anio: String(anio),
      codResolucion: String(codResolucion)
    });
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapList<CuotaFraccionamiento>(result);
  }

  async registrarPagoCuota(idFraccionamiento: number, idCuota: number, monto: number): Promise<CuotaFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/cuotas/${idCuota}/pagar`);
    const result = await apiClient.request<unknown>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ monto })
    });

    return unwrapData<CuotaFraccionamiento>(result);
  }

  // Búsqueda y filtros
  async buscarPorContribuyente(codigoContribuyente: string): Promise<Fraccionamiento[]> {
    const url = buildApiUrl(this.endpoint, { codContribuyente: codigoContribuyente });
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapList<Fraccionamiento>(result);
  }

  async buscarPorEstado(estado: string): Promise<Fraccionamiento[]> {
    const url = buildApiUrl(`${this.endpoint}/estado/${estado}`);
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapList<Fraccionamiento>(result);
  }

  // Estadísticas
  async obtenerEstadisticas(): Promise<EstadisticasFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/estadisticas`);
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapData<EstadisticasFraccionamiento>(result);
  }

  async obtenerEstadisticasPorPeriodo(fechaInicio: string, fechaFin: string): Promise<EstadisticasFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/estadisticas/periodo`, { fechaInicio, fechaFin });
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapData<EstadisticasFraccionamiento>(result);
  }

  // Cancelación
  async cancelarFraccionamiento(id: number, motivo: string): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}/cancelar`);
    const result = await apiClient.request<unknown>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ motivo })
    });

    return unwrapData<Fraccionamiento>(result);
  }

  // Actualización
  async actualizarFraccionamiento(id: number, data: Partial<Fraccionamiento>): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}`);
    const result = await apiClient.request<unknown>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    return unwrapData<Fraccionamiento>(result);
  }

  // Validación
  async validarMontoMinimo(monto: number): Promise<boolean> {
    const url = buildApiUrl(`${this.endpoint}/validar/monto-minimo`, { monto: monto.toString() });
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapData<{ valido?: boolean }>(result).valido || false;
  }

  async validarDeudaContribuyente(codigoContribuyente: string): Promise<{ valido: boolean; mensaje?: string }> {
    const url = buildApiUrl(`${this.endpoint}/validar/deuda/${codigoContribuyente}`);
    const result = await apiClient.request<unknown>(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    return unwrapData<{ valido: boolean; mensaje?: string }>(result);
  }

  // Reportes
  async generarReporteSolicitudes(filtros?: FraccionamientoFiltros): Promise<Blob> {
    const params: Record<string, string> = {};
    if (filtros?.estado) params.estado = filtros.estado;

    const url = buildApiUrl(`${this.endpoint}/reportes/solicitudes`, params);
    const response = await apiClient.fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/pdf' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.blob();
  }

  async generarReporteCronograma(idFraccionamiento: number): Promise<Blob> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/reportes/cronograma`);
    const response = await apiClient.fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/pdf' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.blob();
  }

  async listarCronogramaContribuyente(codContribuyente: number | string): Promise<CronogramaContribuyente[]> {
    const url = buildApiUrl('/api/fraccionamiento/listarCronogramaContri', {
      codContribuyente: String(codContribuyente)
    });
    const result = await apiClient.request<unknown>(url, {
      method: 'GET'
    });
    const items = unwrapList<unknown>(result);

    return items.map((item) => {
      const raw = item as Record<string, unknown>;
      return {
        anio: Number(raw.anio) || 0,
        codResolucion: Number(raw.codResolucion) || 0,
        numeroCuota: Number(raw.numeroCuota) || 0,
        saldoInicio: Number(raw.saldoInicio) || 0,
        interes: Number(raw.interes) || 0,
        amortizacion: Number(raw.amortizacion) || 0,
        montoCuota: Number(raw.montoCuota) || 0,
        fechaVencimiento: String(raw.fechaVencimiento || ''),
        pagado: raw.pagado === true || String(raw.pagado).toLowerCase() === 'true',
        fechaPago: raw.fechaPago ? String(raw.fechaPago) : null,
        montoPagado: raw.montoPagado === null || raw.montoPagado === undefined ? null : Number(raw.montoPagado),
        numeroPago: raw.numeroPago === null || raw.numeroPago === undefined ? null : Number(raw.numeroPago),
        codContribuyente: Number(raw.codContribuyente) || Number(codContribuyente)
      };
    });
  }

  async getAll(filtros?: FraccionamientoFiltros): Promise<Fraccionamiento[]> {
    return this.obtenerSolicitudes(filtros);
  }

  async create(data: any): Promise<Fraccionamiento> {
    return this.crearSolicitud(data);
  }
}

export const fraccionamientoService = FraccionamientoService.getInstance();
export default fraccionamientoService;
