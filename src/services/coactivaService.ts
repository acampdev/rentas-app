import BaseApiService from './BaseApiService';
import { 
  ExpedienteCoactivo, 
  NotificacionCoactiva, 
  ResolucionCoactiva,
  CreateExpedienteDTO 
} from '../models/Coactiva';

/**
 * Servicio para gestión de Cobranza Coactiva
 */
class CoactivaService extends BaseApiService<ExpedienteCoactivo, CreateExpedienteDTO, Partial<CreateExpedienteDTO>> {
  private static instance: CoactivaService;

  private constructor() {
    super(
      '/api/coactiva',
      {
        normalizeItem: (item: Record<string, unknown>) => ({
          id: (item.id as number) || (item.codExpediente as number) || 0,
          numeroExpediente: (item.numeroExpediente as string) || '',
          codContribuyente: (item.codContribuyente as number) || 0,
          contribuyente: (item.contribuyente as string) || (item.nombrePersona as string) || '',
          dni: (item.dni as string) || (item.documento as string) || '',
          montoDeuda: parseFloat(String(item.montoDeuda || '0')),
          estado: (item.estado as ExpedienteCoactivo['estado']) || 'En Proceso',
          fechaInicio: (item.fechaInicio as string) || '',
          ultimaActualizacion: (item.ultimaActualizacion as string) || '',
          tipoDeuda: (item.tipoDeuda as string) || '',
          observaciones: (item.observaciones as string) || ''
        }),
        validateItem: (item: ExpedienteCoactivo) => !!item.numeroExpediente
      },
      'expedientes-coactiva'
    );
  }

  static getInstance(): CoactivaService {
    if (!CoactivaService.instance) {
      CoactivaService.instance = new CoactivaService();
    }
    return CoactivaService.instance;
  }

  // Métodos específicos para notificaciones
  async listarNotificaciones(_params?: Record<string, unknown>): Promise<NotificacionCoactiva[]> {
    try {
      const responseData = await this.makeRequest<
        { data?: Record<string, unknown>[] } | Record<string, unknown>[]
      >('/notificaciones', { method: 'GET' });
      const data = Array.isArray(responseData) ? responseData : responseData?.data;
      
      if (!Array.isArray(data)) return [];

      return data.map((n: Record<string, unknown>) => ({
        id: (n.id as number) || 0,
        idExpediente: (n.idExpediente as number) || 0,
        numeroExpediente: (n.numeroExpediente as string) || '',
        contribuyente: (n.contribuyente as string) || '',
        fechaEmision: (n.fechaEmision as string) || '',
        fechaNotificacion: (n.fechaNotificacion as string) || null,
        tipoNotificacion: (n.tipoNotificacion as string) || '',
        estado: (n.estado as NotificacionCoactiva['estado']) || 'Pendiente'
      }));
    } catch (error: unknown) {
      console.error('[CoactivaService] Error notificaciones:', error);
      return [];
    }
  }

  // Métodos específicos para resoluciones
  async listarResoluciones(_params?: Record<string, unknown>): Promise<ResolucionCoactiva[]> {
    try {
      const responseData = await this.makeRequest<
        { data?: Record<string, unknown>[] } | Record<string, unknown>[]
      >('/resoluciones', { method: 'GET' });
      const data = Array.isArray(responseData) ? responseData : responseData?.data;

      if (!Array.isArray(data)) return [];

      return data.map((r: Record<string, unknown>) => ({
        id: (r.id as number) || 0,
        idExpediente: (r.idExpediente as number) || 0,
        numeroResolucion: (r.numeroResolucion as string) || '',
        fechaResolucion: (r.fechaResolucion as string) || '',
        tipoResolucion: (r.tipoResolucion as string) || '',
        montoSancion: r.montoSancion ? parseFloat(String(r.montoSancion)) : undefined,
        detalle: (r.detalle as string) || ''
      }));
    } catch (error: unknown) {
      console.error('[CoactivaService] Error resoluciones:', error);
      return [];
    }
  }
}

export const coactivaService = CoactivaService.getInstance();
export default coactivaService;
