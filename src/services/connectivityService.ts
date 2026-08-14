// src/services/connectivityService.ts
/**
 * Servicio para monitorear la conectividad con las APIs
 * Verifica disponibilidad usando endpoints GET que no requieren autenticación
 */

import { 
  buildApiUrl, 
  getApiHeaders, 
  API_CONFIG,
  getHealthCheckEndpoints 
} from '../config/api.unified.config';

/**
 * Estado detallado de una API
 */
interface ApiStatus {
  available: boolean;
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}

/**
 * Configuración del servicio
 */
interface ConnectivityConfig {
  checkInterval: number;
  timeout: number;
  retryAttempts: number;
}

/**
 * Servicio para monitorear y gestionar la conectividad con las APIs
 */
class ConnectivityService {
  private isOnline: boolean = navigator.onLine;
  private apiStatus: Map<string, ApiStatus> = new Map();
  private listeners: Array<(status: boolean, apiName?: string) => void> = [];
  private intervalId: number | null = null;
  
  private config: ConnectivityConfig = {
    checkInterval: 60000, // 60 segundos en lugar de 30
    timeout: 10000, // 10 segundos de timeout
    retryAttempts: 1 // Solo 1 reintento
  };

  // Endpoints que sabemos que funcionan correctamente para health checks
  private healthCheckEndpoints = [
    '/api/sector',
    '/api/barrio',
    '/api/contribuyente',
    '/api/predio'
    // Removidos endpoints problemáticos como arancel, uit, etc.
  ];

  constructor() {
    console.log('🔧 [ConnectivityService] Inicializado');
    console.log('🌐 [ConnectivityService] API Base URL:', API_CONFIG.baseURL);
    console.log('📍 [ConnectivityService] Endpoints de verificación:', this.healthCheckEndpoints);
    
    this.setupEventListeners();
    this.initializeApiStatus();
    this.startMonitoring();
  }

  /**
   * Inicializa el estado de las APIs
   */
  private initializeApiStatus(): void {
    this.healthCheckEndpoints.forEach(endpoint => {
      const apiName = this.getApiNameFromEndpoint(endpoint);
      this.apiStatus.set(apiName, {
        available: false,
        lastCheck: new Date()
      });
    });
  }

  /**
   * Extrae el nombre de la API del endpoint
   */
  private getApiNameFromEndpoint(endpoint: string): string {
    const parts = endpoint.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }

