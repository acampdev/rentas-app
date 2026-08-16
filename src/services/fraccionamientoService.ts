// src/services/fraccionamientoService.ts
import { buildApiUrl, getApiHeaders } from '../config/api.unified.config';
import type {
  Fraccionamiento,
  DeudaFraccionamiento,
  CuotaFraccionamiento,
  SolicitudFraccionamientoForm,
  AprobacionFraccionamientoForm,
  FraccionamientoFiltros,
  EstadisticasFraccionamiento,
  CronogramaContribuyente
} from '../types/fraccionamiento.types';

/**
 * Servicio para gestión de Fraccionamientos
 * NO requiere autenticación
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
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      console.log(`📡 [FraccionamientoService] Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ [FraccionamientoService] Response Error Body:`, text);
        throw new Error(`Error ${response.status}: ${text || response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ [FraccionamientoService] Response Success Data:', result);
      return result.data || result;
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
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  }

  async obtenerSolicitudPorId(id: number): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  async obtenerSolicitudPorCodigo(codigo: string): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/codigo/${codigo}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  // Aprobación
  async aprobarSolicitud(id: number, data: AprobacionFraccionamientoForm): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}/aprobar`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  async rechazarSolicitud(id: number, motivo: string): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}/rechazar`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ motivoRechazo: motivo })
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  async obtenerDeudasContribuyente(codigoContribuyente: string): Promise<DeudaFraccionamiento[]> {
    return this.obtenerDeudasMock(codigoContribuyente);
  }

  private obtenerDeudasMock(codigoContribuyente: string): DeudaFraccionamiento[] {
    return [
      {
        id: 101,
        codigoDeuda: 'D-2024-001',
        concepto: 'Impuesto Predial 2024 - 1er Trimestre',
        periodo: '2024-03',
        montoOriginal: 5000,
        montoInteres: 350,
        montoTotal: 5350,
        seleccionada: true
      },
      {
        id: 102,
        codigoDeuda: 'D-2024-002',
        concepto: 'Impuesto Predial 2024 - 2do Trimestre',
        periodo: '2024-06',
        montoOriginal: 5000,
        montoInteres: 250,
        montoTotal: 5250,
        seleccionada: true
      },
      {
        id: 103,
        codigoDeuda: 'D-2025-001',
        concepto: 'Arbitrios Limpieza Pública 2025',
        periodo: '2025-03',
        montoOriginal: 2200,
        montoInteres: 200,
        montoTotal: 2400,
        seleccionada: true
      }
    ];
  }

  async agregarDeuda(idFraccionamiento: number, deuda: DeudaFraccionamiento): Promise<DeudaFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/deudas`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(deuda)
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  async eliminarDeuda(idFraccionamiento: number, idDeuda: number): Promise<void> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/deudas/${idDeuda}`);
    const response = await fetch(url, { method: 'PUT' });
    if (!response.ok) throw new Error(`Error ${response.status}`);
  }

  // Cronograma
  async generarCronograma(idFraccionamiento: number): Promise<CuotaFraccionamiento[]> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/cronograma/generar`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  }

  async obtenerCronograma(anio: number, codResolucion: number): Promise<CuotaFraccionamiento[]> {
    const url = buildApiUrl(`${this.endpoint}/listarCronograma`, {
      anio: String(anio),
      codResolucion: String(codResolucion)
    });
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  }

  async registrarPagoCuota(idFraccionamiento: number, idCuota: number, monto: number): Promise<CuotaFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/cuotas/${idCuota}/pagar`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ monto })
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  // Búsqueda y filtros
  async buscarPorContribuyente(codigoContribuyente: string): Promise<Fraccionamiento[]> {
    const url = buildApiUrl(this.endpoint, { codContribuyente: codigoContribuyente });
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  }

  async buscarPorEstado(estado: string): Promise<Fraccionamiento[]> {
    const url = buildApiUrl(`${this.endpoint}/estado/${estado}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  }

  // Estadísticas
  async obtenerEstadisticas(): Promise<EstadisticasFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/estadisticas`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  async obtenerEstadisticasPorPeriodo(fechaInicio: string, fechaFin: string): Promise<EstadisticasFraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/estadisticas/periodo`, { fechaInicio, fechaFin });
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  // Cancelación
  async cancelarFraccionamiento(id: number, motivo: string): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}/cancelar`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ motivo })
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  // Actualización
  async actualizarFraccionamiento(id: number, data: Partial<Fraccionamiento>): Promise<Fraccionamiento> {
    const url = buildApiUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  }

  // Validación
  async validarMontoMinimo(monto: number): Promise<boolean> {
    const url = buildApiUrl(`${this.endpoint}/validar/monto-minimo`, { monto: monto.toString() });
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return result.valido || false;
  }

  async validarDeudaContribuyente(codigoContribuyente: string): Promise<{ valido: boolean; mensaje?: string }> {
    const url = buildApiUrl(`${this.endpoint}/validar/deuda/${codigoContribuyente}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  }

  // Reportes
  async generarReporteSolicitudes(filtros?: FraccionamientoFiltros): Promise<Blob> {
    const params: Record<string, string> = {};
    if (filtros?.estado) params.estado = filtros.estado;

    const url = buildApiUrl(`${this.endpoint}/reportes/solicitudes`, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/pdf' }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.blob();
  }

  async generarReporteCronograma(idFraccionamiento: number): Promise<Blob> {
    const url = buildApiUrl(`${this.endpoint}/${idFraccionamiento}/reportes/cronograma`);
    const response = await fetch(url, {
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
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders(true),
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = (await response.json()) as { data?: unknown } | unknown[];
    const items = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : result.data
          ? [result.data]
          : [];

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
