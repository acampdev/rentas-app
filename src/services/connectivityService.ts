import { API_CONFIG } from "../config/api.unified.config";
import { logger } from "../utils/logger";
import {
  checkConnectivityEndpoint,
  getApiName,
} from "./connectivity/connectivityCheck";
import { exposeConnectivityDevtools } from "./connectivity/connectivityDevtools";
import { calculateConnectivityStatistics } from "./connectivity/connectivityStatistics";
import type {
  ApiStatus,
  ConnectivityConfig,
  ConnectivityListener,
  ConnectivityStatistics,
} from "./connectivity/connectivity.types";

const DEFAULT_ENDPOINTS = [
  "/api/sector",
  "/api/barrio",
  "/api/contribuyente",
  "/api/predio",
];

class ConnectivityService {
  private isOnline = navigator.onLine;
  private readonly apiStatus = new Map<string, ApiStatus>();
  private listeners: ConnectivityListener[] = [];
  private intervalId: number | null = null;
  private healthCheckEndpoints = [...DEFAULT_ENDPOINTS];
  private config: ConnectivityConfig = {
    checkInterval: 60_000,
    timeout: 10_000,
    retryAttempts: 1,
  };

  constructor() {
    logger.log("🔧 [ConnectivityService] Inicializado", API_CONFIG.baseURL);
    this.initializeApiStatus();
    this.setupEventListeners();
    this.startMonitoring();
  }

  private initializeApiStatus(): void {
    this.healthCheckEndpoints.forEach((endpoint) => {
      this.apiStatus.set(getApiName(endpoint), {
        available: false,
        lastCheck: new Date(),
      });
    });
  }

  private setupEventListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true;
      void this.checkAllApis();
      this.notifyListeners(true);
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.updateAllApiStatus(false, "Sin conexión a internet");
      this.notifyListeners(false);
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void this.checkAllApis();
    });
  }

  private updateAllApiStatus(available: boolean, error?: string): void {
    this.healthCheckEndpoints.forEach((endpoint) => {
      this.apiStatus.set(getApiName(endpoint), {
        available,
        lastCheck: new Date(),
        error,
      });
    });
  }

  private async checkEndpoint(endpoint: string): Promise<boolean> {
    const status = await checkConnectivityEndpoint(
      endpoint,
      this.config.timeout,
    );
    this.apiStatus.set(getApiName(endpoint), status);
    return status.available;
  }

  public async checkAllApis(): Promise<Map<string, ApiStatus>> {
    if (!this.isOnline) {
      this.updateAllApiStatus(false, "Sin conexión a internet");
      return new Map(this.apiStatus);
    }
    await Promise.allSettled(
      this.healthCheckEndpoints.map((endpoint) => this.checkEndpoint(endpoint)),
    );
    this.notifyListeners(this.isOnline);
    return new Map(this.apiStatus);
  }

  private startMonitoring(): void {
    if (this.intervalId !== null) window.clearInterval(this.intervalId);
    void this.checkAllApis();
    this.intervalId = window.setInterval(
      () => void this.checkAllApis(),
      this.config.checkInterval,
    );
  }

  public stopMonitoring(): void {
    if (this.intervalId === null) return;
    window.clearInterval(this.intervalId);
    this.intervalId = null;
  }

  public resumeMonitoring(): void {
    this.startMonitoring();
  }

  private notifyListeners(isOnline: boolean, apiName?: string): void {
    this.listeners.forEach((listener) => {
      try {
        listener(isOnline, apiName);
      } catch (error) {
        logger.error("❌ [ConnectivityService] Error en listener:", error);
      }
    });
  }

  public addListener(callback: ConnectivityListener): () => void {
    this.listeners.push(callback);
    callback(this.isOnline);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  public getStatus(): boolean {
    return this.isOnline;
  }

  public getApiStatus(apiName: string): ApiStatus | undefined {
    return this.apiStatus.get(apiName);
  }

  public getAllApiStatus(): Map<string, ApiStatus> {
    return new Map(this.apiStatus);
  }

  public isAnyApiAvailable(): boolean {
    return (
      this.isOnline &&
      Array.from(this.apiStatus.values()).some(({ available }) => available)
    );
  }

  public async forceCheck(apiName?: string): Promise<boolean> {
    if (!apiName) {
      await this.checkAllApis();
      return this.isAnyApiAvailable();
    }
    const endpoint = this.healthCheckEndpoints.find(
      (candidate) => getApiName(candidate) === apiName,
    );
    if (!endpoint) {
      logger.warn(`⚠️ [ConnectivityService] API '${apiName}' no encontrada`);
      return false;
    }
    return this.checkEndpoint(endpoint);
  }

  public getStatistics(): ConnectivityStatistics {
    return calculateConnectivityStatistics(this.isOnline, this.apiStatus);
  }

  public updateConfig(config: Partial<ConnectivityConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.checkInterval) this.startMonitoring();
  }

  public setHealthCheckEndpoints(endpoints: string[]): void {
    this.healthCheckEndpoints = [...endpoints];
    this.apiStatus.clear();
    this.initializeApiStatus();
  }
}

export const connectivityService = new ConnectivityService();
exposeConnectivityDevtools(connectivityService);

export type { ApiStatus, ConnectivityConfig };