  /**
   * Configura los listeners de eventos de red
   */
  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      console.log('🌐 [ConnectivityService] Conexión a Internet restaurada');
      this.isOnline = true;
      this.checkAllApis();
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      console.log('🚫 [ConnectivityService] Sin conexión a Internet');
      this.isOnline = false;
      this.updateAllApiStatus(false);
      this.notifyListeners(false);
    });

    // Verificar cuando la pestaña vuelve a estar activa
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('👁️ [ConnectivityService] Pestaña activa, verificando conexión...');
        this.checkAllApis();
      }
    });
  }

  /**
   * Actualiza el estado de todas las APIs
   */
  private updateAllApiStatus(available: boolean, error?: string): void {
    this.healthCheckEndpoints.forEach(endpoint => {
      const apiName = this.getApiNameFromEndpoint(endpoint);
      this.apiStatus.set(apiName, {
        available,
        lastCheck: new Date(),
        error
      });
    });
  }

  /**
   * Verifica la disponibilidad de un endpoint específico
   * Maneja diferentes tipos de respuesta del backend
   */
  private async checkEndpoint(endpoint: string): Promise<boolean> {
    const apiName = this.getApiNameFromEndpoint(endpoint);
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      // Usar buildApiUrl para obtener la URL correcta (con proxy en desarrollo)
      const url = buildApiUrl(endpoint);
      
      // Intentar con GET y parámetros mínimos
      const response = await fetch(url + '?limite=1', {
        method: 'GET',
        headers: {
          ...getApiHeaders(false), // Sin autenticación para health checks
          'Accept': 'application/json' // Asegurar que esperamos JSON
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      let isAvailable = false;
      
      // Verificar el tipo de contenido de la respuesta
      const contentType = response.headers.get('content-type');
      
      if (response.ok && contentType?.includes('application/json')) {
        // Si es JSON, intentar parsearlo para verificar que es válido
        try {
          await response.json();
          isAvailable = true;
        } catch {
          // Si no se puede parsear el JSON, considerar no disponible
          isAvailable = false;
        }
      } else if (response.status === 401 || response.status === 403) {
        // Estos estados pueden ser válidos (requieren autenticación)
        isAvailable = true;
      } else if (response.status === 404) {
        // 404 significa que el endpoint no existe
        isAvailable = false;
      } else if (contentType?.includes('text/html')) {
        // Si devuelve HTML, probablemente es una página de error
        console.warn(`⚠️ [ConnectivityService] ${apiName} devolvió HTML en lugar de JSON`);
        isAvailable = false;
      }
      
      this.apiStatus.set(apiName, {
        available: isAvailable,
        lastCheck: new Date(),
        responseTime,
        error: isAvailable ? undefined : `HTTP ${response.status} - ${response.statusText}`
      });
      
      console.log(
        `${isAvailable ? '✅' : '❌'} [ConnectivityService] ${apiName}: ${
          isAvailable ? 'Disponible' : 'No disponible'
        } (${responseTime}ms)`
      );
      
      return isAvailable;
      
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError' ? 'Timeout' : error.message;
      
      this.apiStatus.set(apiName, {
        available: false,
        lastCheck: new Date(),
        error: errorMessage
      });
      
      // Solo loguear errores reales, no los esperados
      if (error.name !== 'AbortError') {
        console.error(`❌ [ConnectivityService] Error verificando ${apiName}:`, errorMessage);
      }
      
      return false;
    }
  }

  /**
   * Verifica la disponibilidad de todas las APIs
   */
  public async checkAllApis(): Promise<Map<string, ApiStatus>> {
    if (!this.isOnline) {
      console.warn('⚠️ [ConnectivityService] Sin conexión a internet');
      this.updateAllApiStatus(false, 'Sin conexión a internet');
      return this.apiStatus;
    }
    
    console.log('🔍 [ConnectivityService] Verificando disponibilidad de APIs...');
    
    // Verificar APIs en paralelo
    const promises = this.healthCheckEndpoints.map(endpoint => 
      this.checkEndpoint(endpoint)
    );
    
    await Promise.allSettled(promises);
    
    // Notificar cambios
    this.notifyListeners(this.isOnline);
    
    return new Map(this.apiStatus);
  }

  /**
   * Inicia el monitoreo periódico
   */
  private startMonitoring(): void {
    // Verificación inicial
    this.checkAllApis();
    
    // Configurar verificaciones periódicas
    this.intervalId = window.setInterval(() => {
      this.checkAllApis();
    }, this.config.checkInterval);
    
    console.log('⏰ [ConnectivityService] Monitoreo iniciado cada', 
      this.config.checkInterval / 1000, 'segundos');
  }

  /**
   * Detiene el monitoreo periódico
   */
  public stopMonitoring(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ [ConnectivityService] Monitoreo detenido');
    }
  }

  /**
   * Reanuda el monitoreo periódico
   */
  public resumeMonitoring(): void {
    this.startMonitoring();
  }

  /**
   * Notifica a los listeners sobre cambios de estado
   */
  private notifyListeners(isOnline: boolean, apiName?: string): void {
    this.listeners.forEach(listener => {
      try {
        listener(isOnline, apiName);
      } catch (error) {
        console.error('❌ [ConnectivityService] Error en listener:', error);
      }
    });
  }

  /**
   * Añade un listener para cambios de conectividad
   */
  public addListener(
    callback: (isOnline: boolean, apiName?: string) => void
  ): () => void {
    this.listeners.push(callback);
    
    // Notificar estado actual inmediatamente
    callback(this.isOnline);
    
    // Retornar función para eliminar el listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Obtiene el estado general de conectividad
   */
  public getStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Obtiene el estado de una API específica
   */
  public getApiStatus(apiName: string): ApiStatus | undefined {
    return this.apiStatus.get(apiName);
  }

  /**
   * Obtiene el estado de todas las APIs
   */
  public getAllApiStatus(): Map<string, ApiStatus> {
    return new Map(this.apiStatus);
  }

  /**
   * Verifica si al menos una API está disponible
   */
  public isAnyApiAvailable(): boolean {
    if (!this.isOnline) return false;
    
    for (const [_, status] of this.apiStatus) {
      if (status.available) return true;
    }
    
    return false;
  }

  /**
   * Fuerza una verificación inmediata
   */
  public async forceCheck(apiName?: string): Promise<boolean> {
    if (apiName) {
      const endpoint = this.healthCheckEndpoints.find(ep => 
        this.getApiNameFromEndpoint(ep) === apiName
      );
      
      if (endpoint) {
        return await this.checkEndpoint(endpoint);
      }
      
      console.warn(`⚠️ [ConnectivityService] API '${apiName}' no encontrada`);
      return false;
    }
    
    await this.checkAllApis();
    return this.isAnyApiAvailable();
  }

  /**
   * Obtiene estadísticas de conectividad
   */
  public getStatistics(): {
    online: boolean;
    totalApis: number;
    availableApis: number;
    averageResponseTime: number;
    lastCheck: Date;
  } {
    const availableApis = Array.from(this.apiStatus.values())
      .filter(status => status.available).length;
    
    const responseTimes = Array.from(this.apiStatus.values())
      .filter(status => status.responseTime)
      .map(status => status.responseTime!);
    
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    
    const lastChecks = Array.from(this.apiStatus.values())
      .map(status => status.lastCheck);
    
    const lastCheck = lastChecks.length > 0
      ? new Date(Math.max(...lastChecks.map(d => d.getTime())))
      : new Date();
    
    return {
      online: this.isOnline,
      totalApis: this.apiStatus.size,
      availableApis,
      averageResponseTime: Math.round(averageResponseTime),
      lastCheck
    };
  }

  /**
   * Actualiza la configuración del servicio
   */
  public updateConfig(config: Partial<ConnectivityConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Reiniciar monitoreo si cambió el intervalo
    if (config.checkInterval) {
      this.stopMonitoring();
      this.startMonitoring();
    }
    
    console.log('⚙️ [ConnectivityService] Configuración actualizada:', this.config);
  }


}

// Exportar instancia singleton
export const connectivityService = new ConnectivityService();

// En desarrollo, exponer controles en la consola
if (import.meta.env.DEV) {
  (window as any).connectivity = {
    start: () => {
      connectivityService.resumeMonitoring();
      console.log('✅ Monitoreo iniciado');
    },
    stop: () => {
      connectivityService.stopMonitoring();
      console.log('⏹️ Monitoreo detenido');
    },
    check: () => {
      console.log('🔍 Verificando conectividad...');
      return connectivityService.checkAllApis();
    },
    status: () => {
      const stats = connectivityService.getStatistics();
      console.table(stats);
      return stats;
    },
    setEndpoints: (endpoints: string[]) => {
      (connectivityService as any).healthCheckEndpoints = endpoints;
      console.log('📍 Endpoints actualizados:', endpoints);
    }
  };
  
  console.log('🎮 Controles de conectividad disponibles en la consola:');
  console.log('   connectivity.start()  - Iniciar monitoreo');
  console.log('   connectivity.stop()   - Detener monitoreo');
  console.log('   connectivity.check()  - Verificar ahora');
  console.log('   connectivity.status() - Ver estadísticas');
  console.log('   connectivity.setEndpoints([...]) - Cambiar endpoints');
}

// Exportar tipos útiles
export type { ApiStatus, ConnectivityConfig };
