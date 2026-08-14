/**
 * Modelo que representa un Expediente de Cobranza Coactiva
 */
export interface ExpedienteCoactivo {
  id: number;
  numeroExpediente: string;
  codContribuyente: number;
  contribuyente: string;
  dni: string;
  montoDeuda: number;
  estado: 'En Proceso' | 'Notificado' | 'Ejecutado' | 'Cerrado';
  fechaInicio: string;
  ultimaActualizacion: string;
  tipoDeuda: string;
  observaciones?: string;
}

/**
 * Modelo para las Notificaciones de Coactiva
 */
export interface NotificacionCoactiva {
  id: number;
  idExpediente: number;
  numeroExpediente: string;
  contribuyente: string;
  fechaEmision: string;
  fechaNotificacion: string | null;
  tipoNotificacion: string;
  estado: 'Pendiente' | 'Entregada' | 'Rechazada';
}

/**
 * Modelo para las Resoluciones de Coactiva
 */
export interface ResolucionCoactiva {
  id: number;
  idExpediente: number;
  numeroResolucion: string;
  fechaResolucion: string;
  tipoResolucion: string;
  montoSancion?: number;
  detalle: string;
}

export interface CreateExpedienteDTO {
  numeroExpediente: string;
  codContribuyente: number;
  montoDeuda: number;
  tipoDeuda: string;
  observaciones?: string;
  codUsuario: number;
}
